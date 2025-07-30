import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testPlacesAPI() {
  try {
    const response = await axios.get('http://localhost:5000/api/places/search', {
      params: {
        q: 'paris',
        _t: Date.now() // Add timestamp to prevent caching
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error calling API:', error.response?.data || error.message);
  }
}

testPlacesAPI();
