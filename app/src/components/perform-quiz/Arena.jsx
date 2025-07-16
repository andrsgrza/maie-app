import React, { useState, useEffect } from "react";
import PerformQuiz from "./PerformQuiz";
import QuizReport from "../report/QuizReport";
import SectionSelector from "../quiz-selector/SectionSelector";
import "./perform-quiz.css";
import ButtonBar from "../ButtonBar";
import TrainingManager from "./TrainingManager";

export default function Arena() {
  const [configuredSets, setConfiguredSets] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);

  const handleConfigurationComplete = (trainingConfig) => {
    setConfiguredSets(trainingConfig.sets || []);
    setCurrentSetIndex(0);
    setCurrentQuizIndex(0);
    setCompletedQuizzes([]);
    setAllCompleted(false);
  };

  const handleSubmitQuiz = (completedQuiz) => {
    setCompletedQuizzes((prev) => [...prev, completedQuiz]);

    const currentSet = configuredSets[currentSetIndex];

    if (currentQuizIndex < currentSet.quizzes.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else if (currentSetIndex < configuredSets.length - 1) {
      setCurrentSetIndex((prev) => prev + 1);
      setCurrentQuizIndex(0);
    } else {
      setAllCompleted(true);
    }
  };

  const handleRestart = () => {
    setConfiguredSets([]);
    setCurrentSetIndex(0);
    setCurrentQuizIndex(0);
    setCompletedQuizzes([]);
    setAllCompleted(false);
  };

  const renderCurrentQuiz = () => {
    const currentSet = configuredSets[currentSetIndex];
    const quiz = currentSet.quizzes[currentQuizIndex];

    return (
      <div className="quiz-performer centered-container">
        <h3>{currentSet.title}</h3>
        <PerformQuiz quiz={quiz} onComplete={handleSubmitQuiz} />
      </div>
    );
  };

  return (
    <div className="quiz-performer centered-container">
      {configuredSets.length === 0 && !allCompleted && (
        <TrainingManager
          onConfigurationComplete={handleConfigurationComplete}
        />
      )}

      {configuredSets.length > 0 && !allCompleted && renderCurrentQuiz()}

      {allCompleted && (
        <>
          <h3>Training Complete!</h3>
          {completedQuizzes.map((quiz, index) => (
            <div key={index} className="quiz-report-container">
              <QuizReport completedQuiz={quiz} />
            </div>
          ))}
          <ButtonBar
            centerItems={[
              {
                label: "Restart Arena",
                contentType: "button",
                onClick: handleRestart,
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
