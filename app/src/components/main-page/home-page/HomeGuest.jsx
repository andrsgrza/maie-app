import React from "react";
import "./home-guest.css";

export default function HomeGuest() {
  return (
    <div className="home-guest-container">
      <h1>Welcome to Maie</h1>
      <p>
        Join us to start creating and mastering your personalized trainings.
      </p>
      <div className="guest-buttons">
        <a href="/login" className="btn-primary">
          Login
        </a>
        <a href="/signup" className="btn-secondary">
          Sign Up
        </a>
      </div>
    </div>
  );
}
