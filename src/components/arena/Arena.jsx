import React from "react";
import "./arena.css";
import { useNavigate } from "react-router-dom";

const Arena = () => {
  const navigate = useNavigate();

  const handleQuickQuiz = () => {
    navigate("/arena/quick-quiz"); // por ahora puede redirigir al mismo PerformQuiz con un quiz default
  };

  const handleTraining = () => {
    navigate("/arena/start-training");
  };

  const handleScheduled = () => {
    navigate("/arena/scheduled-trainings");
  };

  return (
    <div className="arena-container">
      <h2 className="arena-title">Welcome to the Arena</h2>
      <div className="arena-cards">
        <div className="arena-card">
          <h3>🏋️ Ejecutar Training</h3>
          <p>
            Realiza un entrenamiento completo, con sets y quizzes organizados.
          </p>
          <button onClick={handleTraining}>Iniciar Training</button>
        </div>
        <div className="arena-card">
          <h3>⚡ Quiz Rápido</h3>
          <p>
            Resuelve un quiz sin estructura, ideal para repasar en poco tiempo.
          </p>
          <button onClick={handleQuickQuiz}>Iniciar Quiz</button>
        </div>
        <div className="arena-card">
          <h3>📆 Entrenamientos Agendados</h3>
          <p>Revisa tus trainings pendientes, programados o con due date.</p>
          <button onClick={handleScheduled}>Ver Agendados</button>
        </div>
      </div>
    </div>
  );
};

export default Arena;
