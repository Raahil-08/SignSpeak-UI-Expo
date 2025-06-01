from flask import Flask, request, jsonify
from flask_cors import CORS
import mediapipe as mp
import numpy as np
import cv2
import base64

app = Flask(__name__)
CORS(app)

# Initialize MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5
)

def process_frame(frame_data):
    # Decode base64 image
    img_bytes = base64.b64decode(frame_data.split(',')[1])
    nparr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert BGR to RGB
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Process the frame
    results = hands.process(frame_rgb)
    
    if results.multi_hand_landmarks:
        landmarks = []
        for hand_landmarks in results.multi_hand_landmarks:
            # Extract landmarks
            hand_points = []
            for landmark in hand_landmarks.landmark:
                hand_points.append({
                    'x': landmark.x,
                    'y': landmark.y,
                    'z': landmark.z
                })
            landmarks.append(hand_points)
        return {'detected': True, 'landmarks': landmarks}
    
    return {'detected': False, 'landmarks': []}

@app.route('/process-frame', methods=['POST'])
def process_frame_route():
    if 'frame' not in request.json:
        return jsonify({'error': 'No frame data provided'}), 400
    
    frame_data = request.json['frame']
    results = process_frame(frame_data)
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)