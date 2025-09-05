export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
}

export interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
  type: string;
  importance: number;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export interface OpenWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    visibility: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  rain?: {
    '1h': number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  name: string;
}

export interface OpenRouteResponse {
  features: Array<{
    type: string;
    properties: {
      summary: {
        distance: number;
        duration: number;
      };
      segments: Array<{
        distance: number;
        duration: number;
        steps: Array<{
          distance: number;
          duration: number;
          instruction: string;
          name: string;
          way_points: number[];
        }>;
      }>;
    };
    geometry: {
      type: string;
      coordinates: number[][];
    };
  }>;
  metadata: {
    attribution: string;
    service: string;
    timestamp: number;
    query: {
      coordinates: number[][];
      profile: string;
      format: string;
    };
  };
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}