import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PerformQuiz from "./PerformQuiz";

export default function PerformTraining() {
  const location = useLocation();
  const navigate = useNavigate();
  const training = location.state?.training;
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);

  useEffect(() => {
    console.log("🔁 Starting training", training);
  }, [training]);

  if (!training || !training.sets?.length) return <div>No training loaded</div>;

  const allQuizzes = training.sets.flatMap(
    (set) => set.resources || set.quizzes || []
  );

  const handleQuizComplete = (completedQuiz) => {
    const updatedCompleted = [...completedQuizzes, completedQuiz];
    setCompletedQuizzes(updatedCompleted);

    if (currentQuizIndex + 1 < allQuizzes.length) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      const completedTraining = {
        ...training,
        sets: training.sets.map((set) => ({
          ...set,
          resources: (set.resources || set.quizzes || []).map(
            (quiz) =>
              updatedCompleted.find((q) => q.quizId === quiz.quizId) || quiz
          ),
        })),
        lastPerformed: new Date().toISOString(),
      };
      console.log("✅ Training completed:", completedTraining);
      navigate("/training-report", {
        state: { completedTraining },
      });
    }
  };

  return (
    <PerformQuiz
      key={allQuizzes[currentQuizIndex].quizId}
      quiz={allQuizzes[currentQuizIndex]}
      onComplete={handleQuizComplete}
    />
  );
}
