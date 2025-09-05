export const APP_CONFIG = {
  name: 'Rahadari',
  version: '1.0.0',
  description: 'Weather-integrated route planning for India',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'hi', 'te'],
  cacheDuration: 30 * 60 * 1000, // 30 minutes
  maxCacheSize: 100, // Maximum number of cached entries
};

export const API_ENDPOINTS = {
  openWeather: {
    current: 'https://api.openweathermap.org/data/2.5/weather',
    forecast: 'https://api.openweathermap.org/data/2.5/forecast',
    onecall: 'https://api.openweathermap.org/data/2.5/onecall',
  },
  openRoute: {
    directions: 'https://api.openrouteservice.org/v2/directions',
    geocode: 'https://api.openrouteservice.org/geocode/search',
  },
  nominatim: {
    search: 'https://nominatim.openstreetmap.org/search',
    reverse: 'https://nominatim.openstreetmap.org/reverse',
  },
  openMeteo: {
    current: 'https://api.open-meteo.com/v1/current',
    forecast: 'https://api.open-meteo.com/v1/forecast',
  },
  weatherAPI: {
    current: 'https://api.weatherapi.com/v1/current.json',
    forecast: 'https://api.weatherapi.com/v1/forecast.json',
  },
};

export const WEATHER_CONDITIONS = {
  '01d': { condition: 'clear', icon: '☀️', color: '#fbbf24' },
  '01n': { condition: 'clear', icon: '🌙', color: '#1e40af' },
  '02d': { condition: 'partly-cloudy', icon: '⛅', color: '#9ca3af' },
  '02n': { condition: 'partly-cloudy', icon: '☁️', color: '#6b7280' },
  '03d': { condition: 'cloudy', icon: '☁️', color: '#6b7280' },
  '03n': { condition: 'cloudy', icon: '☁️', color: '#4b5563' },
  '04d': { condition: 'cloudy', icon: '☁️', color: '#4b5563' },
  '04n': { condition: 'cloudy', icon: '☁️', color: '#374151' },
  '09d': { condition: 'rain', icon: '🌧️', color: '#3b82f6' },
  '09n': { condition: 'rain', icon: '🌧️', color: '#1e40af' },
  '10d': { condition: 'rain', icon: '🌦️', color: '#3b82f6' },
  '10n': { condition: 'rain', icon: '🌧️', color: '#1e40af' },
  '11d': { condition: 'storm', icon: '⛈️', color: '#1e40af' },
  '11n': { condition: 'storm', icon: '⛈️', color: '#1e3a8a' },
  '13d': { condition: 'snow', icon: '❄️', color: '#e5e7eb' },
  '13n': { condition: 'snow', icon: '❄️', color: '#d1d5db' },
  '50d': { condition: 'fog', icon: '🌫️', color: '#9ca3af' },
  '50n': { condition: 'fog', icon: '🌫️', color: '#6b7280' },
};

export const TRAVEL_MODES = {
  bike: {
    name: 'Bike',
    icon: '🏍️',
    speed: 30, // km/h
    weatherSensitivity: 'high',
  },
  car: {
    name: 'Car',
    icon: '🚗',
    speed: 60, // km/h
    weatherSensitivity: 'medium',
  },
  bus: {
    name: 'Bus',
    icon: '🚌',
    speed: 40, // km/h
    weatherSensitivity: 'low',
  },
};

export const WEATHER_SEVERITY = {
  low: { color: '#10b981', label: 'Good', threshold: 30 },
  medium: { color: '#f59e0b', label: 'Caution', threshold: 70 },
  high: { color: '#ef4444', label: 'Dangerous', threshold: 100 },
};

export const INDIA_BOUNDS = {
  north: 37.6,
  south: 6.4,
  east: 97.4,
  west: 68.1,
};

export const MAJOR_CITIES = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311 },
];