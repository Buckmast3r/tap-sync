# Contributing to TapSync

Thank you for your interest in contributing to TapSync! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tap-sync.git
   cd tap-sync
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/Buckmast3r/tap-sync.git
   ```

## Development Setup

### Frontend Development

1. Start a local server:
   ```bash
   python -m http.server 8000
   ```

2. Open `http://localhost:8000` in your browser

3. Make changes to files in `js/`, `css/`, or `index.html`

4. Reload browser to see changes

### Backend Development

1. Create virtual environment:
   ```bash
   cd api
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the development server:
   ```bash
   python app.py
   ```

4. Test API endpoints:
   ```bash
   python test_api.py
   ```

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/device information

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Mock-ups or examples if applicable

### Submitting Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes thoroughly

4. Commit with clear messages:
   ```bash
   git commit -m "Add feature: description of feature"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## Coding Standards

### JavaScript

- Use ES6+ features
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use `const` and `let`, avoid `var`

**Example:**
```javascript
// Good
const calculateScore = (hits, combo) => {
    const baseScore = hits * 100;
    const comboBonus = Math.floor(combo / 10) * 10;
    return baseScore + comboBonus;
};

// Bad
var calc = function(h, c) {
    return h * 100 + Math.floor(c / 10) * 10;
};
```

### Python

- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions
- Keep functions focused on one task

**Example:**
```python
# Good
def calculate_beats(audio_data: np.ndarray, sample_rate: int) -> list:
    """
    Detect beats in audio data.
    
    Args:
        audio_data: Audio samples as numpy array
        sample_rate: Sample rate in Hz
        
    Returns:
        List of beat timestamps in seconds
    """
    tempo, beats = librosa.beat.beat_track(y=audio_data, sr=sample_rate)
    return librosa.frames_to_time(beats, sr=sample_rate).tolist()
```

### CSS

- Use consistent indentation (2 spaces)
- Group related properties
- Use meaningful class names
- Avoid inline styles

**Example:**
```css
/* Good */
.game-button {
    padding: 20px 40px;
    border-radius: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
    transition: transform 0.2s;
}

.game-button:hover {
    transform: translateY(-2px);
}
```

### HTML

- Use semantic HTML5 elements
- Include appropriate ARIA labels
- Maintain proper indentation
- Keep structure clean and organized

## Testing

### Frontend Testing

1. Test in multiple browsers:
   - Chrome/Edge
   - Firefox
   - Safari
   - Telegram Mobile

2. Test responsive design:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

3. Test game mechanics:
   - Audio upload
   - Beat detection
   - Hit detection
   - Scoring system
   - Screen transitions

### Backend Testing

1. Run test suite:
   ```bash
   cd api
   python test_api.py
   ```

2. Test with sample audio:
   ```bash
   python test_api.py path/to/audio.mp3
   ```

3. Manual API testing:
   ```bash
   curl http://localhost:5000/api/health
   ```

## Pull Request Process

1. **Before submitting:**
   - Update documentation if needed
   - Add tests for new features
   - Ensure all tests pass
   - Check code style

2. **PR Description:**
   - Clear title describing the change
   - Detailed description of what changed
   - Link to related issues
   - Screenshots for UI changes
   - Testing steps

3. **Review Process:**
   - Maintainers will review your PR
   - Address any feedback
   - Make requested changes
   - Keep PR focused and small

4. **After Approval:**
   - PR will be merged by maintainers
   - Delete your feature branch
   - Pull latest changes from upstream

## Project Structure

```
tap-sync/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Game styling
├── js/
│   ├── telegram.js    # Telegram integration
│   ├── audio.js       # Audio processing
│   ├── game.js        # Game engine
│   ├── ui.js          # UI management
│   └── app.js         # Main application
├── api/
│   ├── app.py         # Flask backend
│   ├── requirements.txt
│   └── test_api.py    # API tests
└── docs/              # Documentation
```

## Feature Ideas

Looking for something to work on? Here are some ideas:

### Easy
- [ ] Add keyboard shortcuts help overlay
- [ ] Improve loading screen animations
- [ ] Add sound effects for hits/misses
- [ ] Create more color themes
- [ ] Add accessibility features

### Medium
- [ ] Implement difficulty levels (Easy/Normal/Hard)
- [ ] Add replay functionality
- [ ] Create practice mode
- [ ] Add visual particle effects
- [ ] Implement local leaderboards

### Hard
- [ ] Add multiplayer support
- [ ] Implement hold notes and slides
- [ ] Create custom note skins
- [ ] Add video background support
- [ ] Implement achievement system

## Questions?

- Create an issue for questions
- Check existing documentation
- Review closed issues/PRs

## Resources

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [librosa Documentation](https://librosa.org/doc/latest/index.html)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make TapSync better for everyone. Thank you for taking the time to contribute! 🎵
