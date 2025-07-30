import AIService from './server/services/AIService';

async function testAIService() {
  console.log('Testing AI Service...');
  
  const testRequest = {
    userId: 1,
    destination: 'Paris',
    duration: 5,
    interests: ['museums', 'food', 'sightseeing'],
    budget: 'medium' as const
  };

  try {
    console.log('Generating itinerary...');
    const result = await AIService.generateItinerary(testRequest);
    console.log('\nGenerated Itinerary:');
    console.log('========================================');
    console.log(result);
    console.log('========================================');
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAIService();
