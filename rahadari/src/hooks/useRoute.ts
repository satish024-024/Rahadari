import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Route, RouteSearchParams, Coordinate } from '../types/route';
import { OpenRouteService } from '../services/routing/openRouteService';
import { NominatimService } from '../services/geocoding/nominatimService';
import { cacheManager } from '../services/cache/cacheManager';

const openRouteService = new OpenRouteService();
const nominatimService = new NominatimService();

export const useRoute = () => {
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRoute = useCallback(async (params: RouteSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      // Get coordinates for source and destination
      const [sourceCoords, destCoords] = await Promise.all([
        nominatimService.getCoordinates(params.source),
        nominatimService.getCoordinates(params.destination),
      ]);

      // Check cache first
      const cacheKey = `${sourceCoords.lat},${sourceCoords.lng}-${destCoords.lat},${destCoords.lng}-${params.travelMode}`;
      const cached = cacheManager.getRoute(params.source, params.destination, params.travelMode);
      
      if (cached) {
        setRoute(cached);
        setLoading(false);
        return cached;
      }

      // Get route from OpenRoute
      const routeData = await openRouteService.getRoute(
        sourceCoords,
        destCoords,
        params.travelMode
      );

      // Update departure time
      routeData.departureTime = params.departureTime;
      routeData.arrivalTime = new Date(
        params.departureTime.getTime() + routeData.totalDuration * 60 * 1000
      );

      setRoute(routeData);
      
      // Cache the result
      cacheManager.setRoute(params.source, params.destination, params.travelMode, routeData);
      
      return routeData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find route');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { route, loading, error, searchRoute };
};

export const useRouteSearch = (params: RouteSearchParams | null) => {
  return useQuery({
    queryKey: ['route', params],
    queryFn: async () => {
      if (!params) return null;
      
      const [sourceCoords, destCoords] = await Promise.all([
        nominatimService.getCoordinates(params.source),
        nominatimService.getCoordinates(params.destination),
      ]);

      return await openRouteService.getRoute(
        sourceCoords,
        destCoords,
        params.travelMode
      );
    },
    enabled: !!params,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useAlternativeRoutes = (
  source: Coordinate | null,
  destination: Coordinate | null,
  travelMode: 'bike' | 'car' | 'bus' = 'car'
) => {
  return useQuery({
    queryKey: ['alternativeRoutes', source, destination, travelMode],
    queryFn: async () => {
      if (!source || !destination) return [];
      
      return await openRouteService.getAlternativeRoutes(source, destination, travelMode);
    },
    enabled: !!source && !!destination,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useGeocoding = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    try {
      // Check cache first
      const cached = cacheManager.getGeocode(query);
      if (cached) {
        setSuggestions(cached);
        setLoading(false);
        return;
      }

      const results = await nominatimService.search(query, 10);
      setSuggestions(results);
      
      // Cache the results
      cacheManager.setGeocode(query, results);
    } catch (error) {
      console.error('Geocoding error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCoordinates = useCallback(async (address: string): Promise<Coordinate> => {
    return await nominatimService.getCoordinates(address);
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    return await nominatimService.reverseGeocode(lat, lng);
  }, []);

  return {
    suggestions,
    loading,
    search,
    getCoordinates,
    reverseGeocode,
  };
};

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coordinate = { lat: latitude, lng: longitude };
        
        try {
          const address = await nominatimService.reverseGeocode(latitude, longitude);
          setLocation({ ...coordinate, name: address });
        } catch (err) {
          setLocation(coordinate);
        }
        
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
  };
};