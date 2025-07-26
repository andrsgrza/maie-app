import React from "react";
import "./home-user.css";
import { Link } from "react-router-dom";

export default function HomeUser({ username }) {
  return (
    <div className="home-user-container">
      <h1>Welcome {username}!</h1>
      <p>Continue your journey or challenge yourself in the Arena.</p>
      <div className="user-buttons">
        <Link to="/my-quizzes" className="btn-primary">
          Quizzes
        </Link>
        <Link to="/arena" className="btn-secondary">
          Arena
        </Link>
      </div>
    </div>
  );
}
