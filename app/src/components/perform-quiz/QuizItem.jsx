import React, { useState, useEffect, useRef } from 'react';
import './quiz-item.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaKey, FaDownload, FaCog } from 'react-icons/fa';

const QuizItem = ({ quiz, isSelected, onSelect, redo, onDelete, editable, selectible }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);
  
  // Using useNavigate hook for navigation
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        toggleRef.current && 
        !dropdownRef.current.contains(event.target) && 
        !toggleRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to navigate to edit page
  const handleEdit = () => {
    navigate('/create-quiz', {
      state: { preloadedQuiz: quiz, edit: true }
    });
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
            <p>{quiz.metadata.description}</p>            
            {editable ? <p>Created on {quiz.metadata.creationDate}</p> : <p>Last performed {calculateDaysSinceLastPerformance(quiz.metadata.creationDate)} days ago</p>}
            <p>Owner: {quiz.metadata.author}</p>            
          </>
        ) : (
          <>
            <h3>{quiz.title}</h3>
            <p>Days since last performance: {calculateDaysSinceLastPerformance(quiz.metadata.creationDate)}</p>
          </>
        )}
      </div>
      {editable && <div className='quiz-item-actions'>
        <div className="dropdown-wrapper">
          <button className="dropdown-toggle" onClick={toggleDropdown} ref={toggleRef}>
            <FaCog />
          </button>

          {dropdownOpen && (
            <ul className='dropdown-menu2' ref={dropdownRef}>
              <li className='entitlement-element' onClick={() => handleAction('entitlements')}>
                <FaKey className="icon" /> Entitlements
              </li>
              <li className='edit-element' onClick={handleEdit}>
                <FaEdit className="icon" /> Edit
              </li>
              <li className='download-element' onClick={() => handleAction('download')}>
                <FaDownload className="icon" /> Download
              </li>
              <li className='delete-element' onClick={(e) => { e.stopPropagation(); onDelete(quiz.id); }}>
                <FaTrash className="icon" /> Remove
              </li>
            </ul>
          )}
        </div>
      </div>}
    </div>
  );
};

export default QuizItem;
