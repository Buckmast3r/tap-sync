// Main Application
class App {
    constructor() {
        this.ui = new UIManager();
        this.rhythmGame = new RhythmGame();
        this.currentAudioFile = null;
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Menu buttons
        document.getElementById('upload-btn').addEventListener('click', () => {
            document.getElementById('audio-file-input').click();
        });

        document.getElementById('audio-file-input').addEventListener('change', (e) => {
            this.handleAudioUpload(e.target.files[0]);
        });

        document.getElementById('how-to-play-btn').addEventListener('click', () => {
            this.ui.showScreen('howto');
        });

        document.getElementById('back-howto-btn').addEventListener('click', () => {
            this.ui.showScreen('menu');
        });

        // Game controls - Touch/Click
        document.querySelectorAll('.tap-btn').forEach(btn => {
            const lane = parseInt(btn.dataset.lane);
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleLaneHit(lane);
            });
            
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleLaneHit(lane);
            });
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.rhythmGame.isRunning) return;
            
            const keyMap = {
                'a': 0,
                's': 1,
                'd': 2,
                'f': 3,
                'A': 0,
                'S': 1,
                'D': 2,
                'F': 3
            };
            
            if (keyMap.hasOwnProperty(e.key)) {
                e.preventDefault();
                const lane = keyMap[e.key];
                this.handleLaneHit(lane);
            }
        });

        // Results screen buttons
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('back-menu-btn').addEventListener('click', () => {
            this.ui.showScreen('menu');
            this.currentAudioFile = null;
        });
    }

    async handleAudioUpload(file) {
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('audio/')) {
            telegramApp.showAlert('Please select a valid audio file');
            return;
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            telegramApp.showAlert('File too large. Maximum size is 10MB');
            return;
        }

        this.currentAudioFile = file;
        
        // Show loading screen
        this.ui.showScreen('loading');
        this.ui.updateLoadingText('Loading audio...', 'Please wait');

        try {
            // Load and analyze audio
            await this.rhythmGame.loadAudio(file);
            
            this.ui.updateLoadingText('Beatmap generated!', 'Ready to play');
            
            // Wait a moment then start game
            setTimeout(() => {
                this.startGame();
            }, 1000);
            
        } catch (error) {
            console.error('Error processing audio:', error);
            telegramApp.showAlert('Error processing audio file. Please try another file.');
            this.ui.showScreen('menu');
        }
    }

    startGame() {
        if (!this.currentAudioFile) {
            this.ui.showScreen('menu');
            return;
        }

        this.ui.showScreen('game');
        this.ui.resetGame();
        
        // Small delay before starting
        setTimeout(() => {
            this.rhythmGame.start();
            telegramApp.notificationFeedback('success');
        }, 500);
    }

    handleLaneHit(lane) {
        if (!this.rhythmGame.isRunning) return;
        
        this.rhythmGame.hitLane(lane);
        
        // Visual feedback on button
        const btn = document.querySelector(`.tap-btn[data-lane="${lane}"]`);
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 100);
    }

    onGameComplete(results) {
        this.ui.showResults(results);
        telegramApp.notificationFeedback('success');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new App();
});
