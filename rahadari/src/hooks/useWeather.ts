import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WeatherData, WeatherPoint } from '../types/weather';
import { WeatherAggregator } from '../services/weather/weatherAggregator';
import { cacheManager } from '../services/cache/cacheManager';

const weatherAggregator = new WeatherAggregator();

export const useWeather = (lat?: number, lng?: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!lat || !lng) return;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = cacheManager.getWeather(lat, lng);
      if (cached) {
        setWeather(cached);
        setLoading(false);
        return;
      }

      const weatherData = await weatherAggregator.getWeatherForPoint(lat, lng);
      setWeather(weatherData);
      
      // Cache the result
      cacheManager.setWeather(lat, lng, weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weather, loading, error, refetch: fetchWeather };
};

export const useRouteWeather = (
  waypoints: Array<{ lat: number; lng: number }>,
  departureTime: Date
) => {
  return useQuery({
    queryKey: ['routeWeather', waypoints, departureTime],
    queryFn: async () => {
      if (waypoints.length < 2) return [];
      
      return await weatherAggregator.getRouteWeather(waypoints, departureTime);
    },
    enabled: waypoints.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useWeatherForecast = (lat?: number, lng?: number) => {
  return useQuery({
    queryKey: ['weatherForecast', lat, lng],
    queryFn: async () => {
      if (!lat || !lng) return [];
      
      // Generate waypoints for the next 24 hours
      const waypoints = [];
      const now = new Date();
      
      for (let i = 0; i < 24; i++) {
        const time = new Date(now.getTime() + i * 60 * 60 * 1000);
        waypoints.push({ lat, lng, time });
      }
      
      return await weatherAggregator.getRouteWeather(waypoints, now);
    },
    enabled: !!lat && !!lng,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useWeatherAlerts = (lat?: number, lng?: number) => {
  return useQuery({
    queryKey: ['weatherAlerts', lat, lng],
    queryFn: async () => {
      if (!lat || !lng) return [];
      
      // This would integrate with weather alert APIs
      // For now, return mock alerts based on weather conditions
      const weather = await weatherAggregator.getWeatherForPoint(lat, lng);
      
      const alerts = [];
      
      if (weather.rainProbability > 80) {
        alerts.push({
          id: 'heavy-rain',
          type: 'rain' as const,
          severity: 'high' as const,
          message: 'Heavy rain expected. Consider postponing travel.',
          startTime: new Date(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          affectedArea: 'Current location',
        });
      }
      
      if (weather.windSpeed > 30) {
        alerts.push({
          id: 'strong-winds',
          type: 'storm' as const,
          severity: 'medium' as const,
          message: 'Strong winds detected. Reduce speed and maintain control.',
          startTime: new Date(),
          endTime: new Date(Date.now() + 60 * 60 * 1000),
          affectedArea: 'Current location',
        });
      }
      
      if (weather.visibility < 2) {
        alerts.push({
          id: 'poor-visibility',
          type: 'fog' as const,
          severity: 'high' as const,
          message: 'Poor visibility conditions. Use headlights and reduce speed.',
          startTime: new Date(),
          endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
          affectedArea: 'Current location',
        });
      }
      
      return alerts;
    },
    enabled: !!lat && !!lng,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};