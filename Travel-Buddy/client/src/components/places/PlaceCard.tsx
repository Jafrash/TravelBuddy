import { MapPin, Star } from 'lucide-react';
import { Place } from './PlacesSearch';

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  // Get the first category as the main category
  const mainCategory = place.categories?.[0]?.replace(/_/g, ' ') || 'Landmark';
  
  // Format the rating to 1 decimal place
  const rating = place.rate ? place.rate.toFixed(1) : 'N/A';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {place.preview?.source ? (
        <img 
          src={place.preview.source} 
          alt={place.name} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback to a placeholder image if the image fails to load
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          <MapPin className="w-12 h-12" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {place.name}
          </h3>
          {rating !== 'N/A' && (
            <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
              <Star className="w-4 h-4 fill-current mr-1" />
              {rating}
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-3 capitalize">
          {mainCategory}
        </p>
        
        {place.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {place.description}
          </p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            <span>View on map</span>
          </div>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => {
              // TODO: Implement save to itinerary
              console.log('Save to itinerary:', place.name);
            }}
          >
            Save to Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
