import React, { useState } from "react";
import "./quiz-report.css";
import { cleanQuizData, filterQuizByItems } from "../../utils/quizUtils.js";
import QuizClient from "../../api/quiz-client";
import { UserClient } from "../../api/user-client";
import { useModal } from "../../context/ModalContext";
import ResourceList from "../resource/ResourceList";
import ResourceCard from "../resource/ResourceCard";

const QuizReport = ({ completedQuiz }) => {
  const { title, sections } = completedQuiz;
  const totalQuestions = sections.reduce(
    (total, section) => total + section.items.length,
    0
  );
  const correctAnswers = sections.reduce(
    (total, section) =>
      total + section.items.filter((item) => item.isAnswerCorrect).length,
    0
  );
  const incorrectAnswers = totalQuestions - correctAnswers;

  const [savingTitle, setSavingTitle] = useState(`Retry Quiz - ${title}`);
  const [quizSaved, setQuizSaved] = useState(false);
  const { configureSelectModal, toggleSelectModal } = useModal();

  const handleSaveWrongAnswers = async () => {
    const wrongItems = sections.flatMap((section) =>
      section.items.filter((item) => !item.isAnswerCorrect)
    );
    const quizCopy = filterQuizByItems(completedQuiz, wrongItems);
    quizCopy.title = savingTitle;
    const savedQuiz = await QuizClient.postQuiz(quizCopy);
    const userId = await UserClient.whoAmI();
    setQuizSaved(true);
  };

  const handleManualSelection = () => {
    const flatItems = sections.flatMap((section) => section.items);
    configureSelectModal({
      isOpen: true,
      title: "Select Questions to Save",
      selector: (setSelectedItems) => (
        <div className="manual-selection-list">
          {flatItems.map((item, index) => (
            <div
              key={index}
              className="manual-selection-item"
              onClick={() =>
                setSelectedItems((prev) => {
                  const exists = prev.includes(item);
                  return exists
                    ? prev.filter((i) => i !== item)
                    : [...prev, item];
                })
              }
            >
              <p>
                <strong>{item.question}</strong>
              </p>
              <p>Your Answer: {item.userAnswer}</p>
              <p>Correct Answer: {item.answer}</p>
            </div>
          ))}
        </div>
      ),
      onAdd: async (selectedItems) => {
        const quizCopy = filterQuizByItems(completedQuiz, selectedItems);
        quizCopy.title = savingTitle;
        const savedQuiz = await QuizClient.postQuiz(quizCopy);
        const userId = await UserClient.whoAmI();
        setQuizSaved(true);
        toggleSelectModal();
      },
      onClose: () => toggleSelectModal(),
    });
  };

  return (
    <div className="quiz-report">
      <h1>{title} - Quiz Report</h1>
      <div className="overall-summary">
        <h3>Overall Summary</h3>
        <div className="quiz-summary">
          <div className="summary-item">
            <span className="summary-label">Total Questions:</span>
            <span className="summary-value">{totalQuestions}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Correct Answers:</span>
            <span className="summary-value">{correctAnswers}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Incorrect Answers:</span>
            <span className="summary-value">{incorrectAnswers}</span>
          </div>
        </div>
      </div>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="quiz-section">
          <h3>{section.title}</h3>
          <div className="quiz-summary">
            <div className="summary-item">
              <span className="summary-label">Total Questions:</span>
              <span className="summary-value">{section.items.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Correct Answers:</span>
              <span className="summary-value">
                {section.items.filter((item) => item.isAnswerCorrect).length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Incorrect Answers:</span>
              <span className="summary-value">
                {section.items.filter((item) => !item.isAnswerCorrect).length}
              </span>
            </div>
          </div>
          <ul className="quiz-details">
            {section.items.map((item, index) => (
              <li
                key={index}
                className={`report-item ${
                  item.isAnswerCorrect ? "correct" : "incorrect"
                }`}
              >
                <p>
                  <strong>{item.question}</strong>
                </p>
                <p>
                  <strong>Your Answer:</strong> {item.userAnswer}
                </p>
                <p>
                  <strong>Correct Answer:</strong> {item.answer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="save-options">
        <input
          type="text"
          value={savingTitle}
          onChange={(e) => setSavingTitle(e.target.value)}
          placeholder="Quiz title"
          className="title-input"
        />
        <button className="basic-button" onClick={handleSaveWrongAnswers}>
          Save incorrect answers
        </button>
        <button className="basic-button" onClick={handleManualSelection}>
          Choose questions manually
        </button>
      </div>

      {quizSaved && (
        <div className="redo-quiz-saved-message">
          <p>Quiz '{savingTitle}' successfully saved</p>
        </div>
      )}
    </div>
  );
};

export default QuizReport;
