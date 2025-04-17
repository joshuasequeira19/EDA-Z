import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '100px 20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '20px',
        fontFamily: 'var(--font-heading)'
      }}>404</h1>
      <h2 style={{ 
        fontSize: '1.5rem', 
        marginBottom: '30px',
        fontFamily: 'var(--font-heading)'
      }}>Page Not Found</h2>
      <p style={{ marginBottom: '30px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={{
        display: 'inline-block',
        backgroundColor: 'var(--secondary-color)',
        color: 'white',
        padding: '12px 30px',
        borderRadius: '4px',
        textDecoration: 'none',
        fontWeight: '600',
        textTransform: 'uppercase'
      }}>
        Return to Home
      </Link>
    </div>
  );
}

export default NotFound;