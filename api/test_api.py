#!/usr/bin/env python3
"""
Test script for TapSync API
"""

import requests
import sys
import os

API_URL = os.getenv('API_URL', 'http://localhost:5000')

def test_health():
    """Test health endpoint"""
    print("Testing /api/health...")
    try:
        response = requests.get(f"{API_URL}/api/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        assert response.status_code == 200
        assert response.json()['status'] == 'ok'
        print("✓ Health check passed\n")
        return True
    except Exception as e:
        print(f"✗ Health check failed: {e}\n")
        return False

def test_analyze(audio_file=None):
    """Test analyze endpoint"""
    if not audio_file:
        print("Skipping /api/analyze test (no audio file provided)")
        return True
    
    print("Testing /api/analyze...")
    try:
        with open(audio_file, 'rb') as f:
            files = {'audio': f}
            response = requests.post(f"{API_URL}/api/analyze", files=files)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Duration: {data['duration']:.2f}s")
            print(f"BPM: {data['bpm']:.1f}")
            print(f"Total Notes: {data['totalNotes']}")
            print(f"First 5 notes: {data['notes'][:5]}")
            print("✓ Analyze test passed\n")
            return True
        else:
            print(f"✗ Analyze test failed: {response.text}\n")
            return False
    except Exception as e:
        print(f"✗ Analyze test failed: {e}\n")
        return False

def test_analyze_advanced(audio_file=None):
    """Test advanced analyze endpoint"""
    if not audio_file:
        print("Skipping /api/analyze-advanced test (no audio file provided)")
        return True
    
    print("Testing /api/analyze-advanced...")
    try:
        with open(audio_file, 'rb') as f:
            files = {'audio': f}
            response = requests.post(f"{API_URL}/api/analyze-advanced", files=files)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Duration: {data['duration']:.2f}s")
            print(f"BPM: {data['bpm']:.1f}")
            print(f"Total Notes: {data['totalNotes']}")
            print(f"Difficulty: {data['difficulty']}")
            print(f"Average Intensity: {data['analysis']['averageIntensity']:.4f}")
            print(f"First 5 notes: {data['notes'][:5]}")
            print("✓ Advanced analyze test passed\n")
            return True
        else:
            print(f"✗ Advanced analyze test failed: {response.text}\n")
            return False
    except Exception as e:
        print(f"✗ Advanced analyze test failed: {e}\n")
        return False

def main():
    print("=" * 60)
    print("TapSync API Test Suite")
    print("=" * 60)
    print(f"Testing API at: {API_URL}\n")
    
    results = []
    
    # Test health
    results.append(test_health())
    
    # Check for audio file argument
    audio_file = sys.argv[1] if len(sys.argv) > 1 else None
    
    if audio_file and os.path.exists(audio_file):
        print(f"Using audio file: {audio_file}\n")
        results.append(test_analyze(audio_file))
        results.append(test_analyze_advanced(audio_file))
    else:
        print("No audio file provided. Skipping analyze tests.")
        print("Usage: python test_api.py [path/to/audio.mp3]\n")
    
    # Summary
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("✓ All tests passed!")
        return 0
    else:
        print("✗ Some tests failed")
        return 1

if __name__ == '__main__':
    sys.exit(main())
