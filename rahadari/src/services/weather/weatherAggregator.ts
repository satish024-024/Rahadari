import { WeatherData, WeatherPoint } from '../../types/weather';
import { OpenWeatherService } from './openWeatherService';
import { OpenMeteoService } from './openMeteoService';
import { WeatherAPIService } from './weatherApiService';
import { interpolateWeather, calculateWeatherConfidence } from '../../utils/weatherUtils';
import { addMinutes } from 'date-fns';

export class WeatherAggregator {
  private services = [
    new OpenWeatherService(),
    new OpenMeteoService(),
    new WeatherAPIService(),
  ];

  async getWeatherForPoint(
    lat: number, 
    lng: number, 
    time?: Date
  ): Promise<WeatherData> {
    const results = await Promise.allSettled(
      this.services.map(service => 
        service.getWeather(lat, lng, time)
      )
    );

    const validResults = results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<WeatherData>).value);

    if (validResults.length === 0) {
      throw new Error('All weather services failed');
    }

    return this.consolidateWeatherData(validResults);
  }

  async getRouteWeather(
    waypoints: Array<{lat: number, lng: number}>,
    departureTime: Date
  ): Promise<WeatherPoint[]> {
    const weatherPromises = waypoints.map((point, index) => {
      const pointTime = this.calculateArrivalTime(
        departureTime, 
        waypoints.slice(0, index + 1)
      );
      return this.getWeatherForPoint(point.lat, point.lng, pointTime);
    });

    const weatherData = await Promise.all(weatherPromises);
    
    return weatherData.map((weather, index) => ({
      lat: waypoints[index].lat,
      lng: waypoints[index].lng,
      weather,
      location: `Point ${index + 1}`,
      time: this.calculateArrivalTime(departureTime, waypoints.slice(0, index + 1)).toISOString(),
      distance: index * 5, // Simplified distance calculation
    }));
  }

  async getDetailedRouteWeather(
    waypoints: Array<{lat: number, lng: number}>,
    departureTime: Date,
    intervalKm: number = 5
  ): Promise<WeatherPoint[]> {
    const detailedWaypoints = this.generateDetailedWaypoints(waypoints, intervalKm);
    return this.getRouteWeather(detailedWaypoints, departureTime);
  }

  private consolidateWeatherData(
    data: WeatherData[]
  ): WeatherData {
    // Intelligent data consolidation
    const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
    const maxRain = Math.max(...data.map(d => d.rainProbability));
    const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
    const avgWindSpeed = data.reduce((sum, d) => sum + d.windSpeed, 0) / data.length;
    const minVisibility = Math.min(...data.map(d => d.visibility));
    const avgPressure = data.reduce((sum, d) => sum + d.pressure, 0) / data.length;
    const avgFeelsLike = data.reduce((sum, d) => sum + d.feelsLike, 0) / data.length;
    
    return {
      temperature: Math.round(avgTemp),
      humidity: Math.round(avgHumidity),
      rainProbability: maxRain, // Use maximum rain probability for safety
      windSpeed: Math.round(avgWindSpeed),
      visibility: minVisibility, // Use minimum visibility for safety
      condition: this.determineWorstCondition(data.map(d => d.condition)),
      icon: this.selectMostRelevantIcon(data),
      timestamp: Date.now(),
      source: 'aggregated',
      confidence: this.calculateConfidence(data),
      description: this.getConsolidatedDescription(data),
      pressure: Math.round(avgPressure),
      feelsLike: Math.round(avgFeelsLike),
    };
  }

  private calculateConfidence(data: WeatherData[]): 'high' | 'medium' | 'low' {
    if (data.length >= 3) return 'high';
    if (data.length === 2) return 'medium';
    return 'low';
  }

  private determineWorstCondition(conditions: string[]): string {
    const severity = {
      'storm': 5,
      'rain': 4,
      'heavy-rain': 4,
      'fog': 3,
      'cloudy': 2,
      'partly-cloudy': 1,
      'clear': 0,
    };

    return conditions.reduce((worst, current) => {
      const currentSeverity = severity[current as keyof typeof severity] || 0;
      const worstSeverity = severity[worst as keyof typeof severity] || 0;
      return currentSeverity > worstSeverity ? current : worst;
    });
  }

  private selectMostRelevantIcon(data: WeatherData[]): string {
    // Select icon from the most severe weather condition
    const worstCondition = this.determineWorstCondition(data.map(d => d.condition));
    const worstData = data.find(d => d.condition === worstCondition);
    return worstData?.icon || data[0].icon;
  }

  private getConsolidatedDescription(data: WeatherData[]): string {
    const worstCondition = this.determineWorstCondition(data.map(d => d.condition));
    const worstData = data.find(d => d.condition === worstCondition);
    return worstData?.description || data[0].description;
  }

  private calculateArrivalTime(
    departureTime: Date,
    waypoints: Array<{lat: number, lng: number}>
  ): Date {
    // Simplified calculation - in production, this would use actual routing data
    const minutesPerPoint = 5; // Assume 5 minutes per waypoint
    return addMinutes(departureTime, waypoints.length * minutesPerPoint);
  }

  private generateDetailedWaypoints(
    waypoints: Array<{lat: number, lng: number}>,
    intervalKm: number
  ): Array<{lat: number, lng: number}> {
    const detailedWaypoints: Array<{lat: number, lng: number}> = [];
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i];
      const end = waypoints[i + 1];
      
      detailedWaypoints.push(start);
      
      // Generate intermediate points
      const distance = this.calculateDistance(start, end);
      const numPoints = Math.floor(distance / intervalKm);
      
      for (let j = 1; j < numPoints; j++) {
        const factor = j / numPoints;
        const lat = start.lat + (end.lat - start.lat) * factor;
        const lng = start.lng + (end.lng - start.lng) * factor;
        detailedWaypoints.push({ lat, lng });
      }
    }
    
    detailedWaypoints.push(waypoints[waypoints.length - 1]);
    return detailedWaypoints;
  }

  private calculateDistance(point1: {lat: number, lng: number}, point2: {lat: number, lng: number}): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}