import React from "react";
import "./quiz-report.css"; // Reutilizamos los estilos del quiz report

export default function TrainingReport({ completedTraining, onBack }) {
  const { title, sets } = completedTraining;

  // Solo procesamos quizzes por ahora
  const quizzes = sets.flatMap((set) => set.quizzes || []);

  const allQuizSections = quizzes.flatMap((quiz) => quiz.sections || []);

  const totalQuestions = allQuizSections.reduce(
    (total, section) => total + section.items.length,
    0
  );
  const correctAnswers = allQuizSections.reduce(
    (total, section) =>
      total + section.items.filter((item) => item.isAnswerCorrect).length,
    0
  );
  const incorrectAnswers = totalQuestions - correctAnswers;

  return (
    <div className="quiz-report">
      <h1>{title} - Training Report</h1>

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

      {quizzes.map((quiz, quizIndex) => (
        <div key={quizIndex} className="quiz-section">
          <h3>{quiz.title}</h3>
          {quiz.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="quiz-section">
              <h4>{section.title}</h4>
              <div className="quiz-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Questions:</span>
                  <span className="summary-value">{section.items.length}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Correct Answers:</span>
                  <span className="summary-value">
                    {
                      section.items.filter((item) => item.isAnswerCorrect)
                        .length
                    }
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Incorrect Answers:</span>
                  <span className="summary-value">
                    {
                      section.items.filter((item) => !item.isAnswerCorrect)
                        .length
                    }
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
        </div>
      ))}

      {onBack && (
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      )}
    </div>
  );
}
