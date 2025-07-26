import React, { useState, useEffect, useRef } from "react";
import "./perform-quiz.css";

export default function PerformQuiz({ quiz, onComplete }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isMarkedCorrect, setIsMarkedCorrect] = useState(null);
  const [completedQuiz, setCompletedQuiz] = useState(quiz);
  const inputRef = useRef(null);

  useEffect(() => {}, [quiz]);

  // Validate quiz structure
  if (
    !quiz ||
    !quiz.sections?.length ||
    !quiz.sections[sectionIndex]?.items?.length
  ) {
    console.warn("❌ Invalid or empty quiz");
    return <div>Invalid or empty quiz</div>;
  }

  const currentSection = quiz.sections[sectionIndex];
  const currentItem = currentSection.items[questionIndex];

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [sectionIndex, questionIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      if (showAnswer) {
        if (e.key === "ArrowLeft" || e.key.toLowerCase() === "c") {
          handleMark(true);
        } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "m") {
          handleMark(false);
        }
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!showAnswer && userAnswer.trim()) {
          handleSubmit();
        } else if (showAnswer && isMarkedCorrect !== null) {
          handleNext();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showAnswer, userAnswer, isMarkedCorrect]);

  const handleSubmit = () => {
    setShowAnswer(true);
  };

  const handleMark = (isCorrect) => {
    setIsMarkedCorrect(isCorrect);
  };

  const handleNext = () => {
    const updatedSections = [...completedQuiz.sections];
    const item = updatedSections[sectionIndex].items[questionIndex];
    updatedSections[sectionIndex].items[questionIndex] = {
      ...item,
      userAnswer,
      isAnswerCorrect: isMarkedCorrect,
    };
    setCompletedQuiz({ ...completedQuiz, sections: updatedSections });

    const nextQuestion = questionIndex + 1;
    const nextSection = sectionIndex + 1;
    if (nextQuestion < currentSection.items.length) {
      setQuestionIndex(nextQuestion);
    } else if (nextSection < quiz.sections.length) {
      setSectionIndex(nextSection);
      setQuestionIndex(0);
    } else {
      if (onComplete)
        onComplete({ ...completedQuiz, sections: updatedSections });
      return;
    }

    setUserAnswer("");
    setShowAnswer(false);
    setIsMarkedCorrect(null);
  };

  return (
    <div className="perform-quiz-container">
      <h2 className="quiz-title">{quiz.title}</h2>
      <div className="section-container">
        <h3 className="section-title">{currentSection.title}</h3>
        <div className="question-section">
          <h3 className="question-text">{currentItem.question}</h3>
          <textarea
            ref={inputRef}
            className="answer-input"
            placeholder="Write your answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={showAnswer}
          />

          {!showAnswer && (
            <div className="button-group">
              <button
                className="quiz-button"
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
              >
                Submit
              </button>
            </div>
          )}

          {showAnswer && (
            <>
              <div className="answer-section">
                <h4>Correct Answer:</h4>
                <p>{currentItem.answer}</p>
              </div>
              <div className="button-group">
                <button
                  className={`mark-button ${
                    isMarkedCorrect === true ? "selected correct" : ""
                  }`}
                  onClick={() => handleMark(true)}
                >
                  Correct
                </button>
                <button
                  className={`mark-button ${
                    isMarkedCorrect === false ? "selected incorrect" : ""
                  }`}
                  onClick={() => handleMark(false)}
                >
                  Incorrect
                </button>
              </div>
              {isMarkedCorrect !== null && (
                <div className="button-group">
                  <button className="quiz-button" onClick={handleNext}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
