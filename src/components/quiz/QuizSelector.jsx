import React, { useState, useEffect, useCallback } from "react";
import QuizClient from "../../api/quiz-client";
import QuizItem from "../perform-quiz/QuizItem";
import ErrorBanner from "../../common/banner/Banner";
import "./quiz-selector.css";
import { MESSAGES } from "../../common/constants";
import { useBanner } from "../../context/BannerContext";
import { useNavigate } from "react-router-dom";
import ButtonBar from "../ButtonBar";

const QuizSelector = ({
  quizzes,
  setQuizzes,
  onSelected,
  selectible,
  editable,
  isLoading,
  error,
  hideStartButton = false,
  onSelectionChange,
}) => {
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [startTrainingEnabled, setStartTrainingEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedQuizzes);
    }
  }, [selectedQuizzes, onSelectionChange]);

  useEffect(() => {
    // Initialize the selected property for each quiz
    quizzes.forEach((quiz) => (quiz.selected = false));
  }, []);

  useEffect(() => {
    setStartTrainingEnabled(selectedQuizzes.length > 0);
  }, [selectedQuizzes]);

  const handleSubmitSelection = useCallback(() => {
    if (selectedQuizzes.length > 0 && onSelected) {
      onSelected();
    }
  }, [selectedQuizzes, onSelected]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedQuizzes.length > 0) {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSubmitSelection();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedQuizzes, handleSubmitSelection]);

  useEffect(() => {
    if (error === 404) {
    }
  }, [error]);

  const handleSelectQuiz = (selectedQuiz) => {
    if (!selectible) {
      return;
    }

    setSelectedQuizzes((prevSelectedQuizzes) => {
      const isAlreadySelected = prevSelectedQuizzes.some(
        (quiz) => quiz === selectedQuiz
      );
      if (isAlreadySelected) {
        return prevSelectedQuizzes.filter((quiz) => quiz !== selectedQuiz);
      } else {
        return [...prevSelectedQuizzes, selectedQuiz];
      }
    });
  };

  const onDeleteQuiz = async (quizId) => {
    try {
      const response = await QuizClient.deleteQuiz(quizId);

      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== quizId)
      );
    } catch (error) {}
  };

  const getContent = () => {
    if (quizzes.length === 0) {
      return (
        <h3>
          Try creating new quizzes, importing quizzes or requesting access for
          quizzes to other users
        </h3>
      );
    }
    return (
      <div className="quiz-selector">
        {quizzes.map((quiz) => (
          <QuizItem
            key={quiz["id"]}
            quiz={quiz}
            selectible={selectible}
            editable={editable}
            onSelect={handleSelectQuiz}
            onDelete={onDeleteQuiz}
            isSelected={selectedQuizzes.some(
              (selectedQuiz) => selectedQuiz["id"] === quiz["id"]
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="quiz-selector">
      {isLoading ? (
        <h3>Loading</h3>
      ) : (
        <div className="quiz-selector">{getContent()}</div>
      )}
    </div>
  );
};

export default QuizSelector;
