import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

const SidebarMenu = ({ onLinkClick }) => {
  return (
    <div className="sidebar-login-menu">
      <h2>Welcome</h2>
      <p>Please log in or sign up to continue.</p>
      <div className="sidebar-login-buttons">
        <Link
          to="/login"
          className="sidebar-login-button"
          onClick={onLinkClick}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="sidebar-login-button"
          onClick={onLinkClick}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SidebarMenu;
