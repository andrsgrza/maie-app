import React, { useState } from 'react';
import './login-form.css';
import { LoginClient } from '../../api/login-client';
import { useNavigate } from 'react-router-dom';
import { useBanner } from '../../context/BannerContext';
import { MESSAGES } from '../../common/constants';

const LoginForm = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { addBanner } = useBanner();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await LoginClient.requestLogin(username, password);
      console.log(response.status);
      if( response.status >= 200 && response.status < 300 ){
        localStorage.setItem('token', response.data.token);
        props.setCurrentUser({
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          telephone: response.data.telephone,
          profilePicture: response.data.profilePicture
        });
        navigate('/');
      } else if( response.status === 401  || response.status === 403) {
        addBanner('error', MESSAGES.ERROR.FEATURE_MESSAGES.LOGIN, MESSAGES.ERROR.FEATURE_MESSAGES.INVALID_CREDENTIALS);
        return;
      } else {
        addBanner('error', MESSAGES.ERROR.FEATURE_MESSAGES.LOGIN, response.message ? response.message : MESSAGES.ERROR.FEATURE_MESSAGES.DEFAULT_ERROR);
      }
    }catch(error){      
      addBanner('error', MESSAGES.ERROR.FEATURE_MESSAGES.LOGIN, error.message ? error.message : MESSAGES.ERROR.FEATURE_MESSAGES.DEFAULT_ERROR);
    }
  };

  return (
    <div className="centered-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-button" disabled={!username || !password}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
