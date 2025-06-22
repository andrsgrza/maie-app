import React, { useState, useEffect, useRef } from "react";
import "./perform-quiz.css";
import QuizClient from "../../api/quiz-client";

export default function PerformQuiz({ quiz, onComplete }) {
  // const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isMarked, setIsMarked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // const [canGoNext, setCanGoNext] = useState(false);
  const [completedQuiz, setCompletedQuiz] = useState(null);

  const answerInputRef = useRef(null);

  useEffect(() => {
    setCompletedQuiz(quiz);
  }, [quiz]);

  useEffect(() => {
    if (answerInputRef.current) {
      answerInputRef.current.focus();
    }
  }, [currentQuestionIndex, currentSectionIndex]);

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (showAnswer) {
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "c") {
          handleMarkAnswer(true);
        } else if (
          event.key === "ArrowRight" ||
          event.key.toLowerCase() === "m"
        ) {
          handleMarkAnswer(false);
        }
      }
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevent default behavior
        if (isMarked) {
          if (isLastQuestionInSection()) {
            if (isLastSection()) {
              handleSubmitQuiz();
            } else {
              handleNextSection();
            }
          } else {
            handleNextQuestion();
          }
        } else if (userAnswer.trim() !== "") {
          handleSubmitAnswer();
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [showAnswer, userAnswer, isMarked]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior
      const answer = answerInputRef.current.value.trim(); // Trim to handle spaces
      if (userAnswer.trim() !== "") {
        handleSubmitAnswer();
      } else {
      }
    }
  };

  // const fetchQuiz = async () => {
  //   try {
  //     const quiz = await QuizClient.getQuizById(quizId);
  //     setCurrentQuiz(quiz);
  //     setIsLoaded(true);
  //   } catch (error) {}
  // };

  const restartQuiz = () => {
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setShowAnswer(false);
    setIsAnswerCorrect(null);
    setIsMarked(false);
  };

  const handleNextQuestion = () => {
    setCompletedQuiz((prev) => {
      const newSections = [...prev.sections];
      newSections[currentSectionIndex].items[currentQuestionIndex] = {
        ...newSections[currentSectionIndex].items[currentQuestionIndex],
        userAnswer,
        isAnswerCorrect,
      };
      return {
        ...prev,
        sections: newSections,
      };
    });
    setShowAnswer(false);
    setIsAnswerCorrect(null);
    setUserAnswer("");
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setIsMarked(false);
  };

  const handleNextSection = () => {
    setCompletedQuiz((prev) => {
      const newSections = [...prev.sections];
      newSections[currentSectionIndex].items[currentQuestionIndex] = {
        ...newSections[currentSectionIndex].items[currentQuestionIndex],
        userAnswer,
        isAnswerCorrect,
      };
      return {
        ...prev,
        sections: newSections,
      };
    });
    setShowAnswer(false);
    setIsAnswerCorrect(null);
    setUserAnswer("");
    setCurrentSectionIndex(currentSectionIndex + 1);
    setCurrentQuestionIndex(0);
    setIsMarked(false);
  };

  const handleSubmitAnswer = () => {
    setShowAnswer(true);
  };

  const handleMarkAnswer = (isCorrect) => {
    setIsAnswerCorrect(isCorrect);
    setIsMarked(true);
  };

  const handleSubmitQuiz = () => {
    setCompletedQuiz((prev) => {
      const newSections = [...prev.sections];
      newSections[currentSectionIndex].items[currentQuestionIndex] = {
        ...newSections[currentSectionIndex].items[currentQuestionIndex],
        userAnswer,
        isAnswerCorrect,
      };
      const updatedQuiz = {
        ...prev,
        sections: newSections,
      };
      setTimeout(() => {
        onComplete(updatedQuiz);
      }, 0);
      return updatedQuiz;
    });
    restartQuiz();
  };

  const isLastQuestionInSection = () => {
    return (
      currentQuestionIndex >=
      quiz.sections[currentSectionIndex].items.length - 1
    );
  };

  const isLastSection = () => {
    return currentSectionIndex >= quiz.sections.length - 1;
  };

  return (
    <>
      <div className="perform-quiz-container">
        <h2 className="quiz-title">{quiz.title}</h2>
        <div className="section-container">
          <h3 className="section-title">
            {quiz.sections[currentSectionIndex].title}
          </h3>
          <div className="question-section">
            <h3 className="question-text">
              {
                quiz.sections[currentSectionIndex].items[currentQuestionIndex]
                  .question
              }
            </h3>
            <textarea
              className="answer-input"
              placeholder="Write here your answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              ref={answerInputRef}
              disabled={showAnswer}
            />
            {!showAnswer && (
              <div className="button-group">
                <button
                  className="quiz-button"
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim()}
                >
                  Submit
                </button>
                {/* <button
                  className="quiz-button"
                  disabled={!canGoNext}
                  onClick={() =>
                    setCurrentQuestionIndex(currentQuestionIndex + 1)
                  }
                >
                  Next Question
                </button> */}
              </div>
            )}
            {showAnswer && (
              <div className="answer-section">
                <h4>Correct Answer:</h4>
                <p>
                  {
                    quiz.sections[currentSectionIndex].items[
                      currentQuestionIndex
                    ].answer
                  }
                </p>
                <div className="button-group">
                  <button
                    className={`mark-button ${
                      isAnswerCorrect === true ? "selected correct" : ""
                    }`}
                    onClick={() => handleMarkAnswer(true)}
                  >
                    Correct
                  </button>
                  <button
                    className={`mark-button ${
                      isAnswerCorrect === false ? "selected incorrect" : ""
                    }`}
                    onClick={() => handleMarkAnswer(false)}
                  >
                    Incorrect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
