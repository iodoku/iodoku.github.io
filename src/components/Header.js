import React from 'react';
import { Link } from 'react-router-dom';
import './CSS-File/Header.css'; // CSS 파일 임포트

const Header = () => {
  return (
    <header>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ display: 'inline', marginRight: '20px' }}>
            <Link to="/">홈</Link>
          </li>
          <li style={{ display: 'inline', marginRight: '20px' }}>
            <Link to="/popular">대세 콘텐츠</Link>
          </li>
          <li style={{ display: 'inline', marginRight: '20px' }}>
            <Link to="/search">찾아보기</Link>
          </li>
          <li style={{ display: 'inline', marginRight: '20px' }}>
            <Link to="/wishlist">내가 찜한 리스트</Link>
          </li>
          <li style={{ display: 'inline', marginRight: '20px' }}>
            <Link to="/sign">회원가입</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;