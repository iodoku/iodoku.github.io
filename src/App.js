import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from './components/Header'; 
import Main from './components/Main';
import Popular from './components/popular';
import Wishlist from './components/wishlist';
import Search from './components/search';
import Sign from './components/Sign';

function App() {
  // 반응형 구분
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <Router>
      {/* 모바일과 데스크톱에서 다르게 Header를 렌더링 */}
      {isMobile ? <Header mobile /> : <Header />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/sign" element={<Sign />} />
      </Routes>
    </Router>
  );
}

export default App;