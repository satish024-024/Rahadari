import { CacheEntry } from '../../types/api';

export class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 100;
  private defaultTTL = 30 * 60 * 1000; // 30 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt,
      key,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Remove expired entries
    entries.forEach(([key, entry]) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    });

    // If still over limit, remove oldest entries
    if (this.cache.size >= this.maxSize) {
      const sortedEntries = entries
        .filter(([key]) => this.cache.has(key))
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      const toRemove = sortedEntries.slice(0, this.cache.size - this.maxSize + 1);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: Array<{ key: string; age: number; expiresIn: number }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      expiresIn: entry.expiresAt - now,
    }));

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // Would need to track hits/misses for this
      entries,
    };
  }

  // Weather-specific cache methods
  getWeatherKey(lat: number, lng: number, time?: Date): string {
    const timeKey = time ? time.getTime() : 'current';
    return `weather_${lat.toFixed(4)}_${lng.toFixed(4)}_${timeKey}`;
  }

  getRouteKey(source: string, destination: string, travelMode: string): string {
    return `route_${source}_${destination}_${travelMode}`;
  }

  getGeocodeKey(query: string): string {
    return `geocode_${query.toLowerCase().replace(/\s+/g, '_')}`;
  }

  // Cache weather data
  setWeather(lat: number, lng: number, weather: any, ttl?: number): void {
    const key = this.getWeatherKey(lat, lng);
    this.set(key, weather, ttl);
  }

  getWeather(lat: number, lng: number, time?: Date): any | null {
    const key = this.getWeatherKey(lat, lng, time);
    return this.get(key);
  }

  // Cache route data
  setRoute(source: string, destination: string, travelMode: string, route: any, ttl?: number): void {
    const key = this.getRouteKey(source, destination, travelMode);
    this.set(key, route, ttl);
  }

  getRoute(source: string, destination: string, travelMode: string): any | null {
    const key = this.getRouteKey(source, destination, travelMode);
    return this.get(key);
  }

  // Cache geocoding data
  setGeocode(query: string, results: any[], ttl?: number): void {
    const key = this.getGeocodeKey(query);
    this.set(key, results, ttl);
  }

  getGeocode(query: string): any[] | null {
    const key = this.getGeocodeKey(query);
    return this.get(key);
  }
}

// Export a singleton instance
export const cacheManager = new CacheManager();