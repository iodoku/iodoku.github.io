import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // 경로를 실제 Header.js 파일 위치로 맞추세요
import Main from './components/Main'; // 홈 컴포넌트
import Popular from './components/popular'; // 대세 콘텐츠 컴포넌트
import Browse from './components/Browse'; // 찾아보기 컴포넌트
import Wishlist from './components/Wishlist'; // 내가 찜한 리스트 컴포넌트
import Sign from './components/Sign'; // 내가 찜한 리스트 컴포넌트

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/popular" element={<Wishlist />} />
        <Route path="/sign" element={<Sign />} />
        {/* 다른 라우트 추가 */}
      </Routes>
    </Router>
  );
}

export default App;