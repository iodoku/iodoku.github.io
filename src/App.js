import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import Main from './components/Main'; 
import Popular from './components/popular'; 
import Wishlist from './components/Wishlist'; 
import Search from './components/search'; 
import Sign from './components/Sign'; 
import KakaoInfo from './components/kakaoinfo';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL || '/iodoku.github.io'}>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/kakaoinfo" element={<KakaoInfo />} />
        <Route path="*" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;