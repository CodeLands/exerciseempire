import cv2
import numpy as np
import random
import os
import time

st = 1
num_augmented_copies = 20  # Number of augmented copies per frame
resize_width = 224  # Set desired width to 112
resize_height = 224  # Set desired height to 112
skip_frames = 3  # Process every 10th frame

# Create output directory if it doesn't exist
output_dir = "../model/images/me"
os.makedirs(output_dir, exist_ok=True)


# Definicija funkcij za algoritme

# Algoritem za dodajanje Gaussian blura
def apply_gaussian_blur(image):
    kernel_size = (5, 5)  # Velikost jedra za Gaussian blur
    blurred_image = cv2.GaussianBlur(image, kernel_size, 0)
    return blurred_image


# Algoritem za naključno obračanje slike
def apply_random_rotation(image):
    angle = random.randint(-20, 20)
    rows, cols, _ = image.shape
    rotation_matrix = cv2.getRotationMatrix2D((cols / 2, rows / 2), angle, 1)
    rotated_image = cv2.warpAffine(image, rotation_matrix, (cols, rows))
    return rotated_image


# Algoritem za spreminjanje svetlosti slike
def apply_brightness(image):
    brightness_offset = random.randint(-50, 50)
    modified_image = np.clip(image.astype(np.int32) + brightness_offset, 0, 255).astype(np.uint8)
    return modified_image


# Video file path
video_file = 'video.mp4'

# Open the video file
camera = cv2.VideoCapture(video_file)

frame_count = 0

while camera.isOpened():
    ret, original_image = camera.read()

    # Preveri, ali je bila slika uspešno prebrana
    if not ret:
        print("Napaka pri branju slike iz videoposnetka ali konec videoposnetka")
        break

    frame_count += 1

    # Skip frames to process every skip_frames-th frame
    if frame_count % skip_frames != 0:
        continue

    # Resize the frame
    resized_image = cv2.resize(original_image, (resize_width, resize_height))

    #print(f"Processing frame {frame_count}")

    # Izvedba algoritmov na num_augmented_copies kopijah slike
    for i in range(num_augmented_copies):
        image_copy = resized_image.copy()

        # Uporaba algoritmov
        image_copy = apply_gaussian_blur(image_copy)
        image_copy = apply_random_rotation(image_copy)
        image_copy = apply_brightness(image_copy)

        # Oblikovanje imena datoteke glede na vrednost i
        filename = f"{output_dir}/"
        filename += f"{st:04d}_" if st < 10000 else f"{st:05d}_"
        filename += f"{i:04d}.jpg" if i < 10000 else f"{i:05d}.jpg"

        cv2.imwrite(filename, image_copy)
        #print(f"Saved: {filename}")

    st += 1
    # Počakaj eno sekundo pred zajemom naslednjega okvirja
    # time.sleep(5)

camera.release()
print("Processing completed")