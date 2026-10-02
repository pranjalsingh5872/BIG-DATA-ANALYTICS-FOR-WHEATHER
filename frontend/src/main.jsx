import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './context/LanguageContext';

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('WEATHERNEXUS Captured Runtime Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 16px'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px', color: '#f8fafc' }}>
              WEATHERNEXUS · System Auto-Recovery
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px', lineHeight: '1.6' }}>
              An unexpected render issue was safely intercepted. Click below to refresh telemetry and restore live meteorological observation.
            </p>
            {this.state.error && (
              <pre style={{
                textAlign: 'left',
                backgroundColor: '#0f172a',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#f87171',
                overflowX: 'auto',
                margin: '0 0 20px',
                fontFamily: 'monospace',
                border: '1px solid #334155'
              }}>
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0369a1'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#0284c7'}
            >
              🔄 Reload & Restore National Command
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
);

