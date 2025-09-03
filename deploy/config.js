// Production configuration for EV Charging Platform
const CONFIG = {
    // API Gateway endpoints (will be created during deployment)
    API_BASE_URL: 'https://api.ev-charging-platform.dev.codibly.com',
    
    // WebSocket endpoint for real-time updates
    WEBSOCKET_URL: 'wss://websocket.ev-charging-platform.dev.codibly.com',
    
    // Static assets CDN
    CDN_BASE_URL: 'https://ev-charging-platform.dev.codibly.com',
    
    // Environment
    ENV: 'production',
    
    // Features flags
    FEATURES: {
        REAL_TIME_UPDATES: true,
        AI_SEQUENTIAL_THINKING: true,
        LEAFLET_MAP: true,
        GEOLOCATION: true,
        ROUTING: true
    }
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.EV_CONFIG = CONFIG;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}