

import React, { useState } from 'react';
import './Login.css';
import bgImage from '../../assets/bg1-login.jpg';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  const handleSignUp = () => {
    setFade('fade-out');
    setTimeout(() => {
      navigate('/register');
    }, 500);
  };

  return (
    <div className={`login-container ${fade ? 'fade-out' : ''}`}>
      <div className="background">
        <img src={bgImage} alt="Background" className="background-image" />
      </div>
      <div className="login-box">
        <h2>Sign in</h2>
        <form>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <div className="forgot-password">
            <a href="#">Forgot password</a>
          </div>
          <button type="submit">Sign in</button>
        </form>
        <div className="or-divider">or</div>
        <div className="register">
          <button className="sign-up" onClick={handleSignUp}>Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;

