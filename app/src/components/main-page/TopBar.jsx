import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './topbar.css';
import logo from '../../../resources/logo-dark.png';
import { LoginClient } from '../../api/login-client';
import { useAuth } from '../../context/AuthContext';

const TopBar = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, unauthenticate } = useAuth();
  
  useEffect(() => {    
    if (isAuthenticated) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    const response = await LoginClient.requestLogout();
    if(response.status >= 200 && response.status < 300) {
      console.log("logout success");
      unauthenticate();
      navigate('/login');
      toggleMenu();
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {!props.enableStart && (
          <button className="sidebar-button" onClick={props.openSidebar}>
            ☰
          </button>
        )}

      </div>
      <div className="topbar-left">
        <Link to="/" className="home-link">
          <img src={logo} alt="Homet" className="home-icon" />
        </Link>
      </div>

      <div className="topbar-right">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="topbar-button">Login</Link>
            <Link to="/signup" className="topbar-button">Sign Up</Link>
          </>
        ) : (
          <div className="user-profile">
            <button onClick={toggleMenu} className="user-button">User</button>
            {showMenu && (
              <div className="user-menu">
                <ul>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/settings">Settings</Link></li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;