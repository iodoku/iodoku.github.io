import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import logoImage from '../images/icon.png';
import { getAPIData } from './SUB/API';
import './CSS-File/Line.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [backgroundColor, setBackgroundColor] = useState('#333333');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { apiKey, IDKey } = getAPIData();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const handleMouseEnter = () => setBackgroundColor('#1a1a1a');
  const handleMouseLeave = () => setBackgroundColor('#333333');
  
  const handleLogout = () => {
    setIsSignedIn(false);
    setUserId('');
    setIsMenuOpen(false);
  };

  return (
    <header>
      <nav>
        <ul
          style={{
            listStyleType: 'none',
            padding: 0,
            backgroundColor: backgroundColor,
            transition: 'background-color 0.3s ease',
            margin: 0,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            ...(isMobile ? { flexDirection: 'column' } : {}), // 모바일일 경우 수직 배치
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <li style={{ display: 'inline-block', padding: isMobile ? '10px' : '5px 70px' }}>
            <Link to="/">
              <img
                src={logoImage}
                alt="로고"
                style={{
                  width: '40px',
                  height: '40px',
                  marginTop: '10px',
                }}
              />
            </Link>
          </li>

          {!isMobile && (
            <>
              <li style={{ display: 'inline-block', minWidth: '50px' }}>
                <Link to="/" className="link-style">홈</Link>
              </li>
              <li style={{ display: 'inline-block', minWidth: '110px' }}>
                <Link to="/popular" className="link-style">대세 콘텐츠</Link>
              </li>
              <li style={{ display: 'inline-block', minWidth: '90px' }}>
                <Link to="/search" className="link-style">찾아보기</Link>
              </li>
              <li style={{ display: 'inline-block', minWidth: '50px' }}>
                <Link to="/wishlist" className="link-style">내가 찜한 리스트</Link>
              </li>
            </>
          )}

          <li
            style={{
              display: 'inline-block',
              marginLeft: 'auto',
              padding: isMobile ? '10px' : '15px 25px',
              minWidth: isMobile ? '50px' : '150px',
              position: 'relative',
            }}
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <button style={{ background: 'none', border: 'none', color: 'white' }}>
              <FontAwesomeIcon icon={faUser} style={{ fontSize: '16px' }} />
            </button>
            {isMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: isMobile ? '60px' : 10,
                  right: isMobile ? '10px' : 50,
                  backgroundColor: '#444',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '20px',
                  minWidth: '300px',
                  zIndex: 1000,
                  height: isMobile ? '200px' : '400px',
                }}
              >
                <img src={logoImage} alt="로고" style={{ width: '300px', height: '300px' }} />
                <p style={{ textAlign: 'center' }}>{IDKey}님 반갑습니다!</p>
                <Link
                  to="/sign"
                  style={{
                    display: 'block',
                    width: '280px',
                    backgroundColor: '#555',
                    color: 'white',
                    padding: '10px',
                    border: 'none',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                  onClick={handleLogout}
                >
                  로그아웃
                </Link>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
