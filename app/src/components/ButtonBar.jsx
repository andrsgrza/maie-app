import React from "react";
import "./ButtonBar.css"; // Import the CSS file for styling

const ButtonBar = ({ buttons }) => {
  return (
    <div className="button-bar">
      {buttons.map((button, index) => (
        <button
          key={index}
          className="button-bar-button"
          onClick={button.onClick}
          disabled={button.disabled}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonBar;
