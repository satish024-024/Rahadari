import { Coordinate } from '../types/route';

export const calculateDistance = (point1: Coordinate, point2: Coordinate): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const calculateBearing = (point1: Coordinate, point2: Coordinate): number => {
  const dLng = toRadians(point2.lng - point1.lng);
  const lat1 = toRadians(point1.lat);
  const lat2 = toRadians(point2.lat);
  
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  
  let bearing = Math.atan2(y, x);
  bearing = (bearing * 180 / Math.PI + 360) % 360;
  
  return bearing;
};

export const getMidpoint = (point1: Coordinate, point2: Coordinate): Coordinate => {
  const lat1 = toRadians(point1.lat);
  const lng1 = toRadians(point1.lng);
  const lat2 = toRadians(point2.lat);
  const lng2 = toRadians(point2.lng);
  
  const dLng = lng2 - lng1;
  
  const x = Math.cos(lat2) * Math.cos(dLng);
  const y = Math.cos(lat2) * Math.sin(dLng);
  
  const lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + x) * (Math.cos(lat1) + x) + y * y)
  );
  
  const lng3 = lng1 + Math.atan2(y, Math.cos(lat1) + x);
  
  return {
    lat: lat3 * 180 / Math.PI,
    lng: lng3 * 180 / Math.PI,
  };
};

export const generateWaypoints = (
  start: Coordinate,
  end: Coordinate,
  intervalKm: number = 5
): Coordinate[] => {
  const totalDistance = calculateDistance(start, end);
  const numPoints = Math.ceil(totalDistance / intervalKm);
  const waypoints: Coordinate[] = [start];
  
  for (let i = 1; i < numPoints; i++) {
    const factor = i / numPoints;
    const lat = start.lat + (end.lat - start.lat) * factor;
    const lng = start.lng + (end.lng - start.lng) * factor;
    waypoints.push({ lat, lng });
  }
  
  waypoints.push(end);
  return waypoints;
};

export const isPointInIndia = (point: Coordinate): boolean => {
  const { north, south, east, west } = {
    north: 37.6,
    south: 6.4,
    east: 97.4,
    west: 68.1,
  };
  
  return point.lat >= south && point.lat <= north && point.lng >= west && point.lng <= east;
};

export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km`;
  } else {
    return `${Math.round(distanceKm)}km`;
  }
};

export const formatDuration = (durationMinutes: number): string => {
  if (durationMinutes < 60) {
    return `${Math.round(durationMinutes)}m`;
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = Math.round(durationMinutes % 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
};

export const calculateTravelTime = (
  distance: number,
  travelMode: 'bike' | 'car' | 'bus'
): number => {
  const speeds = {
    bike: 30, // km/h
    car: 60,  // km/h
    bus: 40,  // km/h
  };
  
  return (distance / speeds[travelMode]) * 60; // Return in minutes
};

export const getRouteOptimization = (
  waypoints: Coordinate[],
  weatherData: any[],
  travelMode: 'bike' | 'car' | 'bus'
): {
  bestDepartureTime: Date;
  weatherWindows: Array<{ start: Date; end: Date; condition: string }>;
  recommendations: string[];
} => {
  // Simple optimization logic - in production, this would be more sophisticated
  const now = new Date();
  const bestDepartureTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
  
  const weatherWindows = [
    {
      start: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour from now
      end: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
      condition: 'Clear skies',
    },
  ];
  
  const recommendations = [
    'Weather conditions are favorable for travel',
    'Consider leaving in the next hour for best conditions',
  ];
  
  return {
    bestDepartureTime,
    weatherWindows,
    recommendations,
  };
};