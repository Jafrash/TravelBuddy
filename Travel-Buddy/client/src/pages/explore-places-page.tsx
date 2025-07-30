import { PlacesSearch } from '@/components/places/PlacesSearch';

export default function ExplorePlacesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Discover Amazing Places</h1>
            <p className="text-lg text-gray-600">
              Search for a city to find top attractions, landmarks, and hidden gems
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <PlacesSearch />
          </div>
        </div>
      </div>
    </div>
  );
}
