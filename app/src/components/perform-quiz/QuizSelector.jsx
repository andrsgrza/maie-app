import React, { useState } from 'react';
import quiz1 from '../../../resources/demo-quizes/quiz_title.json';
import quiz2 from '../../../resources/demo-quizes/quiz.json'; // Add more quizzes as needed

const quizzes = [quiz1, quiz2]; // Array of quizzes

export default function QuizSelector({ onSelect }) {
    const [selectedQuizzes, setSelectedQuizzes] = useState([]);

    const handleToggleQuiz = (quiz) => {
        setSelectedQuizzes((prevSelected) => {
            if (prevSelected.includes(quiz)) {
                return prevSelected.filter((q) => q !== quiz);
            } else {
                return [...prevSelected, quiz];
            }
        });
    };

    const handleStartSelectedQuizzes = () => {
        onSelect(selectedQuizzes);
    };

    return (
        <div className="quiz-selector">
            <h2>Select Quizzes</h2>
            <ul>
                {quizzes.map((quiz, index) => (
                    <li key={index}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedQuizzes.includes(quiz)}
                                onChange={() => handleToggleQuiz(quiz)}
                            />
                            {quiz.title}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleStartSelectedQuizzes} disabled={selectedQuizzes.length === 0}>
                Start Selected Quizzes
            </button>
        </div>
    );
}
