import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ display: 'inline', marginRight: '20px' }}>
            <Link to="/">홈</Link>
          </li>
          <li style={{ display: 'inline', marginRight: '20px' }}>
            <Link to="/trending">대세 콘텐츠</Link>
          </li>
          <li style={{ display: 'inline', marginRight: '20px' }}>
            <Link to="/browse">찾아보기</Link>
          </li>
          <li style={{ display: 'inline', marginRight: '20px' }}>
            <Link to="/wishlist">내가 찜한 리스트</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;