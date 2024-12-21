import React, { useState,useEffect  } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './CSS-File/Sign.css'; // 애니메이션 효과를 위한 CSS 파일
import { toast, ToastContainer } from 'react-toastify'; // toast와 ToastContainer를 가져옵니다.
import 'react-toastify/dist/ReactToastify.css'; // ToastContainer 스타일을 가져옵니다.


const SignUp = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);


  const navigate = useNavigate();

  const kakaoUserInfo = sessionStorage.getItem('kakaoUserInfo');

  console.log(kakaoUserInfo)

  if (kakaoUserInfo) {
    console.log("User already logged in:", JSON.parse(kakaoUserInfo));
    navigate('/'); // 홈 화면으로 리다이렉트
    return;
  }


  const handleSignUp = (event) => {
    event.preventDefault();

    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    // 기존의 모든 토스트 메시지를 먼저 제거
    toast.dismiss();

    
    if (!emailPattern.test(username)) {
      toast.error(
        <div className="custom-toast-content">
          <div className="custom-toast-header">
          </div>
          <div className="custom-toast-body">
            유효한 이메일 주소를 입력!<br />
            @ + 적절한 Email 형식
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: "custom-toast-error", // 커스텀 클래스명
        }
      );
      return;
    }

    if (!password) {
      toast.error(
        <div className="custom-toast-content">
          <div className="custom-toast-header">
          </div>
          <div className="custom-toast-body">
            비밀번호를 입력하세요..
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: "custom-toast-error", // 커스텀 클래스명
        }
      );
      return;
    }

    if (!confirmPassword) {
      toast.error(
        <div className="custom-toast-content">
          <div className="custom-toast-header">
          </div>
          <div className="custom-toast-body">
            확인 비밀번호를 입력하세요..
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: "custom-toast-error", // 커스텀 클래스명
        }
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        <div className="custom-toast-content">
          <div className="custom-toast-header">
          </div>
          <div className="custom-toast-body">
            비밀번호가 일치하지 않습니다..
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: "custom-toast-error", // 커스텀 클래스명
        }
      );
      return;
    }

    if (!termsAccepted) {
      toast.error(
        <div className="custom-toast-content">
          <div className="custom-toast-header">
          </div>
          <div className="custom-toast-body">
            약관에 동의해야 합니다..
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: "custom-toast-error", // 커스텀 클래스명
        }
      );
      return;
    }

    const existingUser = JSON.parse(localStorage.getItem('users')) || [];
    if (existingUser.some(user => user.username === username)) {
      toast.error(
        <div className="custom-toast-content">
          <div className="custom-toast-header">
          </div>
          <div className="custom-toast-body">
            이미 가입된 이메일 입니다..
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: "custom-toast-error", // 커스텀 클래스명
        }
      );
      return;
    }

    const newUser = { username, password };
    existingUser.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUser));

    toast.success(
      <div className="custom-toast-content">
        <div className="custom-toast-header">
        </div>
        <div className="custom-toast-body">
          회원가입이 완료되었습니다!
        </div>
      </div>, 
      {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        className: "custom-toast-success", // 커스텀 클래스명
      }
    );

    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setTermsAccepted(false);

    toggleForm();
  };

  return (
    <div className="container-up">
      <h2 className="title-up">Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="input-group-up">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            placeholder="Email"
          />
        </div>
        <div className="input-group-up">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Password"
          />
        </div>
        <div className="input-group-up">
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            placeholder="Confirm Password"
          />
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="terms">I have read Terms and Conditions</label>
        </div>
        <button type="submit" className="button">Register</button>
      </form>
      <p className="switch-text">
        Already an account?
        <button onClick={toggleForm} className="switch-button">Sign In</button>
      </p>
    </div>
  );
}  

const SignIn = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  // 강제 로그인 창 표시 설정
  const kakaoToken = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&prompt=login`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoToken; // 로그인 URL로 이동
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const kakaoUserInfo = sessionStorage.getItem('kakaoUserInfo');

    console.log('Code from URL:', code);
    console.log('Kakao User Info from Session:', kakaoUserInfo);

    if (kakaoUserInfo) {
      console.log('✅ User already logged in:', JSON.parse(kakaoUserInfo))
      return;
    }

    if (code) {
      console.log('✅ Received Auth Code:', code);

      // Access Token 요청
      fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: REST_API_KEY,
          redirect_uri: REDIRECT_URI,
          code: code,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('🔑 Token Response:', data);
          if (data.access_token) {
            // 사용자 정보 요청
            return fetch('https://kapi.kakao.com/v2/user/me', {
              method: 'GET',
              headers: { Authorization: `Bearer ${data.access_token}` },
            });
          }
          throw new Error('❌ Access token not received');
        })
        .then((res) => res.json())
        .then((userInfo) => {
          console.log('👤 카카오 회원정보:', userInfo);
          sessionStorage.setItem('kakaoUserInfo', JSON.stringify(userInfo));
          navigate('/'); // 홈 화면으로 이동

          // URL에서 인증 코드 제거
          window.history.replaceState({}, document.title, '/sign');
        })
        .catch((err) => {
          console.error('❌ Kakao login error:', err);
        });
    }
  }, [navigate]);
  


  const handleSignIn = (event) => {
    event.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    // 기존의 모든 토스트 메시지를 먼저 제거
    toast.dismiss();
    
    if (!username) {
      toast.error(
        <div className="custom-toast-content">
          <div className="custom-toast-header">
          </div>
          <div className="custom-toast-body">
            이메일을 입력하세요....
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: "custom-toast-error", // 커스텀 클래스명
        }
      );
      return;
    }

    if (!password) {
      toast.error(
        <div className="custom-toast-content">
          <div className="custom-toast-header">
          </div>
          <div className="custom-toast-body">
            비밀번호를 입력하세요..
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: "custom-toast-error", // 커스텀 클래스명
        }
      );
      return;
    }

    if (user) {
      sessionStorage.setItem('CurEmail', password);
      sessionStorage.setItem('CurID', username);
      toast.success(
        <div className="custom-toast-content">
          <div className="custom-toast-header">
          </div>
          <div className="custom-toast-body">
            로그인 성공!
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: "custom-toast-success", // 커스텀 클래스명
        }
      );
      if (rememberMe) {
        localStorage.setItem('Remembercheck', password);
        localStorage.setItem('RemembercheckID', username);
      }
      else{
        localStorage.setItem('Remembercheck', '');
        localStorage.setItem('RemembercheckID', '');
      }
      navigate('/');; // 로그인 성공 시 홈 화면으로 이동

    } else {
      toast.error(
        <div className="custom-toast-content">
          <div className="custom-toast-header">
          </div>
          <div className="custom-toast-body">
            비밀번호가 일치하지 않거나 <br />
            가입되지 않은 이메일입니다..
          </div>
        </div>, 
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: "custom-toast-error", // 커스텀 클래스명
        }
      );
      return;
    }

    setUsername('');
    setPassword('');
  };



  return (
    <div className="container-in">
      <h2 className="title-in">Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="input-group-in ">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            placeholder="Email"
          />
        </div>
        <div className="input-group-in ">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Password"
          />
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <button type="submit" className="button">Login</button>
        <a onClick={handleKakaoLogin} href={kakaoToken} className="kakao-login-link">
          <img src="kakao_login_medium_narrow.png" alt="Kakao Login" className="kakao-login-image" />
        </a>
      </form>
      <p className="switch-text">
        Don't have an account? 
        <button onClick={toggleForm} className="switch-button">Sign up</button>
      </p>
    </div>
  );
};

const App = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const location = useLocation(); 

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    console.log('Code from URL:', code);

    if (code) {
      setIsSignUp(false); // 카카오 로그인 코드가 있을 경우 SignIn 화면으로 강제 이동
    }
  }, [location.search]);


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
      {/* ToastContainer를 App 컴포넌트에 추가 */}
      <ToastContainer position="bottom-center" autoClose={5000} />
    </div>
  );
};



export default App;
