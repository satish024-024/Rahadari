import { format, addMinutes, addHours, isAfter, isBefore, differenceInMinutes } from 'date-fns';

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

export const getTimeOfDay = (date: Date): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = date.getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const isDaylight = (date: Date, sunrise: Date, sunset: Date): boolean => {
  return isAfter(date, sunrise) && isBefore(date, sunset);
};

export const calculateArrivalTime = (
  departureTime: Date,
  waypoints: Array<{ lat: number; lng: number }>,
  travelMode: 'bike' | 'car' | 'bus'
): Date[] => {
  const speeds = {
    bike: 30, // km/h
    car: 60,  // km/h
    bus: 40,  // km/h
  };
  
  const arrivalTimes: Date[] = [];
  let currentTime = new Date(departureTime);
  
  for (let i = 1; i < waypoints.length; i++) {
    const distance = calculateDistance(
      waypoints[i - 1],
      waypoints[i]
    );
    
    const travelTimeMinutes = (distance / speeds[travelMode]) * 60;
    currentTime = addMinutes(currentTime, travelTimeMinutes);
    arrivalTimes.push(new Date(currentTime));
  }
  
  return arrivalTimes;
};

export const getWeatherTimeWindow = (
  startTime: Date,
  endTime: Date,
  intervalMinutes: number = 30
): Date[] => {
  const timeWindows: Date[] = [];
  let currentTime = new Date(startTime);
  
  while (isBefore(currentTime, endTime)) {
    timeWindows.push(new Date(currentTime));
    currentTime = addMinutes(currentTime, intervalMinutes);
  }
  
  return timeWindows;
};

export const isRushHour = (date: Date): boolean => {
  const hour = date.getHours();
  const dayOfWeek = date.getDay();
  
  // Weekday rush hours: 7-9 AM and 5-7 PM
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  }
  
  return false;
};

export const getOptimalDepartureTime = (
  preferredTime: Date,
  weatherWindows: Array<{ start: Date; end: Date; condition: string }>
): Date => {
  // Find the best weather window that includes or is close to preferred time
  for (const window of weatherWindows) {
    if (isAfter(preferredTime, window.start) && isBefore(preferredTime, window.end)) {
      return preferredTime;
    }
  }
  
  // If no window contains preferred time, find the closest one
  let bestWindow = weatherWindows[0];
  let minDifference = Math.abs(differenceInMinutes(preferredTime, bestWindow.start));
  
  for (const window of weatherWindows) {
    const diff = Math.abs(differenceInMinutes(preferredTime, window.start));
    if (diff < minDifference) {
      minDifference = diff;
      bestWindow = window;
    }
  }
  
  return bestWindow.start;
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMinutes = differenceInMinutes(date, now);
  
  if (diffMinutes < 1) return 'now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
};

export const getSeason = (date: Date): 'spring' | 'summer' | 'monsoon' | 'winter' => {
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'monsoon';
  if (month >= 9 && month <= 11) return 'summer';
  return 'winter';
};

export const isMonsoonSeason = (date: Date): boolean => {
  const month = date.getMonth() + 1;
  return month >= 6 && month <= 9;
};

// Helper function for distance calculation (imported from distanceUtils)
const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
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

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};