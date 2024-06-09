import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, Flatten, Dense, Activation, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.regularizers import l2
import os
import json
import shutil
from divide import divide_images

def train_model(userId):
    print("Starting the training process...")
    print("Dividing images into training and validation sets...")
    divide_images() # Divide 80/20 training/validation
    print("Image division completed.")

    # Suppress TensorFlow logs and warnings
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

    print("Setting up TensorFlow to use GPU with memory growth...")
    # Set up TensorFlow to use GPU with memory growth
    gpus = tf.config.experimental.list_physical_devices('GPU')
    if gpus:
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
            logical_gpus = tf.config.experimental.list_logical_devices('GPU')
            print(f"{len(gpus)} Physical GPUs, {len(logical_gpus)} Logical GPUs")
        except RuntimeError as e:
            print(e)

    print("Data preprocessing without augmentation...")
    # Data preprocessing without augmentation
    train_datagen = ImageDataGenerator(rescale=1.0/255.0)
    validation_datagen = ImageDataGenerator(rescale=1.0/255.0)

    batch_size = 16

    print("Creating training data generator...")
    train_generator = train_datagen.flow_from_directory(
        '../model/dividedImages/train',
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        color_mode='rgb',
    )

    print("Creating validation data generator...")
    validation_generator = validation_datagen.flow_from_directory(
        '../model/dividedImages/validation',
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        color_mode='rgb',
    )

    print("Converting generators to tf.data.Dataset and repeating indefinitely...")
    # Convert generators to tf.data.Dataset and repeat indefinitely
    train_dataset = tf.data.Dataset.from_generator(
        lambda: train_generator,
        output_signature=(
            tf.TensorSpec(shape=(None, 224, 224, 3), dtype=tf.float32),
            tf.TensorSpec(shape=(None, train_generator.num_classes), dtype=tf.float32)
        )
    ).repeat()

    validation_dataset = tf.data.Dataset.from_generator(
        lambda: validation_generator,
        output_signature=(
            tf.TensorSpec(shape=(None, 224, 224, 3), dtype=tf.float32),
            tf.TensorSpec(shape=(None, validation_generator.num_classes), dtype=tf.float32)
        )
    ).repeat()

    print("Saving class indices for future use...")
    # Save class indices for future use
    with open('class_indices.json', 'w') as f:
        json.dump(train_generator.class_indices, f)

    print("Defining the model...")
    # Define the model
    model = Sequential()

    # Convolutional part
    N = 32
    for _ in range(3):  # Simplify the model
        model.add(Conv2D(N, (3, 3), padding='same', kernel_regularizer=l2(0.01), input_shape=(224, 224, 3) if _ == 0 else None))
        model.add(BatchNormalization())  # Add BatchNormalization
        model.add(Activation('relu'))
        model.add(Conv2D(N, (3, 3), strides=2, padding='same', kernel_regularizer=l2(0.01)))
        model.add(BatchNormalization())  # Add BatchNormalization
        model.add(Activation('relu'))
        model.add(Dropout(0.3))  # Increase dropout rate
        N *= 2

    # Flatten and Dense part
    model.add(Flatten())
    model.add(Dense(128, activation='relu', kernel_regularizer=l2(0.01)))  # Reduce the number of neurons
    model.add(Dropout(0.5))  # Increase dropout rate
    model.add(Dense(2, activation='softmax'))  # Update output layer to 2 neurons

    print("Compiling the model...")
    # Compile the model
    learning_rate = 0.0001  # Reduce learning rate for better generalization

    # Compile the model with Adam optimizer and custom learning rate
    optimizer = tf.keras.optimizers.Adam(learning_rate=learning_rate)
    model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['accuracy'])

    print("Model summary:")
    # Print model summary
    model.summary()

    print("Defining EarlyStopping callback...")
    # Define EarlyStopping callback
    early_stopping = tf.keras.callbacks.EarlyStopping(
        monitor='val_accuracy',
        min_delta=0.025,  # Reduce min_delta for early stopping
        patience=3,
        verbose=1,
        restore_best_weights=True
    )

    # Adjust steps per epoch
    steps_per_epoch = train_generator.samples // train_generator.batch_size
    validation_steps = validation_generator.samples // validation_generator.batch_size

    print("Starting model training...")
    # Train the model
    history = model.fit(
        train_dataset,
        steps_per_epoch=steps_per_epoch,
        validation_data=validation_dataset,
        validation_steps=validation_steps,
        epochs=15,  # Allow for more epochs
        callbacks=[early_stopping]
    )

    print(f"Saving the model as models/{userId}.keras...")
    model.save(f'../model/models/{userId}.keras')

    print("Cleaning up dividedImages directory...")
    shutil.rmtree('../model/dividedImages')

    print("Cleaning up images/me directory...")
    shutil.rmtree('../model/images/me')

    print("Training process completed.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python train.py <userId>")
    else:
        print(f"Starting training process for userId: {sys.argv[1]}")
        train_model(sys.argv[1])
