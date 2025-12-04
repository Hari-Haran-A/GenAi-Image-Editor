import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handler for deployment debugging
window.addEventListener('error', (e) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="color: #ef4444; padding: 20px; font-family: monospace; background: #1e293b; height: 100vh;">
        <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 10px;">Application Error</h3>
        <p>${e.message}</p>
        <pre style="margin-top: 10px; opacity: 0.7; font-size: 0.875rem;">${e.filename}:${e.lineno}</pre>
      </div>
    `;
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error: any) {
  rootElement.innerHTML = `
    <div style="color: #ef4444; padding: 20px; text-align: center;">
      <h3>Failed to mount application</h3>
      <p>${error?.message || 'Unknown error'}</p>
    </div>
  `;
  console.error("Mount error:", error);
}