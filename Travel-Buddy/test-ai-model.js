// Test script to verify if the AI model works
import { pipeline } from '@xenova/transformers';

// Use the smallest possible model for testing
const TEST_MODEL = 'Xenova/tiny-random-T5ForConditionalGeneration';

// Show download progress
let lastProgress = 0;
const progressCallback = (progress) => {
  const percent = Math.round(progress.loaded / progress.total * 100);
  if (percent > lastProgress + 5) { // Only log every 5% to avoid spam
    console.log(`Downloading model... ${percent}%`);
    lastProgress = percent;
  }
};

async function testAIModel() {
  console.log('🚀 Testing AI model...');
  console.log('This may take a few minutes for the first run as it downloads the model (~100MB)');
  
  try {
    console.log('\n🔍 Testing with a tiny model first...');
    const pipe = await pipeline('text2text-generation', TEST_MODEL, {
      quantized: true,
      progress_callback: progressCallback
    });

    console.log('✅ Model loaded successfully!');
    
    // Test a simple generation
    console.log('\n🤖 Testing model with a simple prompt...');
    const output = await pipe('Translate to French: Hello, how are you?', {
      max_new_tokens: 50,
    });
    
    console.log('\n🎉 Test successful! Model output:');
    console.log(output[0].generated_text);
    
  } catch (error) {
    console.error('❌ Error testing AI model:');
    console.error(error);
    
    if (error.message.includes('Could not locate the bindings file')) {
      console.error('\n⚠️  You might need to install Python and build tools.');
      console.error('   On Windows, run this command as administrator and try again:');
      console.error('   npm install --global --production windows-build-tools');
    }
  }
}

testAIModel();
