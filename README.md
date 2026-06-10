# Weather Dashboard

A modern weather dashboard that fetches real-time weather data from the OpenWeatherMap API and displays it with an intuitive, responsive UI.

## Features

- 🌡️ Real-time weather data
- 📍 Search by city name
- 📊 Hourly and 5-day forecast
- 🎨 Beautiful, responsive design
- 🌙 Dark/Light mode toggle
- 📱 Mobile-friendly interface
- ⚡ Fast and lightweight

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: OpenWeatherMap API
- **Icons**: Font Awesome
- **Storage**: localStorage for settings

## Prerequisites

- OpenWeatherMap API key (free at https://openweathermap.org/api)
- Modern web browser
- Internet connection

## Installation

1. Clone the repository:
```bash
git clone https://github.com/simba83524/weather-dashboard.git
cd weather-dashboard
```

2. Open `index.html` in your web browser or serve it with a local server:
```bash
python -m http.server 8000
# or
npx http-server
```

3. Get your API key from [OpenWeatherMap](https://openweathermap.org/api)

4. Enter your API key in the dashboard settings or update it in `config.js`

## Usage

1. Enter a city name in the search box
2. Press Enter or click the search button
3. View current weather, hourly, and 5-day forecast
4. Toggle dark mode with the theme button
5. Change temperature units (°C/°F)

## API Configuration

The dashboard uses the following OpenWeatherMap endpoints:

- Current Weather: `/weather`
- 5-Day Forecast: `/forecast`
- Geolocation: `/geo/1.0/direct`

## File Structure

```
weather-dashboard/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   ├── app.js          # Main application logic
│   ├── api.js          # API service functions
│   └── config.js       # Configuration and constants
├── assets/
│   └── weather-icons/  # Weather condition icons
├── config.example.js   # Example configuration
└── README.md           # This file
```

## Configuration

Copy `config.example.js` to `config.js` and update with your API key:

```javascript
const CONFIG = {
  API_KEY: 'your-openweathermap-api-key',
  UNITS: 'metric', // 'metric' or 'imperial'
  LANGUAGE: 'en'
};
```

## Environment Variables

For production, use environment variables:

```bash
export WEATHER_API_KEY=your-api-key
```

## Features in Detail

### Current Weather
- Temperature and "feels like" temperature
- Weather condition with icon
- Wind speed and direction
- Humidity and pressure
- UV index and visibility

### Forecast
- 5-day weather forecast with 3-hour intervals
- Temperature trends
- Precipitation probability

### User Preferences
- Temperature unit selection (Celsius/Fahrenheit)
- Dark/Light mode
- Saved city history
- Geolocation support

## Error Handling

The dashboard includes:
- Network error handling
- Invalid API key detection
- City not found alerts
- Rate limit notifications

## Performance

- Minified CSS and JavaScript
- Image optimization
- Lazy loading for forecasts
- Efficient DOM updates
- Caching strategies

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security

- API key stored securely (environment variables for production)
- HTTPS only for API calls
- Input validation and sanitization
- XSS protection

## Troubleshooting

### "Invalid API Key" Error
- Verify your OpenWeatherMap API key is correct
- Ensure the free tier includes the endpoints used
- Check API key has not exceeded rate limits

### "City not found"
- Check spelling of city name
- Try using city code (e.g., "New York, US")
- Some cities may require postal code

### Weather data not updating
- Check internet connection
- Verify browser console for errors
- Clear browser cache and reload
- Check API rate limits haven't been exceeded

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Credits

- Weather data: [OpenWeatherMap](https://openweathermap.org/)
- Icons: [Font Awesome](https://fontawesome.com/)
- Inspiration: Weather.com, Weather Underground

## Support

For issues and questions, please open an issue on GitHub.
