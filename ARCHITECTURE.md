# TapSync Architecture

## Overview

TapSync is a web-based rhythm game designed as a Telegram Mini App. The architecture is split into frontend and backend components, with the frontend handling game logic and rendering, while the backend provides advanced audio analysis.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Telegram Client                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Telegram Mini App (WebView)             │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │         Frontend (HTML5/JS)              │    │  │
│  │  │                                          │    │  │
│  │  │  ┌─────────────────────────────────┐    │    │  │
│  │  │  │     UI Layer (ui.js)            │    │    │  │
│  │  │  │  - Screen management            │    │    │  │
│  │  │  │  - Results display              │    │    │  │
│  │  │  └─────────────────────────────────┘    │    │  │
│  │  │                                          │    │  │
│  │  │  ┌─────────────────────────────────┐    │    │  │
│  │  │  │   Application Layer (app.js)    │    │    │  │
│  │  │  │  - Event handling               │    │    │  │
│  │  │  │  - File upload                  │    │    │  │
│  │  │  │  - Game flow control            │    │    │  │
│  │  │  └─────────────────────────────────┘    │    │  │
│  │  │                                          │    │  │
│  │  │  ┌─────────────────────────────────┐    │    │  │
│  │  │  │    Game Engine (game.js)        │    │    │  │
│  │  │  │  - Game loop                    │    │    │  │
│  │  │  │  - Note rendering               │    │    │  │
│  │  │  │  - Hit detection                │    │    │  │
│  │  │  │  - Scoring system               │    │    │  │
│  │  │  └─────────────────────────────────┘    │    │  │
│  │  │                                          │    │  │
│  │  │  ┌─────────────────────────────────┐    │    │  │
│  │  │  │  Audio Processor (audio.js)     │    │    │  │
│  │  │  │  - Audio loading                │    │    │  │
│  │  │  │  - Beat detection               │    │    │  │
│  │  │  │  - Beatmap generation           │    │    │  │
│  │  │  │  - Audio playback               │    │    │  │
│  │  │  └─────────────────────────────────┘    │    │  │
│  │  │                                          │    │  │
│  │  │  ┌─────────────────────────────────┐    │    │  │
│  │  │  │  Telegram Integration           │    │    │  │
│  │  │  │  (telegram.js)                  │    │    │  │
│  │  │  │  - WebApp API                   │    │    │  │
│  │  │  │  - Haptic feedback              │    │    │  │
│  │  │  │  - User info                    │    │    │  │
│  │  │  └─────────────────────────────────┘    │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP (Optional)
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (Python/Flask)                  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │          REST API Endpoints                      │   │
│  │  - /api/health                                   │   │
│  │  - /api/analyze                                  │   │
│  │  - /api/analyze-advanced                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │       Audio Analysis Engine (librosa)           │   │
│  │  - Beat tracking                                │   │
│  │  - Onset detection                              │   │
│  │  - Spectral analysis                            │   │
│  │  - BPM estimation                               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Components

#### 1. Telegram Integration (`telegram.js`)
- **Purpose**: Interface with Telegram Mini App API
- **Responsibilities**:
  - Initialize Telegram WebApp
  - Manage haptic feedback
  - Handle WebApp lifecycle
  - Access user information
  - Theme integration

#### 2. Audio Processor (`audio.js`)
- **Purpose**: Handle audio loading and client-side analysis
- **Responsibilities**:
  - Load audio files using Web Audio API
  - Decode audio data
  - Perform basic beat detection
  - Generate beatmaps
  - Control audio playback
  - Track playback time

**Beat Detection Algorithm:**
```
1. Load audio into AudioContext
2. Get audio channel data
3. Split into windows (1024 samples)
4. Calculate energy per window
5. Detect energy spikes (threshold-based)
6. Convert spike times to beat times
7. Estimate BPM from beat intervals
8. Generate notes from beats
```

#### 3. Game Engine (`game.js`)
- **Purpose**: Core game logic and rendering
- **Responsibilities**:
  - Game loop management
  - Canvas rendering
  - Note spawning and movement
  - Hit detection
  - Scoring system
  - Combo tracking
  - Statistics collection

**Game Loop Flow:**
```
1. Update:
   - Update current time from audio
   - Filter active notes
   - Check for missed notes
   - Detect game end
   
2. Render:
   - Clear canvas
   - Draw lanes
   - Draw hit line
   - Draw notes with timing colors
   - Apply visual effects
```

**Hit Detection:**
```
Perfect: ±50ms  → 100 points
Good:    ±100ms → 50 points
Miss:    ±150ms → 0 points, break combo
```

#### 4. UI Manager (`ui.js`)
- **Purpose**: Screen and UI state management
- **Responsibilities**:
  - Screen transitions
  - Loading states
  - Results display
  - Score updates

#### 5. Application Controller (`app.js`)
- **Purpose**: Main application orchestration
- **Responsibilities**:
  - Initialize components
  - Handle user input
  - Manage game flow
  - File upload handling
  - Keyboard/touch controls

### Backend Components

#### 1. Flask API Server (`api/app.py`)
- **Purpose**: HTTP API for advanced audio processing
- **Endpoints**:
  - `GET /api/health`: Health check
  - `POST /api/analyze`: Basic beat detection
  - `POST /api/analyze-advanced`: ML-based analysis

#### 2. Audio Analysis Engine
- **Library**: librosa (Python)
- **Features**:
  - Beat tracking
  - Onset detection
  - Tempo estimation
  - Spectral feature extraction
  - RMS energy calculation

**Advanced Analysis Pipeline:**
```
1. Load audio with librosa
2. Calculate onset strength envelope
3. Detect beats using beat_track()
4. Detect onsets using onset_detect()
5. Extract spectral features
6. Combine beat and onset times
7. Filter close notes (min 100ms apart)
8. Assign lanes with smart distribution
9. Return structured beatmap
```

## Data Flow

### Audio Upload Flow
```
1. User selects audio file
2. File validation (type, size)
3. Show loading screen
4. AudioProcessor.loadAudioFile()
5. Decode audio with Web Audio API
6. AudioProcessor.generateBeatmap()
7. Beat detection algorithm runs
8. Beatmap created (notes array)
9. Ready to play
10. Start game
```

### Gameplay Flow
```
1. Game starts
2. Audio begins playing
3. Game loop starts
4. Each frame:
   - Update current time
   - Spawn notes based on time
   - Render notes on canvas
   - Listen for input
5. On input:
   - Find closest note in lane
   - Check timing window
   - Calculate score
   - Update combo
   - Visual/haptic feedback
6. On song end:
   - Calculate statistics
   - Show results screen
```

## State Management

### Game States
- **MENU**: Initial state, upload audio
- **LOADING**: Processing audio
- **PLAYING**: Active gameplay
- **PAUSED**: Game paused (future)
- **RESULTS**: Show final scores

### Note States
- **PENDING**: Not yet visible
- **ACTIVE**: Falling on screen
- **HIT**: Successfully hit
- **MISSED**: Passed without hit

## Performance Considerations

### Frontend Optimizations
1. **Canvas Rendering**: Only redraw changed areas
2. **Note Culling**: Only process visible notes
3. **RAF Loop**: Use requestAnimationFrame for smooth 60fps
4. **Audio Context**: Reuse AudioContext instance
5. **Event Delegation**: Minimize event listeners

### Backend Optimizations
1. **Temporary Files**: Use temp files, clean up immediately
2. **Sample Rate**: Downample to 22050Hz for faster processing
3. **Lazy Loading**: Load librosa only when needed
4. **Caching**: Can cache beatmaps for popular songs (future)

## Security Considerations

1. **File Upload Validation**:
   - Check file type (MIME)
   - Limit file size (10MB)
   - Sanitize filenames

2. **CORS Configuration**:
   - Configure allowed origins
   - Use HTTPS in production

3. **Rate Limiting**:
   - Implement rate limits on API (future)
   - Prevent abuse

4. **Input Sanitization**:
   - Validate all API inputs
   - Handle errors gracefully

## Scalability

### Current Architecture
- Frontend: Static files (CDN-ready)
- Backend: Single Flask instance

### Future Scaling Options
1. **Frontend**: Deploy to CDN (Cloudflare, AWS CloudFront)
2. **Backend**: 
   - Container deployment (Docker)
   - Horizontal scaling with load balancer
   - Serverless functions (AWS Lambda, Google Cloud Functions)
3. **Caching**: Redis for beatmap caching
4. **Queue**: Async processing with Celery/RQ

## Technology Stack

### Frontend
- HTML5 Canvas API
- Web Audio API
- CSS3 Animations
- Vanilla JavaScript (ES6+)
- Telegram WebApp SDK

### Backend
- Python 3.8+
- Flask 3.0
- librosa 0.10
- NumPy 1.24
- SoundFile

### Deployment
- Frontend: Static hosting (GitHub Pages, Netlify, Vercel)
- Backend: PaaS (Heroku, Railway) or Serverless (AWS Lambda)

## Error Handling

### Frontend
- Network errors → Show user-friendly message
- Audio decode errors → Fallback or error screen
- Invalid file → Show validation message
- Game errors → Log and graceful degradation

### Backend
- File processing errors → 500 with error message
- Invalid input → 400 with validation error
- Server errors → 500 with generic message
- Resource cleanup → Always cleanup temp files

## Testing Strategy

### Frontend Testing
- Manual testing in Telegram
- Browser compatibility testing
- Touch/keyboard input testing
- Audio format testing

### Backend Testing
- Unit tests for beat detection
- Integration tests for API endpoints
- Load testing for concurrent requests
- Audio file format testing

## Monitoring

### Metrics to Track
- API response times
- Error rates
- User engagement (games played)
- Audio processing times
- Browser/device distribution

### Logging
- Frontend: Console logs (dev), Error tracking (prod)
- Backend: Flask logging, Error monitoring

## Future Architecture Improvements

1. **Microservices**: Split audio processing into separate service
2. **WebSocket**: Real-time multiplayer support
3. **Database**: Store user scores and beatmaps
4. **ML Model**: Train custom beat detection model
5. **Caching Layer**: Cache processed beatmaps
6. **CDN**: Serve static assets from CDN
