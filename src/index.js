import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(process.env.REACT_APP_KAKAO_REST_API_KEY);
  console.log('✅ Kakao SDK Initialized:', window.Kakao.isInitialized());
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 성능 측정을 위한 설정 (옵션)
reportWebVitals();