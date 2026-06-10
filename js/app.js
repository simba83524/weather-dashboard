// Weather Dashboard Main Application
// This file contains the main application logic

class WeatherDashboard {
  constructor() {
    this.currentWeatherData = null;
    this.forecastData = null;
    this.lastUpdate = null;
    this.initializeElements();
    this.setupEventListeners();
    this.loadSettings();
    this.applyTheme();
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.searchInput = document.getElementById('searchInput');
    this.searchBtn = document.getElementById('searchBtn');
    this.locationBtn = document.getElementById('locationBtn');
    this.currentWeatherSection = document.getElementById('currentWeather');
    this.weatherDetailsSection = document.getElementById('weatherDetails');
    this.hourlySection = document.getElementById('hourlySection');
    this.dailySection = document.getElementById('dailySection');
    this.errorMessage = document.getElementById('errorMessage');
    this.errorText = document.getElementById('errorText');
    this.themeToggle = document.getElementById('themeToggle');
    this.settingsBtn = document.getElementById('settingsBtn');
    this.settingsModal = document.getElementById('settingsModal');
    this.closeSettings = document.getElementById('closeSettings');
    this.saveSettings = document.getElementById('saveSettings');
    this.apiKeyInput = document.getElementById('apiKeyInput');
    this.unitSelect = document.getElementById('unitSelect');
    this.languageSelect = document.getElementById('languageSelect');
    this.lastUpdateSpan = document.getElementById('lastUpdate');
    this.suggestionsList = document.getElementById('suggestions');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Search
    this.searchBtn.addEventListener('click', () => this.handleSearch());
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });
    this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));

    // Location
    this.locationBtn.addEventListener('click', () => this.getCurrentLocation());

    // Theme
    this.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Settings
    this.settingsBtn.addEventListener('click', () => this.openSettings());
    this.closeSettings.addEventListener('click', () => this.closeSettingsModal());
    this.saveSettings.addEventListener('click', () => this.saveSettingsData());
    this.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.settingsModal) this.closeSettingsModal();
    });

    // Close suggestions on click outside
    document.addEventListener('click', (e) => {
      if (e.target !== this.searchInput) {
        this.suggestionsList.classList.remove('active');
      }
    });

    // Load last city on page load
    window.addEventListener('load', () => {
      const lastCity = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_CITY);
      if (lastCity) {
        this.searchInput.value = lastCity;
        this.handleSearch();
      }
    });
  }

  /**
   * Handle search input with suggestions
   */
  async handleSearchInput(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
      this.suggestionsList.classList.remove('active');
      return;
    }

    try {
      const suggestions = await weatherAPI.getCoordinates(query, 5);
      this.displaySuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }

  /**
   * Display search suggestions
   */
  displaySuggestions(suggestions) {
    this.suggestionsList.innerHTML = '';

    if (suggestions.length === 0) {
      this.suggestionsList.classList.remove('active');
      return;
    }

    suggestions.forEach(suggestion => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      const country = suggestion.country ? `, ${suggestion.country}` : '';
      const state = suggestion.state ? `, ${suggestion.state}` : '';
      item.textContent = `${suggestion.name}${state}${country}`;
      item.addEventListener('click', () => {
        this.searchInput.value = suggestion.name;
        this.suggestionsList.classList.remove('active');
        this.handleSearch();
      });
      this.suggestionsList.appendChild(item);
    });

    this.suggestionsList.classList.add('active');
  }

  /**
   * Handle search
   */
  async handleSearch() {
    const city = this.searchInput.value.trim();
    if (!city) {
      this.showError('Please enter a city name');
      return;
    }

    if (!CONFIG.API_KEY) {
      this.showError(CONFIG.ERROR_MESSAGES.NO_API_KEY);
      return;
    }

    await this.loadWeather(city);
    localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_CITY, city);
  }

  /**
   * Load weather data
   */
  async loadWeather(city) {
    this.showLoading();
    this.hideError();

    try {
      const [currentWeather, forecast] = await Promise.all([
        weatherAPI.getCurrentWeather(city),
        weatherAPI.getForecast(city)
      ]);

      this.currentWeatherData = currentWeather;
      this.forecastData = forecast;
      this.lastUpdate = new Date();

      this.displayCurrentWeather(currentWeather);
      this.displayWeatherDetails(currentWeather);
      this.displayForecast(forecast);
      this.updateLastUpdate();
    } catch (error) {
      this.showError(error.message || CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }

  /**
   * Get current location
   */
  getCurrentLocation() {
    if (!navigator.geolocation) {
      this.showError('Geolocation is not supported by your browser');
      return;
    }

    if (!CONFIG.API_KEY) {
      this.showError(CONFIG.ERROR_MESSAGES.NO_API_KEY);
      return;
    }

    this.showLoading();
    this.hideError();

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const [currentWeather, forecast] = await Promise.all([
            weatherAPI.getCurrentWeatherByCoordinates(latitude, longitude),
            weatherAPI.getForecastByCoordinates(latitude, longitude)
          ]);

          this.currentWeatherData = currentWeather;
          this.forecastData = forecast;
          this.lastUpdate = new Date();

          this.searchInput.value = currentWeather.name;
          this.displayCurrentWeather(currentWeather);
          this.displayWeatherDetails(currentWeather);
          this.displayForecast(forecast);
          this.updateLastUpdate();

          localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_CITY, currentWeather.name);
        } catch (error) {
          this.showError(error.message || CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR);
        }
      },
      (error) => {
        this.showError(CONFIG.ERROR_MESSAGES.GEOLOCATION_ERROR);
        console.error('Geolocation error:', error);
      },
      CONFIG.GEOLOCATION_OPTIONS
    );
  }

  /**
   * Display current weather
   */
  displayCurrentWeather(data) {
    const { name, sys, main, weather, wind } = data;
    const tempUnit = CONFIG.TEMP_UNITS[getUnits()];
    const weatherIcon = getWeatherIcon(weather[0].icon);
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    this.currentWeatherSection.innerHTML = `
      <div class="weather-content">
        <div class="weather-main">
          <div class="weather-city">${name}, ${sys.country}</div>
          <div class="weather-date">${date}</div>
          <div class="weather-description">${weather[0].description}</div>
          <div class="weather-temp">${Math.round(main.temp)}${tempUnit}</div>
          <div class="weather-feels">Feels like ${Math.round(main.feels_like)}${tempUnit}</div>
        </div>
        <div class="weather-icon-container">
          <i class="weather-icon ${weatherIcon}"></i>
        </div>
      </div>
    `;
  }

  /**
   * Display weather details
   */
  displayWeatherDetails(data) {
    const { main, wind, visibility } = data;
    const windUnit = CONFIG.WIND_UNITS[getUnits()];
    const visibilityKm = (visibility / 1000).toFixed(1);

    document.getElementById('windSpeed').textContent = `${wind.speed} ${windUnit}`;
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('pressure').textContent = `${main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${visibilityKm} km`;

    this.weatherDetailsSection.style.display = 'grid';
  }

  /**
   * Display forecast
   */
  displayForecast(data) {
    const forecastList = data.list;
    const tempUnit = CONFIG.TEMP_UNITS[getUnits()];

    // Group forecast by day
    const dailyForecasts = {};
    const hourlyForecasts = [];

    forecastList.forEach((item, index) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();

      if (index < 8) {
        hourlyForecasts.push(item);
      }

      if (!dailyForecasts[dayKey]) {
        dailyForecasts[dayKey] = [];
      }
      dailyForecasts[dayKey].push(item);
    });

    this.displayHourlyForecast(hourlyForecasts, tempUnit);
    this.displayDailyForecast(dailyForecasts, tempUnit);
  }

  /**
   * Display hourly forecast
   */
  displayHourlyForecast(hourlyData, tempUnit) {
    const hourlyForecast = document.getElementById('hourlyForecast');
    hourlyForecast.innerHTML = '';

    hourlyData.forEach(item => {
      const date = new Date(item.dt * 1000);
      const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const weatherIcon = getWeatherIcon(item.weather[0].icon);
      const rainChance = item.pop ? Math.round(item.pop * 100) : 0;

      const hourlyItem = document.createElement('div');
      hourlyItem.className = 'hourly-item';
      hourlyItem.innerHTML = `
        <div class="hourly-time">${time}</div>
        <i class="hourly-icon ${weatherIcon}"></i>
        <div class="hourly-temp">${Math.round(item.main.temp)}${tempUnit}</div>
        <div class="hourly-rain">${rainChance}% rain</div>
      `;
      hourlyForecast.appendChild(hourlyItem);
    });

    this.hourlySection.style.display = 'block';
  }

  /**
   * Display daily forecast
   */
  displayDailyForecast(dailyData, tempUnit) {
    const dailyForecast = document.getElementById('dailyForecast');
    dailyForecast.innerHTML = '';

    const days = Object.keys(dailyData).slice(0, 5);

    days.forEach(day => {
      const forecasts = dailyData[day];
      const date = new Date(forecasts[0].dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Get min/max temps and most common weather
      const temps = forecasts.map(f => f.main.temp);
      const minTemp = Math.round(Math.min(...temps));
      const maxTemp = Math.round(Math.max(...temps));
      const midForecast = forecasts[Math.floor(forecasts.length / 2)];
      const weatherIcon = getWeatherIcon(midForecast.weather[0].icon);
      const description = midForecast.weather[0].main;

      const dailyItem = document.createElement('div');
      dailyItem.className = 'daily-item';
      dailyItem.innerHTML = `
        <div class="daily-day">${dayName}<br>${dayDate}</div>
        <i class="daily-icon ${weatherIcon}"></i>
        <div class="daily-temps">
          <div class="daily-high">${maxTemp}${tempUnit}</div>
          <div class="daily-low">${minTemp}${tempUnit}</div>
        </div>
        <div class="daily-description">${description}</div>
      `;
      dailyForecast.appendChild(dailyItem);
    });

    this.dailySection.style.display = 'block';
  }

  /**
   * Update last update time
   */
  updateLastUpdate() {
    const time = this.lastUpdate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    this.lastUpdateSpan.textContent = time;
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.currentWeatherSection.innerHTML = `
      <div class="weather-loading">
        <div class="spinner"></div>
        <p>Loading weather data...</p>
      </div>
    `;
    this.weatherDetailsSection.style.display = 'none';
    this.hourlySection.style.display = 'none';
    this.dailySection.style.display = 'none';
  }

  /**
   * Show error message
   */
  showError(message) {
    this.currentWeatherSection.innerHTML = '';
    this.weatherDetailsSection.style.display = 'none';
    this.hourlySection.style.display = 'none';
    this.dailySection.style.display = 'none';
    this.errorText.textContent = message;
    this.errorMessage.style.display = 'flex';
  }

  /**
   * Hide error message
   */
  hideError() {
    this.errorMessage.style.display = 'none';
  }

  /**
   * Toggle dark theme
   */
  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
    this.updateThemeIcon();
  }

  /**
   * Apply theme from localStorage
   */
  applyTheme() {
    const theme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    }
    this.updateThemeIcon();
  }

  /**
   * Update theme icon
   */
  updateThemeIcon() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    this.themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }

  /**
   * Open settings modal
   */
  openSettings() {
    this.apiKeyInput.value = CONFIG.API_KEY || '';
    this.unitSelect.value = getUnits();
    this.languageSelect.value = getLanguage();
    this.settingsModal.classList.add('active');
  }

  /**
   * Close settings modal
   */
  closeSettingsModal() {
    this.settingsModal.classList.remove('active');
  }

  /**
   * Save settings
   */
  saveSettingsData() {
    const apiKey = this.apiKeyInput.value.trim();
    const units = this.unitSelect.value;
    const language = this.languageSelect.value;

    if (!apiKey) {
      alert('Please enter an API key');
      return;
    }

    localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEY, apiKey);
    localStorage.setItem(CONFIG.STORAGE_KEYS.UNITS, units);
    localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, language);

    CONFIG.API_KEY = apiKey;
    weatherAPI.clearCache();

    alert(CONFIG.SUCCESS_MESSAGES.SETTINGS_SAVED);
    this.closeSettingsModal();

    // Reload current weather with new settings
    if (this.currentWeatherData) {
      this.loadWeather(this.currentWeatherData.name);
    }
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    const apiKey = localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEY);
    const units = localStorage.getItem(CONFIG.STORAGE_KEYS.UNITS);
    const language = localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE);

    if (apiKey) {
      CONFIG.API_KEY = apiKey;
    }
    if (units) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.UNITS, units);
    }
    if (language) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, language);
    }
  }
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new WeatherDashboard();
  });
} else {
  window.dashboard = new WeatherDashboard();
}
