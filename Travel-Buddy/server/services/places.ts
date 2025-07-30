import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the root directory path (two levels up from this file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

// Load environment variables from the root .env file
dotenv.config({ path: path.join(rootDir, '.env') });

// Debug log to verify environment variables
console.log('Environment variables loaded from:', path.join(rootDir, '.env'));
console.log('FOURSQUARE_API_KEY present:', !!process.env.FOURSQUARE_API_KEY);


const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

// Fallback city coordinates for common cities
const CITY_COORDINATES: Record<string, { lat: number; lon: number; display_name: string }> = {
  'new york': { lat: 40.7128, lon: -74.006, display_name: 'New York, NY, USA' },
  'london': { lat: 51.5074, lon: -0.1278, display_name: 'London, UK' },
  'paris': { lat: 48.8566, lon: 2.3522, display_name: 'Paris, France' },
  'tokyo': { lat: 35.6762, lon: 139.6503, display_name: 'Tokyo, Japan' },
  'sydney': { lat: -33.8688, lon: 151.2093, display_name: 'Sydney, Australia' },
  'mumbai': { lat: 19.0760, lon: 72.8777, display_name: 'Mumbai, India' },
  'dubai': { lat: 25.2048, lon: 55.2708, display_name: 'Dubai, UAE' },
  'singapore': { lat: 1.3521, lon: 103.8198, display_name: 'Singapore' },
  'toronto': { lat: 43.6532, lon: -79.3832, display_name: 'Toronto, Canada' },
  'berlin': { lat: 52.5200, lon: 13.4050, display_name: 'Berlin, Germany' },
};

export interface Place {
  xid: string;
  name: string;
  rate: number;
  kinds: string;
  point: {
    lon: number;
    lat: number;
  };
  preview?: {
    source?: string;
  };
  categories: string[];
  description?: string;
  distance?: number;
}

export interface PlaceDetails {
  name: string;
  description: string;
  categories: string[];
  rating?: number;
  image?: string;
  wikipedia?: string;
}

export interface CityInfo {
  name: string;
  description: string;
  bestTimeToVisit: string;
  places: PlaceDetails[];
}

export class PlacesService {
  private static instance: PlacesService;

  private constructor() {}

  public static getInstance(): PlacesService {
    if (!PlacesService.instance) {
      PlacesService.instance = new PlacesService();
    }
    return PlacesService.instance;
  }

  async getCityPlaces(cityName: string): Promise<CityInfo | null> {
    try {
      console.log(`🔍 Getting places for city: ${cityName}`);
      
      // First, get the city coordinates
      const city = await this.searchCity(cityName);
      if (!city) {
        console.error('❌ Could not find coordinates for city:', cityName);
        return null;
      }
      
      console.log(`📍 Found city: ${city.display_name} (${city.lat}, ${city.lon})`);
      
      // Then search for popular places in the city
      const places = await this.searchPlaces('attraction', city.lat, city.lon);
      
      if (!places || places.length === 0) {
        console.log('⚠️ No places found, using fallback data');
        return null;
      }
      
      // Create a CityInfo object with the found places
      const cityInfo: CityInfo = {
        name: city.display_name.split(',')[0],
        description: `Explore the beautiful city of ${city.display_name.split(',')[0]}, known for its rich culture, history, and attractions.`,
        bestTimeToVisit: 'The best time to visit is during spring (March to May) and fall (September to November) when the weather is pleasant.',
        places: places.map(place => ({
          name: place.name,
          description: place.description || `A popular place in ${city.display_name.split(',')[0]}`,
          categories: place.categories,
          rating: place.rate,
          image: place.preview?.source,
          wikipedia: '' // We can add Wikipedia links later if needed
        }))
      };
      
      console.log(`✅ Found ${places.length} places for ${city.display_name}`);
      return cityInfo;
      
    } catch (error) {
      console.error('❌ Error in getCityPlaces:', error);
      return null;
    }
  }

  private async searchCity(cityName: string): Promise<{ lat: number; lon: number; display_name: string } | null> {
    console.log(`🔍 Geocoding city: ${cityName}`);
    
    // Check if we have predefined coordinates for this city
    const lowerCityName = cityName.toLowerCase();
    if (CITY_COORDINATES[lowerCityName]) {
      console.log(`📍 Using predefined coordinates for: ${cityName}`);
      return CITY_COORDINATES[lowerCityName];
    }

    if (!GEOAPIFY_API_KEY) {
      console.error('❌ Geoapify API key is not configured');
      return CITY_COORDINATES['new york'];
    }

    try {
      const response = await axios.get('https://api.geoapify.com/v1/geocode/search', {
        params: {
          text: cityName,
          apiKey: GEOAPIFY_API_KEY,
          limit: 1
        }
      });

      if (response.data?.features?.length > 0) {
        const feature = response.data.features[0];
        const coordinates = {
          lat: feature.properties.lat,
          lon: feature.properties.lon,
          display_name: feature.properties.formatted
        };
        console.log('📍 City coordinates:', JSON.stringify(coordinates, null, 2));
        return coordinates;
      }
      
      console.log('❌ No coordinates found for city:', cityName);
      return CITY_COORDINATES['new york'];
    } catch (error) {
      console.error('❌ Error geocoding city with Geoapify:', error);
      console.log('⚠️ Using fallback coordinates for New York');
      return CITY_COORDINATES['new york'];
    }
  }

  /**
   * Calculate distance between two points in meters using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  private async searchPlaces(query: string, lat: number, lon: number): Promise<Place[]> {
    console.log('🌐 Making request to Geoapify Places API');
    console.log('🔑 Geoapify API Key:', GEOAPIFY_API_KEY ? 'Present' : 'Missing');
    console.log('Search Parameters:', { query, lat, lon });
    
    if (!GEOAPIFY_API_KEY) {
      console.error('❌ Geoapify API key is not configured');
      console.error('Make sure GEOAPIFY_API_KEY is set in your .env file');
      console.error('Current .env file location:', path.join(rootDir, '.env'));
      console.error('Environment variables:', {
        GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY ? 'Set' : 'Not Set',
        NODE_ENV: process.env.NODE_ENV
      });
      throw new Error('Geoapify API key is not configured');
    }

    try {
      console.log('🔍 Searching for places...');
      
      const placesUrl = 'https://api.geoapify.com/v2/places';
      const categories = 'tourism,entertainment,catering,commercial';
      const radius = 5000; // 5km radius
      
      console.log('📡 Sending request to Geoapify Places API');
      console.log('Request URL:', placesUrl);
      console.log('Request params:', {
        categories,
        filter: `circle:${lon},${lat},${radius}`,
        bias: `proximity:${lon},${lat}`,
        limit: 10,
        apiKey: '***' // Don't log the actual API key
      });
      
      const response = await axios.get(placesUrl, {
        params: {
          categories: categories,
          filter: `circle:${lon},${lat},${radius}`,
          bias: `proximity:${lon},${lat}`,
          limit: 10,
          apiKey: GEOAPIFY_API_KEY
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('✅ Search successful');
      console.log('Response status:', response.status);
      
      // Process the response and return the places
      const places = response.data.features || [];
      console.log(`✅ Found ${places.length} places`);
      
      if (places.length === 0) {
        console.log('No places found, using fallback data');
        return [];
      }

      // Map the places to our Place interface
      return places.map((place: any) => {
        const properties = place.properties;
        console.log('Processing place:', properties.name);
        
        // Calculate distance in meters from the center point
        const distance = this.calculateDistance(
          lat, 
          lon, 
          properties.lat, 
          properties.lon
        );
        
        return {
          xid: properties.place_id || `place-${Math.random().toString(36).substr(2, 9)}`,
          name: properties.name || 'Unnamed Location',
          rate: properties.rate || 0,
          kinds: properties.categories ? properties.categories.join(',') : '',
          point: {
            lon: properties.lon,
            lat: properties.lat
          },
          preview: properties.preview ? {
            source: properties.preview.source
          } : undefined,
          categories: properties.categories || [],
          description: properties.address_line2 || properties.address_line1 || '',
          distance: Math.round(distance)
        };
      });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Error searching for places with Geoapify:', error.message);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        }
      } else if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('An unexpected error occurred');
      }
      
      console.error('Using fallback data due to error');
      return [];
    }
  }

  private getFallbackPlaces(): Place[] {
    console.log('⚠️ Using fallback places data');
    
    // Fallback data in case the API fails
    return [
      {
        xid: 'fallback-1',
        name: 'Statue of Liberty',
        rate: 4.7,
        kinds: 'historical_places,monuments,landmarks',
        point: {
          lon: -74.0445,
          lat: 40.6892
        },
        preview: {
          source: 'https://via.placeholder.com/400x300?text=Statue+of+Liberty'
        },
        categories: ['Landmark', 'Monument'],
        description: 'Iconic symbol of freedom and democracy',
        distance: 0
      },
      // More fallback places...
    ];
  }

  async search(query: string, cityName: string): Promise<Place[]> {
    try {
      console.log(`🔍 Starting search for "${query}" in ${cityName}`);
      
      // First, get the city coordinates
      const city = await this.searchCity(cityName);
      if (!city) {
        console.error('❌ Could not find coordinates for city:', cityName);
        return this.getFallbackPlaces();
      }
      
      console.log(`📍 Found city: ${city.display_name} (${city.lat}, ${city.lon})`);
      
      // Then search for places
      const places = await this.searchPlaces(query, city.lat, city.lon);
      
      if (!places || places.length === 0) {
        console.log('⚠️ No places found, using fallback data');
        return this.getFallbackPlaces();
      }
      
      console.log(`✅ Found ${places.length} places`);
      return places;
      
    } catch (error) {
      console.error('❌ Error in search:', error);
      return this.getFallbackPlaces();
    }
  }
}

export const placesService = PlacesService.getInstance();
