import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS-File/KakaoInfo.css';

const KakaoInfo = () => {
  const [kakaoUserInfo, setKakaoUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('kakaoUserInfo'));
    if (userInfo) {
      setKakaoUserInfo(userInfo);
      console.log('✅ 카카오 사용자 정보:', userInfo);
    } else {
      console.warn('⚠️ 카카오 사용자 정보가 없습니다. 로그인 페이지로 이동합니다.');
      navigate('/sign');
    }
  }, [navigate]);

  if (!kakaoUserInfo) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="kakao-info-container">
      <h2>카카오 사용자 정보</h2>
      <table className="kakao-info-table">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{kakaoUserInfo.id || '정보 없음'}</td>
          </tr>
          <tr>
            <th>닉네임</th>
            <td>{kakaoUserInfo.properties?.nickname || '정보 없음'}</td>
          </tr>
          <tr>
            <th>프로필 이미지</th>
            <td>
              {kakaoUserInfo.properties?.profile_image ? (
                <img
                  src={kakaoUserInfo.properties.profile_image}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                '정보 없음'
              )}
            </td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>{kakaoUserInfo.kakao_account?.email || '정보 없음'}</td>
          </tr>
          <tr>
            <th>연령대</th>
            <td>{kakaoUserInfo.kakao_account?.age_range || '정보 없음'}</td>
          </tr>
          <tr>
            <th>생일</th>
            <td>{kakaoUserInfo.kakao_account?.birthday || '정보 없음'}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => navigate('/')} className="back-button">
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default KakaoInfo;
