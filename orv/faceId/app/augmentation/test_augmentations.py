import os
import numpy as np
import random
from genImg import add_random_black_squares, apply_custom_brightness, apply_salt_noise, apply_contrast

def test_add_random_black_squares():
    image = np.ones((224, 224, 3), dtype=np.uint8) * 255
    augmented_image = add_random_black_squares(image)
    assert np.any(augmented_image == 0), "Black squares not added correctly."

def test_apply_custom_brightness():
    image = np.ones((224, 224, 3), dtype=np.uint8) * 128
    augmented_image = apply_custom_brightness(image)
    assert np.any(augmented_image != 128), "Brightness not adjusted correctly."

def test_apply_salt_noise():
    image = np.ones((224, 224, 3), dtype=np.uint8) * 255
    augmented_image = apply_salt_noise(image)
    assert np.any(augmented_image == 0), "Salt noise not added correctly."

def test_apply_contrast():
    image = np.ones((224, 224, 3), dtype=np.uint8) * 128
    augmented_image = apply_contrast(image)
    assert np.any(augmented_image != 128), "Contrast not adjusted correctly."

def test_image_creation():
    # Run the video processing script
    os.system('python orv/app/augmentation/genImg.py')
    # Check if at least one image is created
    assert len(os.listdir('orv/app/model/images')) > 0, "No images were created."

if __name__ == "__main__":
    test_add_random_black_squares()
    test_apply_custom_brightness()
    test_apply_salt_noise()
    test_apply_contrast()
    test_image_creation()
    print("All tests passed.")