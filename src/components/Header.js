import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
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
  const [kakaoUserInfo, setKakaoUserInfo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보 가져오기

  const { apiKey, IDKey } = getAPIData();

  const handleMouseEnter = () => setBackgroundColor('#1a1a1a');
  const handleMouseLeave = () => setBackgroundColor('#333333');


  const handleLogout = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      console.warn('⚠️ Kakao SDK가 초기화되지 않았습니다.');
      window.Kakao.init(process.env.REACT_APP_KAKAO_REST_API_KEY);
      console.log('✅ Kakao SDK 재초기화:', window.Kakao.isInitialized());
    }
  
    const accessToken = window.Kakao.Auth.getAccessToken();
    console.log('🛠️ Access Token:', accessToken);
  
    if (!accessToken) {
      console.warn('⚠️ Access Token이 존재하지 않습니다. 강제 로그아웃 진행.');
      sessionStorage.clear();
      localStorage.removeItem('kakaoUserInfo');
      setKakaoUserInfo(null);
      setIsSignedIn(false);
      setIsMenuOpen(false);
      navigate('/sign');
      return;
    }
  
    // 1️⃣ 로그아웃
    window.Kakao.Auth.logout(() => {
      console.log('✅ 카카오 로그아웃 성공');
  
      // 2️⃣ 연결 끊기
      window.Kakao.API.request({
        url: '/v1/user/unlink',
        success: (res) => {
          console.log('✅ 카카오 연결 끊기 성공:', res);
  
          // 3️⃣ 세션 및 로컬 스토리지 초기화
          sessionStorage.clear();
          localStorage.removeItem('kakaoUserInfo');
          setKakaoUserInfo(null);
          setIsSignedIn(false);
          setIsMenuOpen(false);
  
          navigate('/sign');
        },
        fail: (err) => {
          console.error('❌ 카카오 연결 끊기 실패:', err);
          navigate('/sign');
        },
      });
    });
  };

  const toggleDropdown = () => {
    if (!IDKey && !kakaoUserInfo) {
      navigate('/sign');
    } else {
      setIsMenuOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    // 페이지가 로드되거나 경로가 변경될 때마다 kakaoUserInfo 확인
    const kakaoData = JSON.parse(sessionStorage.getItem('kakaoUserInfo'));
    if (kakaoData) {
      console.log('Kakao User Info Updated:', kakaoData);
      setKakaoUserInfo(kakaoData);
    }
  }, [location]); // location 변경 시 실행

  return (
    <header>
      <nav>
        <ul
          className='movie-container-header'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ backgroundColor: backgroundColor }}
        >
          <li className='logo-container'>
            <Link to='/'>
              <img src={logoImage} className='logo-image' />
            </Link>
          </li>
          <li className='nav-item1'>
            <Link to='/' className='link-style'>
              홈
            </Link>
          </li>
          <li className='nav-item2'>
            <Link to='/popular' className='link-style'>
              대세 콘텐츠
            </Link>
          </li>
          <li className='nav-item3'>
            <Link to='/search' className='link-style'>
              찾아보기
            </Link>
          </li>
          <li className='nav-item4'>
            <Link to='/wishlist' className='link-style'>
              내가 찜한 리스트
            </Link>
          </li>
          <li className='nav-item5'>
            {kakaoUserInfo?.properties?.nickname && (
              <Link to='/kakaoinfo' className='link-style'>
                {kakaoUserInfo.properties.nickname}님 반갑습니다!
              </Link>
            )}
          </li>
          <li className='user-menu'>
            <button className='user-button' onClick={toggleDropdown}>
              <FontAwesomeIcon icon={faUser} className='user-icon' />
            </button>
            {isMenuOpen && (IDKey || kakaoUserInfo) && (
              <div className='dropdown-menu'>
                <img src={logoImage} className='dropdown-logo' />
                {IDKey && <p className='dropdown-text'>{IDKey}님 반갑습니다!</p>}
                {kakaoUserInfo && kakaoUserInfo.properties && (
                  <div>
                    <p className='dropdown-text'>
                      {kakaoUserInfo.properties.nickname}님 반갑습니다!
                    </p>
                  </div>
                )}
                <Link to='/sign' className='logout-link' onClick={handleLogout}>
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