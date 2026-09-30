import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Phiên bản legal-tech sáng: một theme cam đất nhất quán, không đổi nền tối.
document.documentElement.setAttribute('data-theme', 'orange');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
