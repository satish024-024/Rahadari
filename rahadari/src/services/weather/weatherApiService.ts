import axios from 'axios';
import { WeatherData } from '../../types/weather';
import { getWeatherIcon } from '../../utils/weatherUtils';

interface WeatherAPIResponse {
  current: {
    temp_c: number;
    humidity: number;
    precip_mm: number;
    wind_kph: number;
    vis_km: number;
    condition: {
      text: string;
      code: number;
    };
    pressure_mb: number;
    feelslike_c: number;
    uv: number;
  };
  forecast: {
    forecastday: Array<{
      hour: Array<{
        time: string;
        temp_c: number;
        humidity: number;
        precip_mm: number;
        wind_kph: number;
        vis_km: number;
        condition: {
          text: string;
          code: number;
        };
        pressure_mb: number;
        feelslike_c: number;
        uv: number;
      }>;
    }>;
  };
}

export class WeatherAPIService {
  private apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
  private baseUrl = 'https://api.weatherapi.com/v1';

  async getWeather(lat: number, lng: number, time?: Date): Promise<WeatherData> {
    try {
      const response = await axios.get<WeatherAPIResponse>(`${this.baseUrl}/current.json`, {
        params: {
          key: this.apiKey,
          q: `${lat},${lng}`,
          aqi: 'no',
        },
      });

      const data = response.data.current;
      
      return {
        temperature: Math.round(data.temp_c),
        humidity: data.humidity,
        rainProbability: this.calculateRainProbability(data.precip_mm, data.condition.code),
        windSpeed: Math.round(data.wind_kph),
        visibility: Math.round(data.vis_km),
        condition: data.condition.text.toLowerCase(),
        icon: getWeatherIcon(data.condition.text.toLowerCase(), this.calculateRainProbability(data.precip_mm, data.condition.code)),
        timestamp: Date.now(),
        source: 'weatherapi',
        confidence: 'high',
        description: data.condition.text,
        pressure: data.pressure_mb,
        feelsLike: Math.round(data.feelslike_c),
        uvIndex: data.uv,
      };
    } catch (error) {
      console.error('WeatherAPI error:', error);
      throw new Error('Failed to fetch weather data from WeatherAPI');
    }
  }

  async getForecast(lat: number, lng: number): Promise<WeatherData[]> {
    try {
      const response = await axios.get<WeatherAPIResponse>(`${this.baseUrl}/forecast.json`, {
        params: {
          key: this.apiKey,
          q: `${lat},${lng}`,
          days: 3,
          aqi: 'no',
          alerts: 'no',
        },
      });

      const weatherData: WeatherData[] = [];

      response.data.forecast.forecastday.forEach(day => {
        day.hour.forEach(hour => {
          weatherData.push({
            temperature: Math.round(hour.temp_c),
            humidity: hour.humidity,
            rainProbability: this.calculateRainProbability(hour.precip_mm, hour.condition.code),
            windSpeed: Math.round(hour.wind_kph),
            visibility: Math.round(hour.vis_km),
            condition: hour.condition.text.toLowerCase(),
            icon: getWeatherIcon(hour.condition.text.toLowerCase(), this.calculateRainProbability(hour.precip_mm, hour.condition.code)),
            timestamp: new Date(hour.time).getTime(),
            source: 'weatherapi',
            confidence: 'high',
            description: hour.condition.text,
            pressure: hour.pressure_mb,
            feelsLike: Math.round(hour.feelslike_c),
            uvIndex: hour.uv,
          });
        });
      });

      return weatherData;
    } catch (error) {
      console.error('WeatherAPI forecast error:', error);
      throw new Error('Failed to fetch forecast data from WeatherAPI');
    }
  }

  private calculateRainProbability(precipitation: number, conditionCode: number): number {
    if (precipitation > 0) {
      return Math.min(100, precipitation * 20); // Convert mm to probability
    }
    
    // WeatherAPI condition codes for rain
    const rainCodes = [1063, 1072, 1087, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1240, 1243, 1246, 1249, 1252, 1255, 1258, 1261, 1264, 1273, 1276, 1279, 1282];
    
    if (rainCodes.includes(conditionCode)) {
      return 80;
    }
    
    // Cloud codes
    const cloudCodes = [1003, 1006, 1009];
    if (cloudCodes.includes(conditionCode)) {
      return 30;
    }
    
    return 10; // Clear sky
  }
}