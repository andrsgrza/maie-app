import React from "react";
import "./arena.css";

export default function Arena() {
  return (
    <div className="arena-container">
      <h1>Welcome to the Arena</h1>

      {/* 1. Quick Quiz Execution */}
      <section className="arena-section">
        <h2>Quick Quiz</h2>
        <p>Select a quiz to perform a quick practice session.</p>
        {/* TODO: QuizSelectorPerform for quick start */}
      </section>

      {/* 2. Training Execution */}
      <section className="arena-section">
        <h2>My Trainings</h2>
        <p>Continue or start a training session.</p>
        {/* TODO: TrainingSelector or Resume interface */}
      </section>

      {/* 3. Schedule a Training */}
      <section className="arena-section">
        <h2>Schedule Training</h2>
        <p>Pick a training and set a due date to get reminders.</p>
        {/* TODO: ScheduleTrainingForm */}
      </section>

      {/* 4. Clear Out Incomplete Trainings */}
      <section className="arena-section">
        <h2>Clear Out</h2>
        <p>Resume or complete trainings based on past mistakes.</p>
        {/* TODO: ClearOutManager */}
      </section>

      {/* 5. Create from Mistakes */}
      <section className="arena-section">
        <h2>Create From Mistakes</h2>
        <p>Generate new quizzes/trainings from previous incorrect answers.</p>
        {/* TODO: PastReportsAnalyzer */}
      </section>
    </div>
  );
}
