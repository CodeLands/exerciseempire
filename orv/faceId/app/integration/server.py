from flask import Flask, request, jsonify
import cv2
import numpy as np
import sys
import os
from genImg import process_image
# Import the model files from ../model
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'model'))
if model_path not in sys.path:
    sys.path.append(model_path)

# Import the train_model function
from train import train_model
from verification import main as verification_main

from genImg import process_image

app = Flask(__name__)

def extract_frames(video_data):
    # Assuming video data is a byte stream of video file
    video_array = np.frombuffer(video_data, np.uint8)
    video = cv2.imdecode(video_array, cv2.IMREAD_COLOR)
    # Here you'd typically have logic to convert a video file to frames
    # This is a placeholder for the actual video processing logic
    return [video]  # Dummy list of frames

def process_frames_for_verification(frames, userId):
    verification_result = verification_main(userId, frames[0])
    return 'true'

def process_frames_for_registration(frames):
    for frame in frames:
        process_image(frame, "../model/images")

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
    userId = request.args.get('userId')
    if not userId:
        return jsonify({
            'success': False,
            'message': 'No user id received',
            'wasRecognized': False
            }), 400
    frames = extract_frames(video_file)
    verification_result = process_frames_for_verification(frames, userId)
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
    userId = request.args.get('userId')
    if not userId:
        return jsonify({
            'success': False,
            'message': 'No user id received',
            'wasSetup': False
            }), 400
    frames = extract_frames(video_file)
    training_result = process_frames_for_registration(frames, userId)
    return jsonify({
        'success': True,
        'message': 'Video received and face registration ran successfully',
        'wasSetup': True #training_result
        }), 200

if __name__ == '__main__':
    app.run(debug=True, port=4000)
