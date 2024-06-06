import cv2
import random
import os

import numpy as np

st = 1
num_augmented_copies = 20  # Number of augmented copies per frame
resize_width = 224  # Set desired width to 224
resize_height = 224  # Set desired height to 224
skip_frames = 3  # Process every 3rd frame

# Create output directory if it doesn't exist
output_dir = "../model/Images/me"
os.makedirs(output_dir, exist_ok=True)


# Custom augmentation functions

# 1. Algorithm for adding 20 black squares at random positions
def add_random_black_squares(image):
    square_size = 2  # Size of the black squares
    for _ in range(50):
        y = random.randint(0, image.shape[0] - square_size)
        x = random.randint(0, image.shape[1] - square_size)
        image[y:y + square_size, x:x + square_size] = 0
    return image


# 2. Custom brightness adjustment
def apply_custom_brightness(image):
    """Applies brightness adjustment to the image without using external libraries."""
    brightness_offset = random.randint(-50, 50)
    bright_image = image.astype(int)
    bright_image += brightness_offset
    bright_image = np.clip(bright_image, 0, 255).astype('uint8')
    return bright_image


# 3. Algorithm for adding salt noise with squares
def apply_salt_noise(image):
    square_size = 2  # Size of the black squares
    for _ in range(50):
        y = random.randint(0, image.shape[0] - square_size)
        x = random.randint(0, image.shape[1] - square_size)
        image[y:y + square_size, x:x + square_size] = 0
    return image


# 4. Algorithm for changing the contrast of the image
def apply_contrast(image):
    factor = random.uniform(0.5, 1.5)
    contrast_image = image.astype(int)
    for y in range(len(image)):
        for x in range(len(image[0])):
            for c in range(3):
                contrast_image[y][x][c] = 128 + factor * (image[y][x][c] - 128)
    contrast_image = contrast_image.clip(0, 255).astype('uint8')
    return contrast_image


# Video file path
video_file = 'video.mp4'

# Open the video file
camera = cv2.VideoCapture(video_file)

frame_count = 0

while camera.isOpened():
    ret, original_image = camera.read()

    # Check if the frame was successfully read
    if not ret:
        print("Error reading frame from video or end of video")
        break

    frame_count += 1

    # Skip frames to process every skip_frames-th frame
    if frame_count % skip_frames != 0:
        continue

    # Resize the frame
    resized_image = cv2.resize(original_image, (resize_width, resize_height))

    # Perform augmentations on num_augmented_copies copies of the frame
    for i in range(num_augmented_copies):
        image_copy = resized_image.copy()

        # Gaussian blur
        kernel_size = (5, 5)
        image_copy = cv2.GaussianBlur(image_copy, kernel_size, 0)

        # Custom augmentations
        image_copy = apply_custom_brightness(image_copy)
        image_copy = apply_contrast(image_copy)
        image_copy = apply_salt_noise(image_copy)

        # Random rotation
        angle = random.randint(-20, 20)
        rows, cols, _ = image_copy.shape
        rotation_matrix = cv2.getRotationMatrix2D((cols / 2, rows / 2), angle, 1)
        image_copy = cv2.warpAffine(image_copy, rotation_matrix, (cols, rows))

        # Generate filename based on the value of i
        filename = f"{output_dir}/"
        filename += f"{st:05d}_" if st < 100000 else f"{st:06d}_"
        filename += f"{i:05d}.jpg" if i < 100000 else f"{i:06d}.jpg"

        cv2.imwrite(filename, image_copy)
        # print(f"Saved: {filename}")

    st += 1
    # Wait one second before capturing the next frame
    # time.sleep(5)

camera.release()
print("Processing completed")
