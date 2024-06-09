import sys
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import matplotlib.pyplot as plt

def load_model(userId):
    model_path = f'models/{userId}.keras'
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model for userId {userId} not found at {model_path}")
    return tf.keras.models.load_model(model_path)

# Function to preprocess the image
def preprocess_image(img_path, target_size=(224, 224)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Rescale the image
    return img_array

# Function to make a prediction
def predict_image(userId, img_path):
    model = load_model(userId)
    img_array = preprocess_image(img_path)
    prediction = model.predict(img_array)
    class_index = np.argmax(prediction, axis=1)[0]
    class_labels = {0: 'me', 1: 'others'}
    confidence = prediction[0][class_index]
    return class_labels[class_index], confidence

def main(userId, img_path):
    # Make a prediction
    predicted_class, confidence = predict_image(userId, img_path)

    # Print the result
    print(f'Predicted class: {predicted_class} with confidence {confidence:.2f}')

    if predicted_class == 'me' and confidence > 0.6:
        return True
    else:
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python predict.py <userId> <image_path>")
        sys.exit(1)

    userId = sys.argv[1]
    img_path = sys.argv[2]

    result = main(userId, img_path)
    print(f"Result: {result}")
