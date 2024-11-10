import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../images/icon.png';  // 이미지 경로 수정
import { getAPIData } from './SUB/API'; 
import './CSS-File/Line.css'; // CSS 파일 임포트
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser  } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [backgroundColor, setBackgroundColor] = useState('#333333');  // 기본 배경색을 #333333로 설정
  const [isSignedIn, setIsSignedIn] = useState(false); // 로그인 상태
  const [userId, setUserId] = useState('');  // 사용자 ID
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // 드롭다운 메뉴 열림 상태

  const { apiKey, IDKey } = getAPIData();

  const handleMouseEnter = () => {
    setBackgroundColor('#1a1a1a');  // 마우스를 올렸을 때 배경색
  };

  const handleMouseLeave = () => {
    setBackgroundColor('#333333');  // 마우스를 내렸을 때 원래 배경색
  };

  const handleSignIn = () => {
    setIsSignedIn(true);
    setUserId('장동하');  // 예시로 사용자 ID 설정
  };

  const handleLogout = () => {
    setIsSignedIn(false);
    setUserId('');
    setIsMenuOpen(false);  // 로그아웃 시 메뉴 닫기
  };

  return (
    <header>
      <nav>
        <ul
          style={{
            listStyleType: 'none',
            padding: 0,
            backgroundColor: backgroundColor, // 상태에 따라 배경색 변경
            transition: 'background-color 0.3s ease', // 배경색이 부드럽게 변화하도록 설정
            margin: 0, // ul의 기본 margin 제거
            display: 'flex', // flexbox 사용
            justifyContent: 'flex-start', // 왼쪽 정렬로 변경
            alignItems: 'center', // 세로 중앙 정렬
            width: '100%', // 전체 너비를 차지하도록 설정
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* 로고 이미지 추가 */}
          <li style={{
            display: 'inline-block',
            padding: '5px 70px', 
          }}>
            <Link to="/">
              <img
                src={logoImage} // import한 이미지 사용
                alt="로고"
                style={{
                  width: '40px', // 로고 크기 조정
                  height: '40px', // 로고 크기 조정
                  marginTop: '10px' 
                }}
              />
            </Link>
          </li>

          {/* 나머지 메뉴 항목들 */}
          <li style={{
            display: 'inline-block', 
            minWidth: '50px',
          }}>
            <Link to="/" className="link-style">홈</Link>
          </li>
          <li style={{
            display: 'inline-block',
            minWidth: '110px',
          }}>
            <Link to="/popular" className="link-style">대세 콘텐츠</Link>
          </li>
          <li style={{
            display: 'inline-block',
            minWidth: '90px',
          }}>
            <Link to="/search" className="link-style">찾아보기</Link>
          </li>
          <li style={{
            display: 'inline-block',
            minWidth: '50px',
          }}>
            <Link to="/wishlist" className="link-style">내가 찜한 리스트</Link>
          </li>
          
          <li style={{display: 'inline-block',marginLeft: 'auto', padding: '15px 25px',minWidth: '150px',position: 'relative', }}onMouseEnter={() => setIsMenuOpen(true)}onMouseLeave={() => setIsMenuOpen(false)}>
            <button style={{ background: 'none', border: 'none', color: 'white' }}><FontAwesomeIcon icon={faUser} style={{ fontSize: '16px' }} /></button>
            {isMenuOpen && (
              <div style={{ position: 'absolute', top: 10,right: 50,backgroundColor: '#444',color: 'white',padding: '15px',borderRadius: '20px',minWidth: '300px',zIndex: 1000,height: '400px',}}>
                <img src={logoImage} alt="로고" style={{width: '300px', height: '300px',}}/>
                <p style={{ textAlign: 'center' }}>{IDKey}님 반갑습니다!</p>
                <Link to="/sign" style={{
                  display: 'block',
                  width: '280px',
                  backgroundColor: '#555',
                  color: 'white',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  textAlign: 'center'
                }} onClick={handleLogout}>
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
