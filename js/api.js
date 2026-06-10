// Weather API Service
// This file contains functions to interact with the OpenWeatherMap API

class WeatherAPI {
  constructor() {
    this.baseURL = CONFIG.API_BASE;
    this.cache = new Map();
  }

  /**
   * Get current weather for a city
   */
  async getCurrentWeather(city) {
    const units = getUnits();
    const language = getLanguage();

    if (!CONFIG.API_KEY) {
      throw new Error(CONFIG.ERROR_MESSAGES.NO_API_KEY);
    }

    try {
      const response = await this._makeRequest('/data/2.5/weather', {
        q: city,
        units: units,
        lang: language,
        appid: CONFIG.API_KEY
      });

      return response;
    } catch (error) {
      if (error.message.includes('404')) {
        throw new Error(CONFIG.ERROR_MESSAGES.CITY_NOT_FOUND);
      }
      throw error;
    }
  }

  /**
   * Get current weather by coordinates
   */
  async getCurrentWeatherByCoordinates(lat, lon) {
    const units = getUnits();
    const language = getLanguage();

    if (!CONFIG.API_KEY) {
      throw new Error(CONFIG.ERROR_MESSAGES.NO_API_KEY);
    }

    try {
      const response = await this._makeRequest('/data/2.5/weather', {
        lat: lat,
        lon: lon,
        units: units,
        lang: language,
        appid: CONFIG.API_KEY
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get 5-day forecast for a city
   */
  async getForecast(city) {
    const units = getUnits();
    const language = getLanguage();

    if (!CONFIG.API_KEY) {
      throw new Error(CONFIG.ERROR_MESSAGES.NO_API_KEY);
    }

    try {
      const response = await this._makeRequest('/data/2.5/forecast', {
        q: city,
        units: units,
        lang: language,
        appid: CONFIG.API_KEY
      });

      return response;
    } catch (error) {
      if (error.message.includes('404')) {
        throw new Error(CONFIG.ERROR_MESSAGES.CITY_NOT_FOUND);
      }
      throw error;
    }
  }

  /**
   * Get 5-day forecast by coordinates
   */
  async getForecastByCoordinates(lat, lon) {
    const units = getUnits();
    const language = getLanguage();

    if (!CONFIG.API_KEY) {
      throw new Error(CONFIG.ERROR_MESSAGES.NO_API_KEY);
    }

    try {
      const response = await this._makeRequest('/data/2.5/forecast', {
        lat: lat,
        lon: lon,
        units: units,
        lang: language,
        appid: CONFIG.API_KEY
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get city coordinates by name
   */
  async getCoordinates(city, limit = 5) {
    if (!CONFIG.API_KEY) {
      throw new Error(CONFIG.ERROR_MESSAGES.NO_API_KEY);
    }

    try {
      const response = await this._makeRequest('/geo/1.0/direct', {
        q: city,
        limit: limit,
        appid: CONFIG.API_KEY
      });

      if (!Array.isArray(response)) {
        return [response];
      }
      return response;
    } catch (error) {
      if (error.message.includes('404')) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Make HTTP request to OpenWeatherMap API
   */
  async _makeRequest(endpoint, params) {
    const cacheKey = this._getCacheKey(endpoint, params);

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
        return cached.data;
      } else {
        this.cache.delete(cacheKey);
      }
    }

    // Build URL
    const url = new URL(this.baseURL + endpoint);
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

      const response = await fetch(url.toString(), {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(CONFIG.ERROR_MESSAGES.INVALID_API_KEY);
        } else if (response.status === 404) {
          throw new Error(CONFIG.ERROR_MESSAGES.CITY_NOT_FOUND);
        } else if (response.status === 429) {
          throw new Error(CONFIG.ERROR_MESSAGES.RATE_LIMIT);
        } else {
          throw new Error(`API Error: ${response.status}`);
        }
      }

      const data = await response.json();

      // Cache the result
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(CONFIG.ERROR_MESSAGES.TIMEOUT);
      }
      throw error;
    }
  }

  /**
   * Generate cache key
   */
  _getCacheKey(endpoint, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${endpoint}?${sortedParams}`;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Create global instance
const weatherAPI = new WeatherAPI();
