import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login-form.css"; // Assuming we will reuse the login form CSS
import { LoginClient } from "../../api/login-client";
import { useBanner } from "../../context/BannerContext";
import { MESSAGES } from "../../common/constants";

const RegistryForm = () => {
  const { addBanner } = useBanner();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    telephone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await LoginClient.requestSignUp(
        formData.username,
        formData.password,
        formData.email,
        formData.telephone
      );
      addBanner(
        MESSAGES.API_MESSAGES.SIGN_UP[response.status].TYPE,
        MESSAGES.API_MESSAGES.SIGN_UP[response.status].TITLE,
        MESSAGES.API_MESSAGES.SIGN_UP[response.status].MESSAGE
      );
      if (response.status >= 200 && response.status < 300) {
        navigate("/login");
      }
    } catch (error) {
      addBanner(
        "error",
        "Somethig went wrong",
        "Something went wrong while calling registration service."
      );
    }
  };

  return (
    <div className="centered-container">
      <div className="login-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="telephone"
              placeholder="Telephone (optional)"
              value={formData.telephone}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="login-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistryForm;
