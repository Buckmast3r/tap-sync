# TapSync 🎵

A Telegram Mini App rhythm game with dynamic beatmap generation from user-uploaded audio, built in HTML5/JavaScript with an ML/audio-processing backend.

## Features

- 🎮 **Rhythm Game Mechanics**: Classic 4-lane rhythm game with timing-based scoring
- 🎵 **Dynamic Beatmap Generation**: Upload any audio file and get an auto-generated beatmap
- 📱 **Telegram Mini App**: Seamlessly integrated with Telegram's Web App API
- 🎨 **Beautiful UI**: Responsive design with smooth animations
- 🔊 **Audio Processing**: ML-powered beat detection using librosa
- 📊 **Score Tracking**: Real-time scoring with combos and accuracy tracking
- 🎯 **Multiple Hit Windows**: Perfect, Good, and Miss timing windows
- 📳 **Haptic Feedback**: Native Telegram haptic feedback support

## Project Structure

```
tap-sync/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Game styling
├── js/
│   ├── telegram.js        # Telegram Mini App integration
│   ├── audio.js           # Client-side audio processing
│   ├── game.js            # Game logic and mechanics
│   ├── ui.js              # UI management
│   └── app.js             # Main application controller
├── api/
│   ├── app.py             # Flask backend API
│   └── requirements.txt   # Python dependencies
└── README.md
```

## Setup Instructions

### Frontend (HTML5/JavaScript)

1. The frontend is a static web application that can be served from any web server.

2. For local development:
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   
   # Or using Node.js http-server
   npm install -g http-server
   http-server -p 8000
   ```

3. Access the game at `http://localhost:8000`

### Backend (Python/Flask)

1. Install Python dependencies:
   ```bash
   cd api
   pip install -r requirements.txt
   ```

2. Run the Flask API:
   ```bash
   python app.py
   ```

3. The API will be available at `http://localhost:5000`

### Telegram Mini App Configuration

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Use `/newapp` command to create a Mini App
3. Set the Web App URL to your hosted frontend URL
4. Configure the app name, description, and icon

## How to Play

1. **Upload Audio**: Click "Upload Audio" and select any audio file (MP3, WAV, OGG, etc.)
2. **Wait for Analysis**: The app will analyze your audio and generate a beatmap
3. **Play**: Notes will fall from the top in 4 lanes
4. **Hit Notes**: Press the corresponding button or keyboard key (A, S, D, F) when notes reach the hit area
5. **Build Combos**: Chain successful hits for bonus points!

## Game Mechanics

### Timing Windows
- **Perfect**: ±50ms - 100 points + combo bonus
- **Good**: ±100ms - 50 points + combo bonus
- **Miss**: ±150ms - 0 points, resets combo

### Scoring
- Base points per note: Perfect (100), Good (50), Miss (0)
- Combo bonus: +10 points per 10 combo
- Final score includes accuracy calculation

### Controls
- **Keyboard**: A, S, D, F keys (one per lane)
- **Touch**: Tap the buttons on screen
- **Both**: Can use keyboard and touch simultaneously

## API Endpoints

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "TapSync API is running"
}
```

### `POST /api/analyze`
Basic audio analysis and beatmap generation.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `audio` file

**Response:**
```json
{
  "duration": 180.5,
  "bpm": 128.0,
  "notes": [
    {"time": 0.5, "lane": 0, "type": "tap"},
    {"time": 1.0, "lane": 2, "type": "tap"}
  ],
  "totalNotes": 250
}
```

### `POST /api/analyze-advanced`
Advanced ML-based audio analysis with spectral features.

**Request:** Same as `/api/analyze`

**Response:** Enhanced beatmap with intensity data and difficulty analysis

## Technologies Used

### Frontend
- **HTML5**: Structure and canvas for game rendering
- **CSS3**: Styling and animations
- **Vanilla JavaScript**: Game logic (no frameworks)
- **Web Audio API**: Client-side audio processing
- **Canvas API**: Game rendering

### Backend
- **Python 3**: Backend language
- **Flask**: Web framework
- **librosa**: Audio analysis and beat detection
- **NumPy**: Numerical computations

### Telegram Integration
- **Telegram Web App API**: Mini App features
- **Haptic Feedback**: Native vibration
- **Theme Integration**: Adapts to Telegram theme

## Development

### Client-Side Audio Processing
The game includes client-side audio analysis as a fallback:
- Energy-based beat detection
- BPM estimation
- Dynamic note generation

### Backend Audio Processing
For more accurate beatmaps, the backend uses:
- librosa beat tracking
- Onset detection
- Spectral feature analysis
- ML-based pattern recognition

## Deployment

### Frontend Hosting
Deploy to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- CloudFlare Pages

### Backend Hosting
Deploy the Flask API to:
- Heroku
- Railway
- Google Cloud Run
- AWS Lambda (with API Gateway)

### Environment Variables
No environment variables required for basic operation.

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Telegram Mobile: ✅ Optimized

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Future Enhancements

- [ ] Difficulty levels (Easy, Normal, Hard)
- [ ] Leaderboards integration
- [ ] Multiplayer mode
- [ ] Custom note skins
- [ ] Music library integration
- [ ] More note types (hold notes, swipes)
- [ ] Visual effects and particle systems
- [ ] Achievement system
