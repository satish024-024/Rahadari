import { WeatherData, WeatherPoint } from './weather';

export interface Coordinate {
  lat: number;
  lng: number;
  name?: string;
}

export interface RoutePoint extends Coordinate {
  time: string;
  distance: number;
  weather?: WeatherData;
}

export interface Route {
  id: string;
  source: Coordinate;
  destination: Coordinate;
  waypoints: RoutePoint[];
  totalDistance: number;
  totalDuration: number;
  travelMode: 'bike' | 'car' | 'bus';
  departureTime: Date;
  arrivalTime: Date;
  weatherPoints: WeatherPoint[];
  alternativeRoutes?: Route[];
  roadConditions: RoadCondition[];
}

export interface RoadCondition {
  segment: {
    start: Coordinate;
    end: Coordinate;
  };
  condition: 'dry' | 'wet' | 'flooded' | 'icy' | 'construction';
  severity: 'low' | 'medium' | 'high';
  description: string;
  lastUpdated: Date;
}

export interface RouteSearchParams {
  source: string;
  destination: string;
  departureTime: Date;
  travelMode: 'bike' | 'car' | 'bus';
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  optimizeFor?: 'time' | 'distance' | 'weather';
}

export interface RouteOptimization {
  bestDepartureTime: Date;
  weatherWindows: {
    start: Date;
    end: Date;
    condition: string;
    confidence: number;
  }[];
  recommendations: string[];
  warnings: string[];
}