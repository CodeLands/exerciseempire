import cv2
import numpy as np
import random
import time

st = 1;
# Definicija funkcij za algoritme

# Algoritem za dodajanje Gaussian blura
def apply_gaussian_blur(image):
    kernel_size = (5, 5)  # Velikost jedra za Gaussian blur
    blurred_image = cv2.GaussianBlur(image, kernel_size, 0)
    return blurred_image


# Algoritem za izbiro naključne barvne sheme
# def apply_random_color_scheme(image):
#     color_spaces = [cv2.COLOR_BGR2HSV, cv2.COLOR_BGR2HLS]
#     random_color_space = random.choice(color_spaces)
#     converted_image = cv2.cvtColor(image, random_color_space)
#     return converted_image


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
    modified_image = cv2.convertScaleAbs(image, beta=brightness_offset)
    return modified_image


# Zanka za zajem slike iz kamere vsako sekundo
while True:
    # Zajem slike iz kamere
    camera = cv2.VideoCapture(0)
    ret, original_image = camera.read()
    camera.release()

    # Preveri, ali je bila slika uspešno prebrana
    if not ret:
        print("Napaka pri branju slike iz kamere")
        exit()

    # Izvedba algoritmov na 1000 kopijah slike
    for i in range(1000):
        image_copy = original_image.copy()

        # Uporaba algoritmov
        image_copy = apply_gaussian_blur(image_copy)
        #image_copy = apply_random_color_scheme(image_copy)
        image_copy = apply_random_rotation(image_copy)
        image_copy = apply_brightness(image_copy)

        # Oblikovanje imena datoteke glede na vrednost i
        if i < 10:
            filename = f"gen/0000{st}_0000{i}.jpg"
        elif 10 <= i < 100:
            filename = f"gen/0000{st}_000{i}.jpg"
        elif 100 <= i < 1000:
            filename = f"gen/0000{st}_00{i}.jpg"
        elif 1000 <= i < 10000:
            filename = f"gen/0000{st}_0{i}.jpg"
        else:
            filename = f"gen/0000{st}_{i}.jpg"
        cv2.imwrite(filename, image_copy)

    st = st + 1;
    # Počakaj eno sekundo pred zajemom naslednje slike
    time.sleep(5)