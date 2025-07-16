import React, { useState, useEffect, useRef } from "react";
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

  const menuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

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
          <div className="user-profile" ref={menuRef}>
            <button className="user-button" onClick={toggleMenu}>
              {/* // TODO: change false with currentUser.profilePicture */}
              {false ? (
                <img src={currentUser.profilePicture} alt="User Profile" />
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              )}
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
