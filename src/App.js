import React,{ useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; 
import Main from './components/Main'; // 홈 컴포넌트
import Popular from './components/popular'; // 대세 콘텐츠 컴포넌트
import Wishlist from './components/wishlist'; // 내가 찜한 리스트 컴포넌트
import Search from './components/search'; // 찾아보기 컴포넌트
import Sign from './components/Sign'; // 내가 찜한 리스트 컴포넌트
import KakaoInfo from './components/kakaoinfo';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/kakaoinfo" element={<KakaoInfo />} />
        {/* 다른 라우트 추가 */}
      </Routes>
    </Router>
  );
}

export default App;