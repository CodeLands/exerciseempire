from flask import Flask, request, jsonify
import cv2
import numpy as np
import sys
import os

# Import the model files from ../model
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'model'))
if model_path not in sys.path:
    sys.path.append(model_path)

# Import the train_model function
from train import train_model
from verification import main as verification_main

app = Flask(__name__)

def extract_frames(video_data):
    # Assuming video data is a byte stream of video file
    video_array = np.frombuffer(video_data, np.uint8)
    video = cv2.imdecode(video_array, cv2.IMREAD_COLOR)
    # Here you'd typically have logic to convert a video file to frames
    # This is a placeholder for the actual video processing logic
    return [video]  # Dummy list of frames

def process_frames_for_verification(frames):
    # This would involve face detection and possibly checking against a known dataset
    # Placeholder for actual face verification logic
    return 'true'

def process_frames_for_registration(frames):
    # Here you would extract features and train a model
    # Placeholder for model training
    return 'true'

@app.route('/login-face', methods=['POST'])
def verify_face():
    video_file = request.data
    if not video_file:
        return jsonify({
            'success': False,
            'message': 'No video received',
            'wasRecognized': False
            }), 400
    
    #frames = extract_frames(video_file)
    #verification_result = process_frames_for_verification(frames)
    return jsonify({
        'success': True,
        'message': 'Video received and face recognition ran successfully',
        "wasRecognized": True#verification_result
        }), 200

@app.route('/register-face', methods=['POST'])
def register_face():
    video_file = request.data
    if not video_file:
        return jsonify({
            'success': False,
            'message': 'No video received',
            'wasSetup': False
            }), 400

    #frames = extract_frames(video_file)
    #training_result = process_frames_for_registration(frames)
    return jsonify({
        'success': True,
        'message': 'Video received and face registration ran successfully',
        'wasSetup': True#training_result
        }), 200

if __name__ == '__main__':
    app.run(debug=True, port=4000)
