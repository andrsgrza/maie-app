import React, { useState } from "react";
import { Link } from "react-router-dom";
import QuizSelector from "../QuizSelector";
import { MESSAGES } from "../../../common/constants";
import { useBanner } from "../../../context/BannerContext";
import useFetchQuizzes from "../../../hooks/useFetchQuizzes";
import { useModal } from "../../../context/ModalContext";

import "./quiz-selector-edit.css";

export default function QuizSelectorEdit() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { quizzes, setQuizzes, isLoading, error } = useFetchQuizzes();
  const { addBanner } = useBanner();
  const { configureImportModal, toggleImportModal } = useModal();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openImportModal = () => {
    configureImportModal({
      isOpen: true,
      title: "Import Quiz",
      onClose: () => toggleImportModal(),
      postImport: postImportQuiz,
    });
    setIsDropdownOpen(false);
  };

  const postImportQuiz = (res) => {
    addBanner(
      MESSAGES.API_MESSAGES.POST_QUIZ[res.status].TYPE,
      MESSAGES.API_MESSAGES.POST_QUIZ[res.status].TITLE,
      MESSAGES.API_MESSAGES.POST_QUIZ[res.status].MESSAGE
    );
    if (res.status >= 200 && res.status < 300) {
      toggleImportModal();
      setQuizzes((prevQuizzes) => [...prevQuizzes, res.data]);
    }
  };

  return (
    <div className="quiz-selector-wrapper centered-container">
      <QuizSelector
        quizzes={quizzes}
        setQuizzes={setQuizzes}
        editable={true}
        isLoading={isLoading}
        error={error}
      />
      <div className="add-quiz-wrapper">
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/create-quiz" className="dropdown-item button-link">
              Create New Quiz
            </Link>
            <button className="dropdown-item" onClick={openImportModal}>
              Import JSON
            </button>
          </div>
        )}
      </div>
      <button className="add-quiz-button" onClick={toggleDropdown}>
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
}
