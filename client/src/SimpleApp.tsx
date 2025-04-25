import React from 'react';

function SimpleApp() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          marginBottom: '16px',
          color: '#333'
        }}>
          TravelBuddy App
        </h1>
        <p style={{ 
          fontSize: '16px', 
          marginBottom: '24px',
          color: '#666'
        }}>
          This is a minimal test page to ensure our application connection is working properly.
        </p>
        <p style={{ 
          fontSize: '14px', 
          color: '#888',
          backgroundColor: '#f8f8f8',
          padding: '8px',
          borderRadius: '4px'
        }}>
          Current time: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export default SimpleApp;