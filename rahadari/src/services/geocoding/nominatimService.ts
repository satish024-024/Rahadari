import axios from 'axios';
import { GeocodingResult } from '../../types/api';
import { Coordinate } from '../../types/route';

export class NominatimService {
  private baseUrl = 'https://nominatim.openstreetmap.org';

  async search(query: string, limit: number = 10): Promise<GeocodingResult[]> {
    try {
      const response = await axios.get<GeocodingResult[]>(`${this.baseUrl}/search`, {
        params: {
          q: query,
          format: 'json',
          limit,
          countrycodes: 'in', // Restrict to India
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'Rahadari/1.0 (Weather Route Planner)',
        },
      });

      return response.data.map(result => ({
        display_name: result.display_name,
        lat: result.lat,
        lon: result.lon,
        place_id: result.place_id,
        type: result.type,
        importance: result.importance,
        address: result.address,
      }));
    } catch (error) {
      console.error('Nominatim search error:', error);
      throw new Error('Failed to search locations');
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await axios.get<GeocodingResult>(`${this.baseUrl}/reverse`, {
        params: {
          lat,
          lon: lng,
          format: 'json',
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'Rahadari/1.0 (Weather Route Planner)',
        },
      });

      return response.data.display_name;
    } catch (error) {
      console.error('Nominatim reverse geocode error:', error);
      throw new Error('Failed to reverse geocode location');
    }
  }

  async getCoordinates(address: string): Promise<Coordinate> {
    try {
      const results = await this.search(address, 1);
      
      if (results.length === 0) {
        throw new Error('Location not found');
      }

      const result = results[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: result.display_name,
      };
    } catch (error) {
      console.error('Nominatim get coordinates error:', error);
      throw new Error('Failed to get coordinates for location');
    }
  }

  async getNearbyPlaces(
    center: Coordinate,
    radius: number = 1000,
    category: string = 'amenity'
  ): Promise<GeocodingResult[]> {
    try {
      const response = await axios.get<GeocodingResult[]>(`${this.baseUrl}/search`, {
        params: {
          q: `[${category}]`,
          format: 'json',
          limit: 20,
          countrycodes: 'in',
          addressdetails: 1,
          viewbox: `${center.lng - 0.01},${center.lat - 0.01},${center.lng + 0.01},${center.lat + 0.01}`,
          bounded: 1,
        },
        headers: {
          'User-Agent': 'Rahadari/1.0 (Weather Route Planner)',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Nominatim nearby places error:', error);
      throw new Error('Failed to get nearby places');
    }
  }

  async getCitySuggestions(query: string): Promise<GeocodingResult[]> {
    try {
      const response = await axios.get<GeocodingResult[]>(`${this.baseUrl}/search`, {
        params: {
          q: query,
          format: 'json',
          limit: 10,
          countrycodes: 'in',
          addressdetails: 1,
          featuretype: 'city',
        },
        headers: {
          'User-Agent': 'Rahadari/1.0 (Weather Route Planner)',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Nominatim city suggestions error:', error);
      throw new Error('Failed to get city suggestions');
    }
  }

  async getStateSuggestions(query: string): Promise<GeocodingResult[]> {
    try {
      const response = await axios.get<GeocodingResult[]>(`${this.baseUrl}/search`, {
        params: {
          q: query,
          format: 'json',
          limit: 10,
          countrycodes: 'in',
          addressdetails: 1,
          featuretype: 'state',
        },
        headers: {
          'User-Agent': 'Rahadari/1.0 (Weather Route Planner)',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Nominatim state suggestions error:', error);
      throw new Error('Failed to get state suggestions');
    }
  }

  formatAddress(result: GeocodingResult): string {
    const address = result.address;
    if (!address) return result.display_name;

    const parts = [];
    
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    
    return parts.join(', ');
  }

  isInIndia(result: GeocodingResult): boolean {
    return result.address?.country === 'India' || 
           result.display_name.includes('India');
  }
}