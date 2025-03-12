import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/css/index.css'; // Your global styles
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider for global user access */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
