import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import matplotlib.pyplot as plt

# Load the trained model
model = tf.keras.models.load_model('face_validation_model.keras')

# Function to preprocess the image
def preprocess_image(img_path, target_size=(224, 224)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Rescale the image
    return img_array

# Function to make a prediction
def predict_image(img_path):
    img_array = preprocess_image(img_path)
    prediction = model.predict(img_array)
    class_index = np.argmax(prediction, axis=1)[0]
    class_labels = {0: 'me', 1: 'others'}
    return class_labels[class_index], prediction[0][class_index]

# Path to the test image
test_image_path = 'c.jpg'  # Replace with your image path

# Make a prediction
predicted_class, confidence = predict_image(test_image_path)

# Print the result
print(f'Predicted class: {predicted_class} with confidence {confidence:.2f}')

img = image.load_img(test_image_path)
plt.imshow(img)
plt.title(f'Predicted: {predicted_class} ({confidence:.2f})')
plt.axis('off')
plt.show()
