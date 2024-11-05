import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './Sign.css'; // 애니메이션 효과를 위한 CSS 파일

const SignUp = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = (event) => {
    event.preventDefault();
    localStorage.setItem('TMDb-Key', password);
    setMessage('회원가입이 완료되었습니다!');
    setUsername('');
    setPassword('');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>회원가입</h2>
      <form onSubmit={handleSignUp}>
        <div style={styles.inputGroup}>
          <label htmlFor="username">사용자 이름:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>회원가입</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <p style={styles.switchText}>이미 계정이 있으신가요? <button onClick={toggleForm} style={styles.switchButton}>로그인</button></p>
    </div>
  );
};

const SignIn = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (event) => {
    event.preventDefault();
    const savedPassword = localStorage.getItem('TMDb-Key');
    if (password === savedPassword) {
      alert('로그인 성공!');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
    setUsername('');
    setPassword('');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>로그인</h2>
      <form onSubmit={handleSignIn}>
        <div style={styles.inputGroup}>
          <label htmlFor="username">사용자 이름:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>로그인</button>
      </form>
      <p style={styles.switchText}>계정이 없으신가요? <button onClick={toggleForm} style={styles.switchButton}>회원가입</button></p>
    </div>
  );
};

const App = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div>
        <div className="bg-image"></div>
        <div className="overlay"></div> {/* 어두운 레이어 추가 */}
        <div className="wrapper">
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={isSignUp}
                    timeout={400}
                    classNames="double"
                >
                    <div>
                        {isSignUp ? <SignUp toggleForm={toggleForm} /> : <SignIn toggleForm={toggleForm} />}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // 화면 높이를 100%로 설정하여 중앙 정렬
    paddingRight: '70px',
  },
  container: {
    width: '100%',
    maxWidth: '600px', // 전체 크기를 조금 줄여서 대칭 조정
    padding: '40px', // 패딩
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: 'white',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // 그림자 추가
  },
  title: {
    color: '#00796B',
    fontSize: '2rem', // 제목 크기
  },
  inputGroup: {
    marginBottom: '20px', // 여백
    textAlign: 'left',
    marginRight: '35px'
  },
  input: {
    width: '100%',
    padding: '16px', // 입력 필드 패딩
    marginTop: '10px',
    border: '1px solid #B2DFDB',
    borderRadius: '5px',
    fontSize: '1.2rem', // 입력 필드 폰트 크기
  },
  button: {
    width: '100%',
    padding: '16px', // 버튼 패딩
    backgroundColor: '#00796B',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '1.2rem', // 버튼 폰트 크기
  },
  message: {
    color: 'green',
    marginTop: '20px',
    fontSize: '1.2rem', // 메시지 폰트 크기
  },
  switchText: {
    marginTop: '30px', // 여백
    fontSize: '1.2rem', // 폰트 크기
  },
  switchButton: {
    backgroundColor: 'transparent',
    color: '#00796B',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '1.2rem', // 버튼 폰트 크기
  }
};

export default App;
