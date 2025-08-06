import React, { useEffect, useState } from 'react';

const ApiTest: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [backendStatus, setBackendStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const apiUrlValue = process.env.REACT_APP_API_URL || 'NOT SET';
    setApiUrl(apiUrlValue);

    // Test backend connection
    const testBackend = async () => {
      try {
        const response = await fetch(`${apiUrlValue}/health`);
        if (response.ok) {
          const data = await response.json();
          setBackendStatus(`✅ Backend working: ${data.message}`);
        } else {
          setBackendStatus(`❌ Backend error: ${response.status}`);
        }
      } catch (err) {
        setError(`❌ Connection failed: ${err}`);
      }
    };

    testBackend();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>🔧 API Debug Info</h3>
      <p><strong>API URL:</strong> {apiUrl}</p>
      <p><strong>Backend Status:</strong> {backendStatus}</p>
      {error && <p><strong>Error:</strong> {error}</p>}
      <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
    </div>
  );
};

export default ApiTest;
