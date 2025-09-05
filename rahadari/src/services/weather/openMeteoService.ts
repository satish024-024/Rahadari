import axios from 'axios';
import { WeatherData } from '../../types/weather';
import { getWeatherIcon, getWeatherSeverity } from '../../utils/weatherUtils';

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    visibility: number;
    weather_code: number;
    time: string;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    precipitation: string;
    wind_speed_10m: string;
    visibility: string;
  };
}

export class OpenMeteoService {
  private baseUrl = 'https://api.open-meteo.com/v1';

  async getWeather(lat: number, lng: number, time?: Date): Promise<WeatherData> {
    try {
      const response = await axios.get<OpenMeteoResponse>(`${this.baseUrl}/current`, {
        params: {
          latitude: lat,
          longitude: lng,
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'precipitation',
            'wind_speed_10m',
            'visibility',
            'weather_code',
          ],
          timezone: 'auto',
        },
      });

      const data = response.data.current;
      
      return {
        temperature: Math.round(data.temperature_2m),
        humidity: data.relative_humidity_2m,
        rainProbability: this.calculateRainProbability(data.weather_code, data.precipitation),
        windSpeed: Math.round(data.wind_speed_10m * 3.6), // Convert m/s to km/h
        visibility: Math.round(data.visibility / 1000), // Convert m to km
        condition: this.getWeatherCondition(data.weather_code),
        icon: getWeatherIcon(this.getWeatherCondition(data.weather_code), this.calculateRainProbability(data.weather_code, data.precipitation)),
        timestamp: new Date(data.time).getTime(),
        source: 'openmeteo',
        confidence: 'high',
        description: this.getWeatherDescription(data.weather_code),
        pressure: 1013, // Default pressure (OpenMeteo doesn't provide this in current weather)
        feelsLike: Math.round(data.temperature_2m), // Simplified - would need more complex calculation
      };
    } catch (error) {
      console.error('OpenMeteo API error:', error);
      throw new Error('Failed to fetch weather data from OpenMeteo');
    }
  }

  async getForecast(lat: number, lng: number): Promise<WeatherData[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          latitude: lat,
          longitude: lng,
          hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'precipitation',
            'wind_speed_10m',
            'visibility',
            'weather_code',
          ],
          timezone: 'auto',
          forecast_days: 3,
        },
      });

      const hourly = response.data.hourly;
      const weatherData: WeatherData[] = [];

      for (let i = 0; i < hourly.time.length; i++) {
        weatherData.push({
          temperature: Math.round(hourly.temperature_2m[i]),
          humidity: hourly.relative_humidity_2m[i],
          rainProbability: this.calculateRainProbability(hourly.weather_code[i], hourly.precipitation[i]),
          windSpeed: Math.round(hourly.wind_speed_10m[i] * 3.6),
          visibility: Math.round(hourly.visibility[i] / 1000),
          condition: this.getWeatherCondition(hourly.weather_code[i]),
          icon: getWeatherIcon(this.getWeatherCondition(hourly.weather_code[i]), this.calculateRainProbability(hourly.weather_code[i], hourly.precipitation[i])),
          timestamp: new Date(hourly.time[i]).getTime(),
          source: 'openmeteo',
          confidence: 'high',
          description: this.getWeatherDescription(hourly.weather_code[i]),
          pressure: 1013,
          feelsLike: Math.round(hourly.temperature_2m[i]),
        });
      }

      return weatherData;
    } catch (error) {
      console.error('OpenMeteo forecast error:', error);
      throw new Error('Failed to fetch forecast data from OpenMeteo');
    }
  }

  private calculateRainProbability(weatherCode: number, precipitation: number): number {
    // Weather codes from OpenMeteo
    if (precipitation > 0) {
      return Math.min(100, precipitation * 25); // Convert mm to probability
    }
    
    switch (weatherCode) {
      case 0: return 0; // Clear sky
      case 1: case 2: case 3: return 20; // Mainly clear, partly cloudy, overcast
      case 45: case 48: return 30; // Fog
      case 51: case 53: case 55: return 60; // Drizzle
      case 56: case 57: return 70; // Freezing drizzle
      case 61: case 63: case 65: return 80; // Rain
      case 66: case 67: return 85; // Freezing rain
      case 71: case 73: case 75: return 40; // Snow fall
      case 77: return 35; // Snow grains
      case 80: case 81: case 82: return 75; // Rain showers
      case 85: case 86: return 45; // Snow showers
      case 95: return 90; // Thunderstorm
      case 96: case 99: return 95; // Thunderstorm with hail
      default: return 30;
    }
  }

  private getWeatherCondition(weatherCode: number): string {
    switch (weatherCode) {
      case 0: return 'clear';
      case 1: case 2: case 3: return 'partly-cloudy';
      case 45: case 48: return 'fog';
      case 51: case 53: case 55: case 56: case 57: return 'rain';
      case 61: case 63: case 65: case 66: case 67: return 'rain';
      case 71: case 73: case 75: case 77: return 'snow';
      case 80: case 81: case 82: return 'rain';
      case 85: case 86: return 'snow';
      case 95: case 96: case 99: return 'storm';
      default: return 'clear';
    }
  }

  private getWeatherDescription(weatherCode: number): string {
    switch (weatherCode) {
      case 0: return 'Clear sky';
      case 1: return 'Mainly clear';
      case 2: return 'Partly cloudy';
      case 3: return 'Overcast';
      case 45: return 'Fog';
      case 48: return 'Depositing rime fog';
      case 51: return 'Light drizzle';
      case 53: return 'Moderate drizzle';
      case 55: return 'Dense drizzle';
      case 56: return 'Light freezing drizzle';
      case 57: return 'Dense freezing drizzle';
      case 61: return 'Slight rain';
      case 63: return 'Moderate rain';
      case 65: return 'Heavy rain';
      case 66: return 'Light freezing rain';
      case 67: return 'Heavy freezing rain';
      case 71: return 'Slight snow fall';
      case 73: return 'Moderate snow fall';
      case 75: return 'Heavy snow fall';
      case 77: return 'Snow grains';
      case 80: return 'Slight rain showers';
      case 81: return 'Moderate rain showers';
      case 82: return 'Violent rain showers';
      case 85: return 'Slight snow showers';
      case 86: return 'Heavy snow showers';
      case 95: return 'Thunderstorm';
      case 96: return 'Thunderstorm with slight hail';
      case 99: return 'Thunderstorm with heavy hail';
      default: return 'Unknown';
    }
  }
}