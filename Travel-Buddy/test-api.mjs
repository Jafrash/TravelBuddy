import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const API_KEY = process.env.GEOAPIFY_API_KEY;
const city = 'New York';

console.log('Testing Geoapify API with key:', API_KEY ? 'Present' : 'Missing');

if (!API_KEY) {
  console.error('❌ Error: GEOAPIFY_API_KEY is not set in .env file');
  process.exit(1);
}

// First, geocode the city to get coordinates
async function testGeocoding() {
  try {
    console.log('\n🔍 Testing Geocoding API...');
    const response = await axios.get('https://api.geoapify.com/v1/geocode/search', {
      params: {
        text: city,
        apiKey: API_KEY,
        limit: 1
      }
    });
    
    console.log('✅ Geocoding API Response:');
    console.log('Status:', response.status);
    
    if (response.data && response.data.features && response.data.features.length > 0) {
      const feature = response.data.features[0];
      console.log('City:', feature.properties.formatted);
      console.log('Coordinates:', feature.properties.lat, feature.properties.lon);
      return feature.properties;
    } else {
      console.log('❌ No results found');
      return null;
    }
  } catch (error) {
    console.error('❌ Geocoding API Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    return null;
  }
}

// Test Places API
async function testPlacesApi(lat, lon) {
  try {
    console.log('\n🔍 Testing Places API...');
    const response = await axios.get('https://api.geoapify.com/v2/places', {
      params: {
        categories: 'catering',
        filter: `circle:${lon},${lat},1000`,
        limit: 5,
        apiKey: API_KEY
      },
      timeout: 10000
    });
    
    console.log('✅ Places API Response:');
    console.log('Status:', response.status);
    console.log('Found', response.data.features.length, 'places');
    
    if (response.data.features.length > 0) {
      console.log('\nFirst place found:');
      console.log('Name:', response.data.features[0].properties.name);
      console.log('Categories:', response.data.features[0].properties.categories);
    }
    
    return response.data.features;
  } catch (error) {
    console.error('❌ Places API Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return [];
  }
}

// Run the tests
async function runTests() {
  console.log('🚀 Starting Geoapify API Tests...');
  
  // Test geocoding first
  const location = await testGeocoding();
  
  // If geocoding was successful, test places API
  if (location) {
    await testPlacesApi(location.lat, location.lon);
  }
  
  console.log('\n✅ Tests completed');
}

runTests().catch(console.error);
