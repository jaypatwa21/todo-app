import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

// Google Sign-In Types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: Element, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Debug: Check if environment variable is loaded
    console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
    console.log('API URL:', process.env.REACT_APP_API_URL);
    console.log('Node ENV:', process.env.NODE_ENV);
    
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        
        if (!clientId) {
          console.error('Google Client ID is not defined in environment variables');
          setError('Google Sign-In is not properly configured. Please check your environment variables.');
          return;
        }
        
        console.log('Initializing Google Sign-In with Client ID:', clientId);
        
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });

        const googleButtonElement = document.getElementById('google-signin-button');
        if (googleButtonElement) {
          window.google.accounts.id.renderButton(
            googleButtonElement,
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with',
            }
          );
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await authAPI.googleAuth(response.credential);
      login(result.data.access_token, result.data.user);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5' 
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Sign In to Todo App
        </h2>
        
        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fee',
            color: '#c53030',
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          margin: '1.5rem 0',
          color: '#666',
          fontSize: '0.875rem'
        }}>
          or
        </div>

        <div id="google-signin-button" style={{ marginBottom: '1rem' }}></div>

        <p style={{ textAlign: 'center', margin: '1rem 0', fontSize: '0.875rem', color: '#666' }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{ color: '#007bff', textDecoration: 'none' }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
