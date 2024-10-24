import React, { useState, useEffect, useRef } from 'react';
import './quiz-item.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaKey, FaDownload, FaCog } from 'react-icons/fa';
import { useModal } from '../../context/ModalContext';

const QuizItem = ({ quiz, isSelected, onSelect, redo, onDelete, editable, selectible }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);
  const { configureConfirmModal, toggleConfirmModal  } = useModal();
  
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

  const calculateDaysSinceLastPerformance = (creationDateDate) => {
    const lastDate = new Date(creationDateDate);
    const currentDate = new Date();
    const differenceInTime = currentDate - lastDate;
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
  };
  const downloadQuiz = () => {
    const quizJson = JSON.stringify(quiz, null, 2);
    const blob = new Blob([quizJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    console.log("handling remove")
    configureConfirmModal({
      isOpen: true,
      title: "Confirm quiz deletion",
      message: "Are you sure you want to delete this quiz?",
      onClose: () =>  toggleConfirmModal(),
      buttonAClass: "cancel-button",
      buttonBClass: "delete-button",
      buttonAContent: "Cancel",
      buttonBContent: "Delete",
      onConfirm: () => {
        try {
          onDelete(quiz.id);
          toggleConfirmModal();
        } catch (error) {
          console.error("Error deleting quiz:", error);
        }
      }
    })
    // e.stopPropagation();
    // configureConfirmModal(
    //   true,
    //   "Confirm quiz deletion",
    //   "Are you sure you want to delete this quiz?",
    //   () => { console.log("Closing modal"); },
    //   "cancel-button",
    //   "delete-button",
    //   "Cancel",
    //   "Delete",
    //   () => {
    //     try {
    //       onDelete(quiz.id);
    //       toggleConfirmModal();
    //     } catch (error) {
    //       console.error("Error deleting quiz:", error);
    //     }
    //   },
    //   true
    // );
    
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
            <p>Days since last performance: {calculateDaysSinceLastPerformance
            
            (quiz.metadata.creationDate)}</p>
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
              <li className='download-element' onClick={downloadQuiz}>
                <FaDownload className="icon" /> Download
              </li>
              <li className='delete-element' onClick={handleRemoveClick}>
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
