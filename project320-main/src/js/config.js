// API Configuration Helper
class ApiConfig {
    constructor() {
        this.serverUrl = 'http://localhost:3000'; // Default fallback
        this.loadConfig();
    }

    async loadConfig() {
        try {
            const response = await fetch('./config.json');
            const config = await response.json();
            this.serverUrl = config.serverUrl || 'http://localhost:3000';
        } catch (error) {
            console.warn('Could not load config.json, using default server URL');
        }
    }

    getApiUrl(endpoint) {
        return `${this.serverUrl}/api${endpoint}`;
    }
}

// Create global instance
window.apiConfig = new ApiConfig();

// Helper function for other scripts
window.getApiUrl = (endpoint) => {
    return window.apiConfig.getApiUrl(endpoint);
};