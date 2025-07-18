import React, { useState } from "react";
import PerformQuiz from "./PerformQuiz";
import TrainingReport from "../report/TrainingReport";
import { useLocation, useNavigate } from "react-router-dom";

export default function PerformTraining() {
  const location = useLocation();
  const navigate = useNavigate();
  const training = location.state?.training;

  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [finished, setFinished] = useState(false);

  console.log("📦 Training loaded for execution:", training);

  if (!training) {
    return <div>No training data provided.</div>;
  }

  const sets = training.sets || [];
  const currentSet = sets[currentSetIndex];
  const quizzes = currentSet?.quizzes || [];
  const currentQuiz = quizzes[currentQuizIndex];

  console.log("🧩 Current Set/Quiz selection:");
  console.log("Set Index:", currentSetIndex);
  console.log("Quiz Index:", currentQuizIndex);
  console.log("Current Set:", currentSet);
  console.log("Current Quiz:", currentQuiz);

  const handleQuizCompleted = (completedQuiz) => {
    const clonedQuiz = JSON.parse(JSON.stringify(completedQuiz));
    console.log("✅ Quiz completed:", clonedQuiz);

    setCompletedQuizzes((prev) => {
      const updated = [...prev, clonedQuiz];
      console.log("🧮 Accumulated completed quizzes:", updated);
      return updated;
    });

    const nextQuizIndex = currentQuizIndex + 1;
    if (nextQuizIndex < quizzes.length) {
      setCurrentQuizIndex(nextQuizIndex);
    } else {
      const nextSetIndex = currentSetIndex + 1;
      if (nextSetIndex < sets.length) {
        setCurrentSetIndex(nextSetIndex);
        setCurrentQuizIndex(0);
      } else {
        setFinished(true);
      }
    }
  };

  const compiledTraining = {
    ...training,
    sets: training.sets.map((set) => ({
      ...set,
      quizzes: set.quizzes.map((quiz) => {
        const completed = completedQuizzes.find(
          (q) => q.quizId === quiz.quizId || q.id === quiz.quizId
        );
        return completed || quiz;
      }),
    })),
  };

  if (finished) {
    return (
      <TrainingReport
        completedTraining={compiledTraining}
        onBack={() => navigate("/arena")}
      />
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>
        Training: {training.title} - Set {currentSetIndex + 1} / {sets.length}
      </h2>
      <p>
        Quiz {currentQuizIndex + 1} / {quizzes.length}: {currentQuiz?.title}
      </p>
      <PerformQuiz
        key={currentQuiz.quizId || currentQuiz.id}
        quiz={currentQuiz}
        onComplete={handleQuizCompleted}
      />
    </div>
  );
}
