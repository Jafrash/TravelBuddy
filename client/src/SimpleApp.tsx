import { useState, useEffect } from 'react';

function SimpleApp() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiMessage, setApiMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    // Test the API connection
    fetch('/api/health')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setApiStatus('success');
        setApiMessage(JSON.stringify(data, null, 2));
      })
      .catch(error => {
        setApiStatus('error');
        setApiMessage(`Error connecting to API: ${error.message}`);
        console.error('API Error:', error);
      });

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600">TravelBuddy - Connectivity Test</h1>
          <p className="text-gray-600">Simplified diagnostic page</p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Client Status</h2>
          <p className="mb-1"><span className="font-medium">Browser time:</span> {currentTime}</p>
          <p><span className="font-medium">React rendering:</span> <span className="text-green-600 font-medium">✓ Working</span></p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2">API Connection Test</h2>
          <div className="mb-2">
            <span className="font-medium">Status:</span>{' '}
            {apiStatus === 'loading' && <span className="text-yellow-500">Loading...</span>}
            {apiStatus === 'success' && <span className="text-green-600 font-medium">✓ Connected</span>}
            {apiStatus === 'error' && <span className="text-red-600 font-medium">✗ Connection Failed</span>}
          </div>
          {apiMessage && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Response:</h3>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm">
                {apiMessage}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Available Test Routes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a 
              href="/connectivity-test" 
              className="bg-blue-600 text-white p-3 rounded text-center hover:bg-blue-700 transition-colors"
            >
              Server Test Page
            </a>
            <a 
              href="/api/health" 
              className="bg-gray-200 text-gray-800 p-3 rounded text-center hover:bg-gray-300 transition-colors"
            >
              API Health Check
            </a>
            <a 
              href="/api/agents" 
              className="bg-gray-200 text-gray-800 p-3 rounded text-center hover:bg-gray-300 transition-colors"
            >
              List Agents API
            </a>
            <a 
              href="/" 
              className="bg-gray-200 text-gray-800 p-3 rounded text-center hover:bg-gray-300 transition-colors"
            >
              Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;