import React from "react";
import "./ButtonBar.css";

const ButtonBar = ({
  buttons, // Legacy prop for backward compatibility
  leftItems = [],
  centerItems = [],
  rightItems = [],
}) => {
  const renderItems = (items) => {
    return items.map((item, index) => {
      // Handle legacy button format (no type specified)
      if (!item.contentType && item.label && item.onClick) {
        return (
          <button
            key={index}
            onClick={item.onClick}
            disabled={item.disabled || false}
            className={item.className || ""}
          >
            {item.label}
          </button>
        );
      }

      switch (item.contentType) {
        case "button":
          return (
            <button
              key={index}
              onClick={item.onClick}
              disabled={item.disabled || false}
              className={item.className || ""}
            >
              {item.label}
            </button>
          );

        case "switch":
          return (
            <div key={index} className="autosave-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={item.onChange}
                />
                <span className="slider round"></span>
              </label>
              <span>{item.label}</span>
            </div>
          );

        case "message":
          return (
            <p key={index} className={`save-message ${item.messageType || ""}`}>
              {item.text}
            </p>
          );

        case "text":
          return (
            <span key={index} className={item.className || ""}>
              {item.text}
            </span>
          );

        default:
          return null;
      }
    });
  };

  // Handle legacy usage
  if (
    buttons &&
    !leftItems.length &&
    !centerItems.length &&
    !rightItems.length
  ) {
    rightItems = buttons;
  }

  return (
    <div className="button-bar">
      <div className="button-bar-section button-bar-left">
        {renderItems(leftItems)}
      </div>

      <div className="button-bar-section button-bar-center">
        {renderItems(centerItems)}
      </div>

      <div className="button-bar-section button-bar-right">
        {renderItems(rightItems)}
      </div>
    </div>
  );
};

export default ButtonBar;
