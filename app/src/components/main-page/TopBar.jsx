import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./topbar.css";
import logo from "../../../resources/cropped-logo.png";
import { LoginClient } from "../../api/login-client";
import { useAuth } from "../../context/AuthContext";
import { FaUser } from "react-icons/fa";

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
    if (response.status >= 200 && response.status < 300) {
      unauthenticate();
      navigate("/login");
      toggleMenu();
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="topbar">
      <div className="topbar-sidebar">
        {!props.enableStart && (
          <button className="sidebar-button" onClick={props.openSidebar}>
            ☰
          </button>
        )}
      </div>
      <div className="topbar-logo">
        <Link to="/" className="home-link">
          <img src={logo} alt="Home" className="home-icon" />
        </Link>
      </div>
      <div className="topbar-right">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="topbar-button">
              Login
            </Link>
            <Link to="/signup" className="topbar-button">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="user-profile">
            <button className="user-button" onClick={toggleMenu}>
              <FaUser color="#4caf50" size={24} />
            </button>
            {showMenu && (
              <div className="user-menu">
                <ul>
                  {/* <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/settings">Settings</Link>
                  </li> */}
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
