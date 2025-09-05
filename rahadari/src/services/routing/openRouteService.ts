import axios from 'axios';
import { Coordinate, Route, RoutePoint } from '../../types/route';
import { OpenRouteResponse } from '../../types/api';
import { calculateDistance, formatDistance, formatDuration } from '../../utils/distanceUtils';
import { addMinutes } from 'date-fns';

export class OpenRouteService {
  private apiKey = import.meta.env.VITE_OPENROUTE_API_KEY;
  private baseUrl = 'https://api.openrouteservice.org/v2';

  async getRoute(
    source: Coordinate,
    destination: Coordinate,
    travelMode: 'bike' | 'car' | 'bus' = 'car'
  ): Promise<Route> {
    try {
      const profile = this.getProfile(travelMode);
      
      const response = await axios.get<OpenRouteResponse>(`${this.baseUrl}/directions/${profile}`, {
        params: {
          api_key: this.apiKey,
          start: `${source.lng},${source.lat}`,
          end: `${destination.lng},${destination.lat}`,
          format: 'json',
          instructions: true,
          geometry: true,
        },
      });

      const feature = response.data.features[0];
      if (!feature) {
        throw new Error('No route found');
      }

      const properties = feature.properties;
      const geometry = feature.geometry;
      
      // Convert coordinates to waypoints
      const waypoints = this.convertCoordinatesToWaypoints(
        geometry.coordinates,
        source,
        destination,
        travelMode
      );

      return {
        id: `route_${Date.now()}`,
        source,
        destination,
        waypoints,
        totalDistance: Math.round(properties.summary.distance / 1000), // Convert m to km
        totalDuration: Math.round(properties.summary.duration / 60), // Convert s to min
        travelMode,
        departureTime: new Date(),
        arrivalTime: addMinutes(new Date(), Math.round(properties.summary.duration / 60)),
        weatherPoints: [],
        roadConditions: [],
      };
    } catch (error) {
      console.error('OpenRoute API error:', error);
      throw new Error('Failed to fetch route from OpenRoute');
    }
  }

  async getAlternativeRoutes(
    source: Coordinate,
    destination: Coordinate,
    travelMode: 'bike' | 'car' | 'bus' = 'car'
  ): Promise<Route[]> {
    try {
      const profile = this.getProfile(travelMode);
      
      const response = await axios.get<OpenRouteResponse>(`${this.baseUrl}/directions/${profile}`, {
        params: {
          api_key: this.apiKey,
          start: `${source.lng},${source.lat}`,
          end: `${destination.lng},${destination.lat}`,
          format: 'json',
          instructions: true,
          geometry: true,
          alternatives: 3, // Get up to 3 alternative routes
        },
      });

      return response.data.features.map((feature, index) => {
        const properties = feature.properties;
        const geometry = feature.geometry;
        
        const waypoints = this.convertCoordinatesToWaypoints(
          geometry.coordinates,
          source,
          destination,
          travelMode
        );

        return {
          id: `route_${Date.now()}_${index}`,
          source,
          destination,
          waypoints,
          totalDistance: Math.round(properties.summary.distance / 1000),
          totalDuration: Math.round(properties.summary.duration / 60),
          travelMode,
          departureTime: new Date(),
          arrivalTime: addMinutes(new Date(), Math.round(properties.summary.duration / 60)),
          weatherPoints: [],
          roadConditions: [],
        };
      });
    } catch (error) {
      console.error('OpenRoute alternatives error:', error);
      throw new Error('Failed to fetch alternative routes from OpenRoute');
    }
  }

  private getProfile(travelMode: 'bike' | 'car' | 'bus'): string {
    switch (travelMode) {
      case 'bike':
        return 'cycling-regular';
      case 'car':
        return 'driving-car';
      case 'bus':
        return 'driving-hgv'; // Use HGV profile for buses
      default:
        return 'driving-car';
    }
  }

  private convertCoordinatesToWaypoints(
    coordinates: number[][],
    source: Coordinate,
    destination: Coordinate,
    travelMode: 'bike' | 'car' | 'bus'
  ): RoutePoint[] {
    const waypoints: RoutePoint[] = [];
    let cumulativeDistance = 0;
    let cumulativeTime = 0;
    
    // Add source point
    waypoints.push({
      lat: source.lat,
      lng: source.lng,
      name: source.name || 'Start',
      time: new Date().toISOString(),
      distance: 0,
    });

    // Process route coordinates (simplified - in production, use actual step data)
    for (let i = 1; i < coordinates.length - 1; i++) {
      const [lng, lat] = coordinates[i];
      const prevPoint = waypoints[waypoints.length - 1];
      
      const distance = calculateDistance(prevPoint, { lat, lng });
      cumulativeDistance += distance;
      
      // Estimate time based on travel mode
      const timeMinutes = this.estimateTravelTime(distance, travelMode);
      cumulativeTime += timeMinutes;
      
      waypoints.push({
        lat,
        lng,
        time: addMinutes(new Date(), cumulativeTime).toISOString(),
        distance: Math.round(cumulativeDistance * 100) / 100,
      });
    }

    // Add destination point
    const lastPoint = waypoints[waypoints.length - 1];
    const finalDistance = calculateDistance(lastPoint, destination);
    const finalTime = this.estimateTravelTime(finalDistance, travelMode);
    
    waypoints.push({
      lat: destination.lat,
      lng: destination.lng,
      name: destination.name || 'End',
      time: addMinutes(new Date(), cumulativeTime + finalTime).toISOString(),
      distance: Math.round((cumulativeDistance + finalDistance) * 100) / 100,
    });

    return waypoints;
  }

  private estimateTravelTime(distanceKm: number, travelMode: 'bike' | 'car' | 'bus'): number {
    const speeds = {
      bike: 25, // km/h
      car: 50,  // km/h (accounting for traffic)
      bus: 35,  // km/h
    };
    
    return (distanceKm / speeds[travelMode]) * 60; // Return in minutes
  }
}