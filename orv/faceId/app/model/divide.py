import os
import glob
from shutil import copy2
from collections import defaultdict
from sklearn.model_selection import train_test_split

def divide_images():
    # Define the directories
    base_output_dir = "./dividedImages"
    train_dir_me = os.path.join(base_output_dir, "train", "me")
    train_dir_others = os.path.join(base_output_dir, "train", "others")
    val_dir_me = os.path.join(base_output_dir, "validation", "me")
    val_dir_others = os.path.join(base_output_dir, "validation", "others")

    # Create output directories if they don't exist
    os.makedirs(train_dir_me, exist_ok=True)
    os.makedirs(train_dir_others, exist_ok=True)
    os.makedirs(val_dir_me, exist_ok=True)
    os.makedirs(val_dir_others, exist_ok=True)

    # Input directories with images
    input_dirs = {
        'me': './images/me',
        'others': './images/others'
    }

    # Function to copy files to the respective directories
    def copy_files(file_list, target_dir):
        for file in file_list:
            copy2(file, target_dir)

    # Process each category ('me' and 'others')
    for label, input_dir in input_dirs.items():
        image_extensions = ['*.jpg', '*.jpeg', '*.png'] 
        image_files = []
        for ext in image_extensions:
            image_files.extend(glob.glob(os.path.join(input_dir, ext)))
        
        # Group files by original image identifier (XXXXX)
        grouped_files = defaultdict(list)
        for file in image_files:
            base_name = os.path.basename(file)
            original_id = base_name.split('_')[0]
            grouped_files[original_id].append(file)
        
        # Ensure the images in each group are sorted
        for key in grouped_files.keys():
            grouped_files[key] = sorted(grouped_files[key])

        if label == 'me':
            # Split each group into training and validation sets
            for key in grouped_files.keys():
                files = grouped_files[key]
                split_idx = int(len(files) * 0.8)
                train_files = files[:split_idx]
                val_files = files[split_idx:]
                
                # Copy training and validation files
                copy_files(train_files, train_dir_me)
                copy_files(val_files, val_dir_me)
        else:
            # Split the data into training and validation sets for 'others'
            grouped_keys = list(grouped_files.keys())
            train_keys, val_keys = train_test_split(grouped_keys, test_size=0.2, random_state=42)
            
            train_files = [file for key in train_keys for file in grouped_files[key]]
            val_files = [file for key in val_keys for file in grouped_files[key]]
            
            # Copy training files
            copy_files(train_files, train_dir_others)
            copy_files(val_files, val_dir_others)

    print("Processing completed")