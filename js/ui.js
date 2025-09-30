// UI Management
class UIManager {
    constructor() {
        this.screens = {
            menu: document.getElementById('menu-screen'),
            loading: document.getElementById('loading-screen'),
            game: document.getElementById('game-screen'),
            results: document.getElementById('results-screen'),
            howto: document.getElementById('howto-screen')
        };
        
        this.currentScreen = 'menu';
    }

    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
    }

    updateLoadingText(text, subtext = '') {
        document.querySelector('.loading-text').textContent = text;
        document.querySelector('.loading-subtext').textContent = subtext;
    }

    showResults(results) {
        document.getElementById('final-score').textContent = results.score;
        document.getElementById('max-combo').textContent = results.maxCombo;
        document.getElementById('accuracy').textContent = results.accuracy + '%';
        document.getElementById('perfect-hits').textContent = results.perfect;
        document.getElementById('good-hits').textContent = results.good;
        document.getElementById('miss-hits').textContent = results.miss;
        
        this.showScreen('results');
    }

    resetGame() {
        document.getElementById('score-value').textContent = '0';
        document.getElementById('combo-value').textContent = '0';
    }
}
