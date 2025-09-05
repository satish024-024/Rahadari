import { WeatherData, WeatherCondition } from '../types/weather';
import { WEATHER_CONDITIONS, WEATHER_SEVERITY } from './constants';

export const getWeatherIcon = (condition: string, rainProbability: number): string => {
  if (rainProbability > 70) return '🌧️';
  if (rainProbability > 40) return '🌦️';
  if (condition.includes('clear')) return '☀️';
  if (condition.includes('cloud')) return '☁️';
  if (condition.includes('storm')) return '⛈️';
  if (condition.includes('fog')) return '🌫️';
  if (condition.includes('snow')) return '❄️';
  return '☀️';
};

export const getWeatherColor = (rainProbability: number): string => {
  if (rainProbability > 70) return WEATHER_SEVERITY.high.color;
  if (rainProbability > 40) return WEATHER_SEVERITY.medium.color;
  return WEATHER_SEVERITY.low.color;
};

export const getWeatherSeverity = (rainProbability: number): 'low' | 'medium' | 'high' => {
  if (rainProbability > 70) return 'high';
  if (rainProbability > 40) return 'medium';
  return 'low';
};

export const getWeatherLabel = (rainProbability: number): string => {
  if (rainProbability > 70) return WEATHER_SEVERITY.high.label;
  if (rainProbability > 40) return WEATHER_SEVERITY.medium.label;
  return WEATHER_SEVERITY.low.label;
};

export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9;
};

export const kmhToMph = (kmh: number): number => {
  return kmh * 0.621371;
};

export const mphToKmh = (mph: number): number => {
  return mph * 1.60934;
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getUVIndexLevel = (uvIndex: number): { level: string; color: string; description: string } => {
  if (uvIndex <= 2) return { level: 'Low', color: '#10b981', description: 'Minimal protection required' };
  if (uvIndex <= 5) return { level: 'Moderate', color: '#f59e0b', description: 'Some protection required' };
  if (uvIndex <= 7) return { level: 'High', color: '#f97316', description: 'Protection required' };
  if (uvIndex <= 10) return { level: 'Very High', color: '#ef4444', description: 'Extra protection required' };
  return { level: 'Extreme', color: '#7c2d12', description: 'Avoid sun exposure' };
};

export const getVisibilityLevel = (visibility: number): { level: string; color: string; description: string } => {
  if (visibility >= 10) return { level: 'Excellent', color: '#10b981', description: 'Clear visibility' };
  if (visibility >= 5) return { level: 'Good', color: '#22c55e', description: 'Good visibility' };
  if (visibility >= 2) return { level: 'Moderate', color: '#f59e0b', description: 'Reduced visibility' };
  if (visibility >= 1) return { level: 'Poor', color: '#ef4444', description: 'Poor visibility' };
  return { level: 'Very Poor', color: '#7c2d12', description: 'Very poor visibility' };
};

export const interpolateWeather = (
  startWeather: WeatherData,
  endWeather: WeatherData,
  factor: number
): WeatherData => {
  return {
    temperature: Math.round(startWeather.temperature + (endWeather.temperature - startWeather.temperature) * factor),
    humidity: Math.round(startWeather.humidity + (endWeather.humidity - startWeather.humidity) * factor),
    rainProbability: Math.round(startWeather.rainProbability + (endWeather.rainProbability - startWeather.rainProbability) * factor),
    windSpeed: Math.round(startWeather.windSpeed + (endWeather.windSpeed - startWeather.windSpeed) * factor),
    visibility: Math.round(startWeather.visibility + (endWeather.visibility - startWeather.visibility) * factor),
    condition: factor < 0.5 ? startWeather.condition : endWeather.condition,
    icon: factor < 0.5 ? startWeather.icon : endWeather.icon,
    timestamp: Date.now(),
    source: 'interpolated',
    confidence: 'low',
    description: factor < 0.5 ? startWeather.description : endWeather.description,
    pressure: Math.round(startWeather.pressure + (endWeather.pressure - startWeather.pressure) * factor),
    feelsLike: Math.round(startWeather.feelsLike + (endWeather.feelsLike - startWeather.feelsLike) * factor),
  };
};

export const calculateWeatherConfidence = (weatherData: WeatherData[]): 'high' | 'medium' | 'low' => {
  if (weatherData.length >= 3) return 'high';
  if (weatherData.length === 2) return 'medium';
  return 'low';
};

export const getWeatherRecommendation = (weather: WeatherData, travelMode: 'bike' | 'car' | 'bus'): string => {
  const recommendations: string[] = [];
  
  if (weather.rainProbability > 70) {
    recommendations.push('Heavy rain expected - consider postponing travel');
    if (travelMode === 'bike') {
      recommendations.push('Wear waterproof gear and be extra cautious');
    }
  } else if (weather.rainProbability > 40) {
    recommendations.push('Light rain possible - carry rain protection');
  }
  
  if (weather.windSpeed > 30) {
    recommendations.push('Strong winds - reduce speed and maintain control');
    if (travelMode === 'bike') {
      recommendations.push('Avoid riding in strong crosswinds');
    }
  }
  
  if (weather.visibility < 2) {
    recommendations.push('Poor visibility - use headlights and reduce speed');
  }
  
  if (weather.temperature > 40) {
    recommendations.push('Extreme heat - stay hydrated and take breaks');
  } else if (weather.temperature < 5) {
    recommendations.push('Cold weather - dress warmly and check vehicle fluids');
  }
  
  return recommendations.length > 0 ? recommendations.join('. ') : 'Good weather conditions for travel';
};