import { OpenWeatherService } from './openWeatherService';
import { OpenMeteoService } from './openMeteoService';
import { WeatherAPIService } from './weatherApiService';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  visibility: number;
  condition: string;
  icon: string;
  timestamp: number;
  source: string;
  confidence: 'high' | 'medium' | 'low';
}

export class WeatherAggregator {
  // ...existing code...
}
