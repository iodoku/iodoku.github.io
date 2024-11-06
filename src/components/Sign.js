import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './Sign.css'; // 애니메이션 효과를 위한 CSS 파일

const SignUp = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = (event) => {
    event.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(username)) {
      setMessage('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!termsAccepted) {
      setMessage('약관에 동의해야 합니다.');
      return;
    }
    localStorage.setItem('TMDb-Key', password);
    setMessage('회원가입이 완료되었습니다!');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setTermsAccepted(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
            placeholder="Email"
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="Password"
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="Confirm Password"
          />
        </div>
        <div style={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
          />
          <label htmlFor="terms">I have read Terms and Conditions</label>
        </div>
        <button type="submit" style={styles.button}>Register</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <p style={styles.switchText}>Already an account?<button onClick={toggleForm} style={styles.switchButton}>Sign In</button></p>
    </div>
  );
};

const SignIn = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = (event) => {
    event.preventDefault();
    const savedPassword = localStorage.getItem('TMDb-Key');
    if (password === savedPassword) {
      alert('로그인 성공!');
      if (rememberMe) {
        localStorage.setItem('rememberedUser', username);
      }
      window.location.href = '/'; // 로그인 성공 시 홈 화면으로 이동
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
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.inputWithPlaceholder}
            placeholder="Email"
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>
        <button type="submit" style={styles.button}>Lo</button>
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
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  inputWithPlaceholder: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    color: 'transparent', // 글자는 투명하게
    textIndent: '10px', // 텍스트가 입력란 안에서 왼쪽으로 조금 들여지게
  },
  checkboxGroup: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  switchText: {
    marginTop: '15px',
    textAlign: 'center',
  },
  switchButton: {
    color: '#007bff',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  message: {
    color: 'red',
    marginTop: '10px',
    textAlign: 'center',
  },
};

export default App;
