import React from 'react';
import './quiz-item.css';

const QuizItem = ({ quiz, isSelected, onSelect }) => {
  const calculateDaysSinceLastPerformance = (lastPerformedDate) => {
    const lastDate = new Date(lastPerformedDate);
    const currentDate = new Date();
    const differenceInTime = currentDate - lastDate;
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
  };

  return (
    <div
      className={`quiz-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(quiz.id)}
    >
      <h3>{quiz.title}</h3>
      <p>Author: {quiz.metadata.author}</p>
      <p>{quiz.metadata.description}</p>
      <p>Days since last performance: {calculateDaysSinceLastPerformance(quiz.metadata.lastPerformed)}</p>
    </div>
  );
};

export default QuizItem;
