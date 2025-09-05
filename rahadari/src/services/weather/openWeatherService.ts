import axios from 'axios';
import { WeatherData } from '../../types/weather';
import { OpenWeatherResponse } from '../../types/api';
import { getWeatherIcon, getWeatherSeverity } from '../../utils/weatherUtils';

export class OpenWeatherService {
  private apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  async getWeather(lat: number, lng: number, time?: Date): Promise<WeatherData> {
    try {
      const response = await axios.get<OpenWeatherResponse>(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon: lng,
          appid: this.apiKey,
          units: 'metric',
        },
      });

      const data = response.data;
      
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        rainProbability: this.calculateRainProbability(data),
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round(data.main.visibility / 1000), // Convert m to km
        condition: data.weather[0].main.toLowerCase(),
        icon: getWeatherIcon(data.weather[0].main.toLowerCase(), this.calculateRainProbability(data)),
        timestamp: data.dt * 1000,
        source: 'openweather',
        confidence: 'high',
        description: data.weather[0].description,
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
      };
    } catch (error) {
      console.error('OpenWeather API error:', error);
      throw new Error('Failed to fetch weather data from OpenWeather');
    }
  }

  async getForecast(lat: number, lng: number): Promise<WeatherData[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon: lng,
          appid: this.apiKey,
          units: 'metric',
        },
      });

      return response.data.list.map((item: any) => ({
        temperature: Math.round(item.main.temp),
        humidity: item.main.humidity,
        rainProbability: this.calculateRainProbability(item),
        windSpeed: Math.round(item.wind.speed * 3.6),
        visibility: Math.round(item.main.visibility / 1000),
        condition: item.weather[0].main.toLowerCase(),
        icon: getWeatherIcon(item.weather[0].main.toLowerCase(), this.calculateRainProbability(item)),
        timestamp: item.dt * 1000,
        source: 'openweather',
        confidence: 'high',
        description: item.weather[0].description,
        pressure: item.main.pressure,
        feelsLike: Math.round(item.main.feels_like),
      }));
    } catch (error) {
      console.error('OpenWeather forecast error:', error);
      throw new Error('Failed to fetch forecast data from OpenWeather');
    }
  }

  private calculateRainProbability(data: any): number {
    // OpenWeather doesn't provide rain probability in current weather
    // We'll estimate based on weather condition and humidity
    if (data.rain && data.rain['1h']) {
      return Math.min(100, data.rain['1h'] * 20); // Convert mm/h to probability
    }
    
    if (data.weather[0].main.toLowerCase().includes('rain')) {
      return 80;
    }
    
    if (data.weather[0].main.toLowerCase().includes('drizzle')) {
      return 60;
    }
    
    if (data.weather[0].main.toLowerCase().includes('cloud')) {
      return Math.min(50, data.main.humidity / 2);
    }
    
    return Math.min(30, data.main.humidity / 3);
  }
}