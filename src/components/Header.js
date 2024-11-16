import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../images/icon.png';
import { getAPIData } from './SUB/API';
import './CSS-File/Line.css';
import './CSS-File/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [backgroundColor, setBackgroundColor] = useState('#333333');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { apiKey, IDKey } = getAPIData();

  const handleMouseEnter = () => setBackgroundColor('#1a1a1a');
  const handleMouseLeave = () => setBackgroundColor('#333333');
  
  const handleLogout = () => {
    setIsSignedIn(false);
    setUserId('');
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => setIsMenuOpen((prev) => !prev);



  return (
    <header>
      <nav>
        <ul className='movie-container' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{backgroundColor: backgroundColor,}}>
          <li className='logo-container'>
            <Link to="/">
              <img src={logoImage} className='logo-image '/>
            </Link>
          </li>
          <li className='nav-item1'>
            <Link to="/" className="link-style">홈</Link>
          </li>
          <li className='nav-item2'>
            <Link to="/popular" className="link-style">대세 콘텐츠</Link>
          </li>
          <li className='nav-item3'>
            <Link to="/search" className="link-style">찾아보기</Link>
          </li>
          <li className='nav-item4'>
            <Link to="/wishlist" className="link-style">내가 찜한 리스트</Link>
          </li>   
          <li className='user-menu'>
            <button className='user-button'onClick={toggleDropdown}>
              <FontAwesomeIcon icon={faUser} className='user-icon'/>
            </button>
            {isMenuOpen && (
              <div className='dropdown-menu'>
                <img src={logoImage} className='dropdown-logo' />
                <p className='dropdown-text'>{IDKey}님 반갑습니다!</p>
                <Link to="/sign" className='logout-link' onClick={handleLogout}>로그아웃</Link>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
