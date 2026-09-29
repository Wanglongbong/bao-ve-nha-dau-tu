import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { themeManager } from './lib/theme-manager';

// Khởi tạo mặc định Ấn bản Sổ Tay Hoàng Gia: Xanh Navy Bvlgari & Mạ Vàng Kim Sa
themeManager.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
