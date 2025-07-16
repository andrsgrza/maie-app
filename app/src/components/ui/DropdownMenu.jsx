import React from "react";
import "./dropdown-menu.css";

export default function DropdownMenu({ actions = [], alignRight = true }) {
  return (
    <div className="dropdown-container">
      <button className="dropdown-btn">⋮</button>
      <div className={`dropdown-content ${alignRight ? "align-right" : ""}`}>
        <ul>
          {actions.map((action, idx) => (
            <li
              key={idx}
              className={`dropdown-item ${action.className || ""}`}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
            >
              {action.icon && <span className="icon">{action.icon}</span>}
              {action.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
