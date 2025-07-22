import React, { useState } from "react";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "../../common/modal/Modal";
import { CreateFromExecution } from "../quiz/QuizManager";
import "./quiz-report.css";

export default function QuizReport({ completedQuiz }) {
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

  const [modalOpen, setModalOpen] = useState(false);
  const [previewQuiz, setPreviewQuiz] = useState(null);

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
        <button className="basic-button" onClick={() => setModalOpen(true)}>
          Crear quiz desde ejecución
        </button>
      </div>

      {modalOpen && (
        <Modal>
          <ModalHeader
            title="Create Quiz From Execution"
            onClose={() => setModalOpen(false)}
          />
          <ModalBody>
            <CreateFromExecution
              executedQuiz={completedQuiz}
              onQuizChanged={setPreviewQuiz}
            />
            {previewQuiz && (
              <pre className="debug-box" style={{ marginTop: "1rem" }}>
                {JSON.stringify(previewQuiz, null, 2)}
              </pre>
            )}
          </ModalBody>
          <ModalFooter>
            <button
              className="secondary-button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="primary-button"
              onClick={() => {
                if (previewQuiz) {
                  console.log("✅ New quiz to save:", previewQuiz);
                  setModalOpen(false);
                }
              }}
              disabled={!previewQuiz}
            >
              Add
            </button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
