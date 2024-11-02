import React, { useState } from 'react';

const Sign = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = (event) => {
    event.preventDefault();
    
    // 사용자가 입력한 비밀번호를 localStorage에 저장
    localStorage.setItem('TMDb-Key', password);
    
    setMessage('회원가입이 완료되었습니다!'); // 사용자에게 메시지 표시

    // 추가적인 초기화
    setUsername('');
    setPassword('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username">사용자 이름:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
          회원가입
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default Sign;