import React from 'react';
import './quiz-item.css';
import { Link } from 'react-router-dom';

const QuizItem = ({ quiz, isSelected, onSelect, redo, onDelete, editable, selectible }) => {
  const calculateDaysSinceLastPerformance = (lastPerformedDate) => {
    const lastDate = new Date(lastPerformedDate);
    const currentDate = new Date();
    const differenceInTime = currentDate - lastDate;
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
  };

  return (
    <div
      className={`quiz-item ${(isSelected) ? 'selected' : ''} ${redo ? 'redo' : ''} ${selectible ? 'quiz-item-selectible' : ''}`}
      onClick={() => quiz.redo ? onSelect(quiz.id) : onSelect(quiz.id)}
    >
      <div className='quiz-item-header'>
        {!redo ? (
          <>
            <h3>{quiz.title}</h3>
            <p>Author: {quiz.metadata.author}</p>
            <p>{quiz.metadata.description}</p>
            <p>Days since last performance: {calculateDaysSinceLastPerformance(quiz.metadata.lastPerformed)}</p>
          </>
        ) : (
          <>
            <h3>{quiz.title}</h3>
            <p>Days since last performance: {calculateDaysSinceLastPerformance(quiz.metadata.lastPerformed)}</p>
          </>
        )}
      </div>
      {editable && <div className='quiz-item-actions'>
        <Link 
          className='edit-button button-link' 
          to="/create-quiz"
          state={{ quiz: quiz, edit: true}}  // Pass the quiz object using `state`
        >
          <i className="fas fa-edit"></i>
        </Link>
        <button className='delete-button' onClick={(e) => { e.stopPropagation(); onDelete(quiz.id); }}>
          <i className="fas fa-trash"></i>
        </button>
      </div>}
    </div>
  );
};

export default QuizItem;
