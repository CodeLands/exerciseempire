from flask import Flask, request, jsonify
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/verify-face', methods=['POST'])
def verify_face():
    video_file = request.data
    if not video_file:
        return jsonify({'message': 'No video received'}), 400
    
    # Extract the image from request
    # Process it with OpenCV
    return jsonify({"status": "success", "verified": True})

@app.route('/register-face', methods=['POST'])
def register_face():
    video_file = request.data
    if not video_file:
        return jsonify({'message': 'No video received'}), 400

    # Process video file for face recognition training here
    # This is where you would extract frames, train your model, etc.
    # Dummy response for now
    return jsonify({'message': 'Video received and model training started'}), 200


if __name__ == '__main__':
    app.run(debug=True)
