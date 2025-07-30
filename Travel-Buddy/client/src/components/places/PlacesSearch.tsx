import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import { PlaceCard } from './PlaceCardComponent';

export interface Place {
  xid: string;
  name: string;
  rate: number;
  kinds: string;
  point?: {
    lon: number;
    lat: number;
  };
  preview?: {
    source?: string;
  };
  categories?: string[];
  description?: string;
}

export interface CityInfo {
  name: string;
  description: string;
  bestTimeToVisit: string;
  places: Place[];
}

interface ApiResponse {
  name: string;
  description: string;
  bestTimeToVisit: string;
  places: Place[];
}

export function PlacesSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');

  const { data: placesData, isLoading, error } = useQuery({
    queryKey: ['places', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return { places: [] };
      
      try {
        console.log('Fetching places for:', searchQuery);
        const response = await fetch(`/api/places/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch places');
        }
        
        // Handle both response formats for backward compatibility
        if (data.success && data.data) {
          return data.data;
        } else if (data.places || data.name) {
          return data;
        }
        
        throw new Error('Unexpected response format from server');
      } catch (err) {
        console.error('Error in fetchPlaces:', err);
        
        // Return fallback data in case of error
        const cityName = searchQuery.split(',')[0] || 'the city';
        return {
          name: cityName,
          description: `Explore the beautiful city of ${cityName}`,
          bestTimeToVisit: 'The best time to visit is during spring (March to May) and fall (September to November).',
          places: [
            {
              xid: 'fallback1',
              name: `${cityName} City Center`,
              description: 'The heart of the city with shops and restaurants',
              categories: ['attraction'],
              rate: 4.5,
              kinds: 'attractions,interesting_places',
              preview: {
                source: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              }
            },
            {
              xid: 'fallback2',
              name: `${cityName} Museum`,
              description: 'Discover the history and culture of the region',
              categories: ['museum', 'culture'],
              rate: 4.2,
              kinds: 'cultural,museums',
              preview: {
                source: 'https://images.unsplash.com/photo-1534008757030-27299c481108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              }
            },
            {
              xid: 'fallback3',
              name: `${cityName} Park`,
              description: 'A beautiful park to relax and enjoy nature',
              categories: ['park', 'nature'],
              rate: 4.7,
              kinds: 'natural,parks',
              preview: {
                source: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              }
            }
          ]
        };
      }
    },
    enabled: !!searchQuery.trim(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
  
  // Extract places from the response data
  const places = placesData?.places || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCity(searchQuery.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error.message}
        </div>
      )}

      {placesData && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              {placesData.name || searchQuery.split(',')[0]}
            </h1>
            {placesData.description && (
              <p className="text-gray-600 mb-4">{placesData.description}</p>
            )}
            {placesData.bestTimeToVisit && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Best time to visit:</span>{' '}
                {placesData.bestTimeToVisit}
              </p>
            )}
          </div>

          {placesData.places && placesData.places.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placesData.places.map((place: any) => (
                <PlaceCard 
                  key={place.xid || place.name || Math.random().toString(36).substring(7)}
                  place={{
                    xid: place.xid || Math.random().toString(36).substring(7),
                    name: place.name,
                    description: place.description || `A beautiful place in ${placesData.name || searchQuery.split(',')[0]}`,
                    categories: place.categories || [],
                    rate: place.rate || place.rating || 0,
                    preview: place.preview || (place.image ? { source: place.image } : undefined),
                    kinds: place.kinds || (place.categories ? place.categories.join(',') : 'attraction')
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No places found. Try a different search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
