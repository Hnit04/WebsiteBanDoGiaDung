import React, { useState } from 'react';
import './Register.css';
import bgImage from '../../assets/bg1-login.jpg';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignIn = () => {
    setFade('fade-out');
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make API call to send OTP
    setShowOtpPopup(true);
  };

  const handleVerifyOtp = () => {
    // Here you would verify OTP with backend
    console.log('Verifying OTP:', otp);
    setShowOtpPopup(false);
    // Proceed with registration if OTP is valid
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className={`register-container ${fade ? 'fade-out' : ''}`}>
      <div className="background">
        <img src={bgImage} alt="Background" className="background-image" />
      </div>
      <div className="register-box">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />
          
          <label>Password</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={handlePasswordChange} required />
          
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
          {passwordError && <div className="error-message">{passwordError}</div>}
          <button type="submit" disabled={!password || !confirmPassword || password !== confirmPassword}>Sign up</button>
        </form>
        <div className="or-divider">or</div>
        <div className="login">
          <button className="sign-in" onClick={handleSignIn}>Sign in</button>
        </div>
      </div>

      {showOtpPopup && (
        <div className="otp-popup-overlay">
          <div className="otp-popup">
            <h3>Enter OTP</h3>
            <p>Please enter the verification code sent to your email</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength="6"
            />
            <div className="otp-buttons">
              <button onClick={() => setShowOtpPopup(false)}>Cancel</button>
              <button onClick={handleVerifyOtp}>Verify</button>
            </div>
          </div>
        </div>
      )}




    </div>
  );
};

export default Register;
