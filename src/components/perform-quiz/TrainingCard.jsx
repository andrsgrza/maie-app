import React from "react";
import "./training-card.css";

export default function TrainingCard({
  training,
  isSelected,
  onSelect,
  onDelete,
  editable,
  selectable,
}) {
  const handleClick = () => {
    if (selectable && onSelect) onSelect();
  };

  return (
    <div
      className={`resource-card training-card ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="resource-card-header">
        <h4 className="resource-title">{training.title}</h4>
        {editable && (
          <button className="delete-button" onClick={onDelete}>
            <i className="fas fa-trash-alt" />
          </button>
        )}
      </div>
      <div className="resource-card-body">
        <p>{training.sets?.length || 0} sets</p>
        {training.sets?.map((set, index) => (
          <div key={index} className="training-set-preview">
            <strong>{set.title}</strong>: {set.quizzes?.length || 0} quizzes
          </div>
        ))}
      </div>
    </div>
  );
}
