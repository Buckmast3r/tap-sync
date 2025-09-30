#!/usr/bin/env python3
"""
Backend API for TapSync - Audio Processing and Beatmap Generation
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa
import numpy as np
import tempfile
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'TapSync API is running'})

@app.route('/api/analyze', methods=['POST'])
def analyze_audio():
    """
    Analyze audio file and generate beatmap
    Expects: multipart/form-data with 'audio' file
    Returns: JSON with beatmap data
    """
    try:
        # Check if audio file is present
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.audio') as temp_file:
            audio_file.save(temp_file.name)
            temp_path = temp_file.name
        
        try:
            # Load audio with librosa
            y, sr = librosa.load(temp_path, sr=None)
            
            # Get duration
            duration = librosa.get_duration(y=y, sr=sr)
            
            # Detect beats
            tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
            beat_times = librosa.frames_to_time(beat_frames, sr=sr)
            
            # Detect onsets for more detailed notes
            onset_frames = librosa.onset.onset_detect(y=y, sr=sr, wait=1)
            onset_times = librosa.frames_to_time(onset_frames, sr=sr)
            
            # Combine beats and onsets
            all_times = np.concatenate([beat_times, onset_times])
            all_times = np.unique(np.sort(all_times))
            
            # Generate notes with random lanes
            notes = []
            prev_lane = -1
            
            for time in all_times:
                # Select random lane (0-3), avoid consecutive same lanes
                lane = np.random.randint(0, 4)
                while lane == prev_lane:
                    lane = np.random.randint(0, 4)
                prev_lane = lane
                
                notes.append({
                    'time': float(time),
                    'lane': int(lane),
                    'type': 'tap'
                })
            
            # Prepare response
            beatmap = {
                'duration': float(duration),
                'bpm': float(tempo),
                'notes': notes,
                'totalNotes': len(notes)
            }
            
            return jsonify(beatmap)
            
        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-advanced', methods=['POST'])
def analyze_audio_advanced():
    """
    Advanced audio analysis with ML-based beat detection
    Uses spectral features and onset strength
    """
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.audio') as temp_file:
            audio_file.save(temp_file.name)
            temp_path = temp_file.name
        
        try:
            # Load audio
            y, sr = librosa.load(temp_path, sr=22050)
            duration = librosa.get_duration(y=y, sr=sr)
            
            # Extract features
            # 1. Tempo and beat tracking
            tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
            beat_times = librosa.frames_to_time(beat_frames, sr=sr)
            
            # 2. Onset detection with different methods
            onset_env = librosa.onset.onset_strength(y=y, sr=sr)
            onsets = librosa.onset.onset_detect(
                onset_envelope=onset_env,
                sr=sr,
                backtrack=True
            )
            onset_times = librosa.frames_to_time(onsets, sr=sr)
            
            # 3. Spectral features for difficulty variation
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            rms = librosa.feature.rms(y=y)[0]
            
            # Combine and filter note times
            all_times = np.concatenate([beat_times, onset_times])
            all_times = np.unique(np.sort(all_times))
            
            # Filter notes that are too close together (min 0.1s apart)
            filtered_times = []
            last_time = -1
            for time in all_times:
                if time - last_time >= 0.1:
                    filtered_times.append(time)
                    last_time = time
            
            # Generate notes with intelligent lane selection
            notes = []
            lane_history = []
            
            for i, time in enumerate(filtered_times):
                # Get audio intensity at this time
                frame = librosa.time_to_frames(time, sr=sr)
                intensity = rms[min(frame, len(rms) - 1)]
                
                # Select lane based on recent history to avoid patterns
                available_lanes = [0, 1, 2, 3]
                if len(lane_history) > 0:
                    available_lanes.remove(lane_history[-1])
                if len(lane_history) > 1 and lane_history[-2] in available_lanes:
                    available_lanes.remove(lane_history[-2])
                
                lane = np.random.choice(available_lanes)
                lane_history.append(lane)
                
                # Keep only recent history
                if len(lane_history) > 3:
                    lane_history.pop(0)
                
                notes.append({
                    'time': float(time),
                    'lane': int(lane),
                    'type': 'tap',
                    'intensity': float(intensity)
                })
            
            beatmap = {
                'duration': float(duration),
                'bpm': float(tempo),
                'notes': notes,
                'totalNotes': len(notes),
                'difficulty': 'auto',
                'analysis': {
                    'tempo': float(tempo),
                    'averageIntensity': float(np.mean(rms))
                }
            }
            
            return jsonify(beatmap)
            
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
