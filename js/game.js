// Game Logic
class RhythmGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.audioProcessor = new AudioProcessor();
        
        // Game state
        this.isRunning = false;
        this.currentTime = 0;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        
        // Note tracking
        this.notes = [];
        this.activeNotes = [];
        this.hitNotes = new Set();
        
        // Timing windows (in seconds)
        this.perfectWindow = 0.05;  // 50ms
        this.goodWindow = 0.1;      // 100ms
        this.missWindow = 0.15;     // 150ms
        
        // Stats
        this.stats = {
            perfect: 0,
            good: 0,
            miss: 0,
            totalNotes: 0
        };
        
        // Lane positions
        this.lanes = 4;
        this.laneWidth = 80;
        this.laneGap = 5;
        
        // Note settings
        this.noteSpeed = 400; // pixels per second
        this.noteHeight = 20;
        this.hitAreaY = 0;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = document.getElementById('game-canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // Calculate hit area position (80px from bottom)
        this.hitAreaY = this.canvas.height - 200;
    }

    async loadAudio(file) {
        try {
            await this.audioProcessor.loadAudioFile(file);
            const beatmap = await this.audioProcessor.generateBeatmap();
            this.notes = beatmap.notes;
            this.stats.totalNotes = this.notes.length;
            return beatmap;
        } catch (error) {
            throw error;
        }
    }

    start() {
        this.isRunning = true;
        this.currentTime = 0;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.activeNotes = [];
        this.hitNotes.clear();
        
        this.stats = {
            perfect: 0,
            good: 0,
            miss: 0,
            totalNotes: this.notes.length
        };
        
        // Start audio playback
        this.audioProcessor.play((time) => {
            this.currentTime = time;
        });
        
        // Start game loop
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
        this.audioProcessor.stop();
    }

    gameLoop() {
        if (!this.isRunning) return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Update active notes
        this.activeNotes = this.notes.filter(note => {
            const timeUntilHit = note.time - this.currentTime;
            const noteDistance = timeUntilHit * this.noteSpeed;
            
            // Add notes that are coming into view
            return noteDistance < this.canvas.height && !this.hitNotes.has(note);
        });
        
        // Check for missed notes
        this.activeNotes.forEach(note => {
            const timeUntilHit = note.time - this.currentTime;
            if (timeUntilHit < -this.missWindow && !this.hitNotes.has(note)) {
                this.hitNotes.add(note);
                this.onNoteMiss(note);
            }
        });
        
        // Check if game is over
        if (this.currentTime > this.audioProcessor.audioBuffer.duration) {
            this.onGameEnd();
        }
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate lane positions
        const totalWidth = (this.laneWidth * this.lanes) + (this.laneGap * (this.lanes - 1));
        const startX = (this.canvas.width - totalWidth) / 2;
        
        // Draw lanes
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < this.lanes; i++) {
            const x = startX + (i * (this.laneWidth + this.laneGap));
            this.ctx.fillRect(x, 0, this.laneWidth, this.canvas.height);
        }
        
        // Draw hit line
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, this.hitAreaY);
        this.ctx.lineTo(startX + totalWidth, this.hitAreaY);
        this.ctx.stroke();
        
        // Draw notes
        this.activeNotes.forEach(note => {
            const timeUntilHit = note.time - this.currentTime;
            const noteY = this.hitAreaY - (timeUntilHit * this.noteSpeed);
            const x = startX + (note.lane * (this.laneWidth + this.laneGap));
            
            // Note color based on timing
            if (Math.abs(timeUntilHit) < this.perfectWindow) {
                this.ctx.fillStyle = '#ffd700';
            } else if (Math.abs(timeUntilHit) < this.goodWindow) {
                this.ctx.fillStyle = '#90ee90';
            } else {
                this.ctx.fillStyle = '#ffffff';
            }
            
            // Draw note
            this.ctx.fillRect(x, noteY, this.laneWidth, this.noteHeight);
            
            // Note border
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, noteY, this.laneWidth, this.noteHeight);
        });
    }

    hitLane(lane) {
        // Find closest note in this lane
        let closestNote = null;
        let closestTime = Infinity;
        
        this.activeNotes.forEach(note => {
            if (note.lane === lane && !this.hitNotes.has(note)) {
                const timeDiff = Math.abs(note.time - this.currentTime);
                if (timeDiff < closestTime && timeDiff < this.missWindow) {
                    closestNote = note;
                    closestTime = timeDiff;
                }
            }
        });
        
        if (closestNote) {
            this.hitNotes.add(closestNote);
            this.onNoteHit(closestNote, closestTime);
        }
    }

    onNoteHit(note, timeDiff) {
        let hitType = 'miss';
        let points = 0;
        
        if (timeDiff < this.perfectWindow) {
            hitType = 'perfect';
            points = 100;
            this.stats.perfect++;
            this.combo++;
        } else if (timeDiff < this.goodWindow) {
            hitType = 'good';
            points = 50;
            this.stats.good++;
            this.combo++;
        } else {
            hitType = 'miss';
            this.stats.miss++;
            this.combo = 0;
        }
        
        // Add combo bonus
        points += Math.floor(this.combo / 10) * 10;
        
        this.score += points;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        
        // Update UI
        document.getElementById('score-value').textContent = this.score;
        document.getElementById('combo-value').textContent = this.combo;
        
        // Visual feedback
        const laneElement = document.querySelector(`.lane[data-lane="${note.lane}"]`);
        laneElement.classList.add('hit');
        setTimeout(() => laneElement.classList.remove('hit'), 200);
        
        // Haptic feedback
        if (hitType === 'perfect') {
            telegramApp.hapticFeedback('medium');
        } else if (hitType === 'good') {
            telegramApp.hapticFeedback('light');
        }
    }

    onNoteMiss(note) {
        this.stats.miss++;
        this.combo = 0;
        
        // Update UI
        document.getElementById('combo-value').textContent = this.combo;
        
        // Haptic feedback
        telegramApp.hapticFeedback('heavy');
    }

    onGameEnd() {
        this.stop();
        
        // Calculate accuracy
        const hitNotes = this.stats.perfect + this.stats.good;
        const accuracy = this.stats.totalNotes > 0 
            ? Math.round((hitNotes / this.stats.totalNotes) * 100) 
            : 0;
        
        // Show results
        const results = {
            score: this.score,
            maxCombo: this.maxCombo,
            accuracy: accuracy,
            perfect: this.stats.perfect,
            good: this.stats.good,
            miss: this.stats.miss
        };
        
        // Trigger results event
        if (window.game) {
            window.game.onGameComplete(results);
        }
    }
}
