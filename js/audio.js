// Audio Processing and Beatmap Generation
class AudioProcessor {
    constructor() {
        this.audioContext = null;
        this.audioBuffer = null;
        this.sourceNode = null;
        this.analyser = null;
        this.beatmap = null;
        this.isPlaying = false;
    }

    async loadAudioFile(file) {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Read file as array buffer
            const arrayBuffer = await file.arrayBuffer();
            
            // Decode audio data
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            return true;
        } catch (error) {
            console.error('Error loading audio:', error);
            throw error;
        }
    }

    async generateBeatmap() {
        if (!this.audioBuffer) {
            throw new Error('No audio loaded');
        }

        try {
            // Analyze audio to generate beatmap
            const beatmap = await this.analyzeAudio();
            this.beatmap = beatmap;
            return beatmap;
        } catch (error) {
            console.error('Error generating beatmap:', error);
            throw error;
        }
    }

    async analyzeAudio() {
        const audioData = this.audioBuffer.getChannelData(0);
        const sampleRate = this.audioBuffer.sampleRate;
        const duration = this.audioBuffer.duration;
        
        // Simple beat detection algorithm
        const beats = this.detectBeats(audioData, sampleRate);
        
        // Convert beats to notes
        const notes = this.beatsToNotes(beats, duration);
        
        return {
            duration: duration,
            bpm: this.estimateBPM(beats),
            notes: notes
        };
    }

    detectBeats(audioData, sampleRate) {
        const beats = [];
        const windowSize = 1024;
        const hopSize = 512;
        const threshold = 0.3;
        
        let prevEnergy = 0;
        
        for (let i = 0; i < audioData.length - windowSize; i += hopSize) {
            let energy = 0;
            
            // Calculate energy in window
            for (let j = 0; j < windowSize; j++) {
                energy += Math.abs(audioData[i + j]);
            }
            
            energy /= windowSize;
            
            // Detect beat if energy spike
            if (energy > threshold && energy > prevEnergy * 1.5) {
                const time = i / sampleRate;
                beats.push(time);
            }
            
            prevEnergy = energy;
        }
        
        return beats;
    }

    estimateBPM(beats) {
        if (beats.length < 2) return 120;
        
        const intervals = [];
        for (let i = 1; i < beats.length; i++) {
            intervals.push(beats[i] - beats[i - 1]);
        }
        
        // Calculate average interval
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        
        // Convert to BPM
        const bpm = 60 / avgInterval;
        
        return Math.round(bpm);
    }

    beatsToNotes(beats, duration) {
        const notes = [];
        const lanes = 4;
        
        // Add some randomness and variety
        let prevLane = -1;
        
        for (const beat of beats) {
            // Select random lane, avoiding consecutive same lanes
            let lane = Math.floor(Math.random() * lanes);
            while (lane === prevLane && lanes > 1) {
                lane = Math.floor(Math.random() * lanes);
            }
            prevLane = lane;
            
            notes.push({
                time: beat,
                lane: lane,
                type: 'tap'
            });
        }
        
        // Sort by time
        notes.sort((a, b) => a.time - b.time);
        
        return notes;
    }

    play(onTimeUpdate) {
        if (!this.audioContext || !this.audioBuffer || this.isPlaying) {
            return;
        }

        // Create source node
        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        
        // Create analyser for visualization
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        
        // Connect nodes
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        // Start playback
        const startTime = this.audioContext.currentTime;
        this.sourceNode.start(0);
        this.isPlaying = true;
        
        // Track time
        const updateTime = () => {
            if (!this.isPlaying) return;
            
            const currentTime = this.audioContext.currentTime - startTime;
            if (onTimeUpdate) {
                onTimeUpdate(currentTime);
            }
            
            requestAnimationFrame(updateTime);
        };
        
        updateTime();
        
        // Handle end of playback
        this.sourceNode.onended = () => {
            this.isPlaying = false;
        };
    }

    stop() {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode = null;
        }
        this.isPlaying = false;
    }

    getCurrentTime() {
        if (!this.audioContext || !this.isPlaying) {
            return 0;
        }
        return this.audioContext.currentTime;
    }
}
