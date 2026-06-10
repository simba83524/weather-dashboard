// Weather Dashboard Configuration
// This file contains configuration constants for the application

const CONFIG = {
  // OpenWeatherMap API
  // Get your free API key at: https://openweathermap.org/api
  API_KEY: localStorage.getItem('weather_api_key') || '',
  
  // API endpoints
  API_BASE: 'https://api.openweathermap.org',
  
  // Default settings
  DEFAULT_UNITS: 'metric', // 'metric' for Celsius, 'imperial' for Fahrenheit
  DEFAULT_LANGUAGE: 'en',
  
  // Local storage keys
  STORAGE_KEYS: {
    API_KEY: 'weather_api_key',
    UNITS: 'weather_units',
    LANGUAGE: 'weather_language',
    LAST_CITY: 'weather_last_city',
    THEME: 'weather_theme'
  },
  
  // Temperature unit symbols
  TEMP_UNITS: {
    metric: '°C',
    imperial: '°F'
  },
  
  // Wind speed units
  WIND_UNITS: {
    metric: 'm/s',
    imperial: 'mph'
  },
  
  // Supported languages for OpenWeatherMap API
  SUPPORTED_LANGUAGES: [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh_cn', 'zh_tw', 'ja', 'ko'
  ],
  
  // Weather icon mapping
  WEATHER_ICONS: {
    '01d': 'fas fa-sun',           // clear sky - day
    '01n': 'fas fa-moon',          // clear sky - night
    '02d': 'fas fa-cloud-sun',     // few clouds - day
    '02n': 'fas fa-cloud-moon',    // few clouds - night
    '03d': 'fas fa-cloud',         // scattered clouds - day
    '03n': 'fas fa-cloud',         // scattered clouds - night
    '04d': 'fas fa-cloud',         // broken clouds - day
    '04n': 'fas fa-cloud',         // broken clouds - night
    '09d': 'fas fa-cloud-rain',    // shower rain - day
    '09n': 'fas fa-cloud-rain',    // shower rain - night
    '10d': 'fas fa-cloud-sun-rain',// rain - day
    '10n': 'fas fa-cloud-moon-rain',// rain - night
    '11d': 'fas fa-bolt',          // thunderstorm - day
    '11n': 'fas fa-bolt',          // thunderstorm - night
    '13d': 'fas fa-snowflake',     // snow - day
    '13n': 'fas fa-snowflake',     // snow - night
    '50d': 'fas fa-smog',          // mist - day
    '50n': 'fas fa-smog'           // mist - night
  },
  
  // Cache duration (in milliseconds)
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
  
  // Geolocation options
  GEOLOCATION_OPTIONS: {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  },
  
  // Request timeout (in milliseconds)
  REQUEST_TIMEOUT: 8000,
  
  // Rate limiting
  RATE_LIMIT: {
    requests_per_minute: 60,
    min_interval_ms: 1000
  },
  
  // Error messages
  ERROR_MESSAGES: {
    NO_API_KEY: 'API key not set. Please configure your OpenWeatherMap API key in settings.',
    INVALID_API_KEY: 'Invalid API key. Please check your settings.',
    CITY_NOT_FOUND: 'City not found. Please try another search.',
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    TIMEOUT: 'Request timeout. Please try again.',
    RATE_LIMIT: 'API rate limit exceeded. Please try again later.',
    UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
    GEOLOCATION_ERROR: 'Could not access your location. Please enable location permissions.',
    INVALID_COORDINATES: 'Invalid coordinates provided.'
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    SETTINGS_SAVED: 'Settings saved successfully!',
    LOCATION_FOUND: 'Location found!',
    DATA_UPDATED: 'Weather data updated!'
  }
};

// Helper function to get the current units
function getUnits() {
  return localStorage.getItem(CONFIG.STORAGE_KEYS.UNITS) || CONFIG.DEFAULT_UNITS;
}

// Helper function to get the current language
function getLanguage() {
  return localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || CONFIG.DEFAULT_LANGUAGE;
}

// Helper function to get weather icon
function getWeatherIcon(iconCode) {
  return CONFIG.WEATHER_ICONS[iconCode] || 'fas fa-cloud';
}
