import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

if (window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(process.env.REACT_APP_KAKAO_REST_API_KEY);
  console.log('✅ Kakao SDK Initialized:', window.Kakao.isInitialized());
}

// 환경에 따른 basename 설정


const basename =process.env.REACT_APP_API_BASE_URL
console.log('📍 Basename:', basename);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);

reportWebVitals();