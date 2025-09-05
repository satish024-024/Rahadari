export interface WeatherData {
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
  description: string;
  pressure: number;
  uvIndex?: number;
  feelsLike: number;
}

export interface WeatherPoint {
  lat: number;
  lng: number;
  weather: WeatherData;
  location: string;
  time: string;
  distance: number;
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'storm' | 'fog' | 'heat' | 'cold';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  message: string;
  startTime: Date;
  endTime: Date;
  affectedArea: string;
}

export interface WeatherForecast {
  date: string;
  hourly: WeatherData[];
  daily: {
    maxTemp: number;
    minTemp: number;
    condition: string;
    rainProbability: number;
  };
}

export type WeatherCondition = 
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy-rain'
  | 'storm'
  | 'fog'
  | 'snow'
  | 'haze';