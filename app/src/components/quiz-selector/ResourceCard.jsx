import React from "react";
import DropdownMenu from "../ui/DropdownMenu";

export default function ResourceCard({
  item,
  resourceType = "generic",
  onSelect,
  isSelected = false,
  selectable = false,
  roleBadgeClass,
  roleTooltip,
  actions = [],
  children,
}) {
  return (
    <div
      className={`resource-card ${selectable ? "" : "no-select-hover"} ${
        isSelected ? "selected" : ""
      } `}
      onClick={selectable ? onSelect : undefined}
    >
      <div className="resource-card-header">
        <h3>{item.title}</h3>
        <div className="resource-icons">
          {roleBadgeClass && (
            <span
              className={`role-badge ${roleBadgeClass}`}
              title={roleTooltip}
            ></span>
          )}
          {actions.length > 0 && (
            <div className="dropdown-container">
              <button className="dropdown-btn">⋮</button>
              <div className="dropdown-content">
                <ul>
                  {actions.map((action, idx) => (
                    <li
                      key={idx}
                      className={`dropdown-item ${action.className || ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(item);
                      }}
                    >
                      {action.icon && (
                        <span className="icon">{action.icon}</span>
                      )}
                      {action.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      {item.description && <p>{item.description}</p>}
      {item.createdAt && (
        <p className="resource-date">
          Created on {new Date(item.createdAt).toLocaleString()}
        </p>
      )}
      {children}
    </div>
  );
}
