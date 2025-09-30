// Telegram Mini App Integration
class TelegramApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.init();
    }

    init() {
        // Initialize Telegram Web App
        this.tg.ready();
        
        // Expand to full height
        this.tg.expand();
        
        // Set header color
        this.tg.setHeaderColor('#667eea');
        
        // Enable closing confirmation
        this.tg.enableClosingConfirmation();
        
        // Get user data if available
        this.user = this.tg.initDataUnsafe?.user || null;
        
        console.log('Telegram Mini App initialized');
        console.log('User:', this.user);
    }

    showAlert(message) {
        this.tg.showAlert(message);
    }

    showConfirm(message, callback) {
        this.tg.showConfirm(message, callback);
    }

    close() {
        this.tg.close();
    }

    hapticFeedback(style = 'light') {
        // Haptic feedback: 'light', 'medium', 'heavy', 'rigid', 'soft'
        if (this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred(style);
        }
    }

    notificationFeedback(type = 'success') {
        // Notification feedback: 'success', 'warning', 'error'
        if (this.tg.HapticFeedback) {
            this.tg.HapticFeedback.notificationOccurred(type);
        }
    }
}

// Initialize Telegram App
const telegramApp = new TelegramApp();
