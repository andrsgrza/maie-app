import React, { useState, useEffect } from 'react';
import quiz1 from '../../../resources/demo-quizes/quiz_title.json';
import quiz2 from '../../../resources/demo-quizes/quiz.json'; // Add more quizzes as needed
import QuizItem from './QuizItem';
import './quiz-selector.css';

const quizzes = [quiz1, quiz2]; // Array of quizzes

const QuizSelector = ({letsSelect}) => {
    const [selectedQuizzes, setSelectedQuizzes] = useState([]);

    useEffect(() => {
        // Initialize the selected property for each quiz
        quizzes.forEach(quiz => quiz.selected = false);
    }, []);

    const handleSelectQuiz = (selectedQuiz) => {
        setSelectedQuizzes(prevSelectedQuizzes => {
            const isAlreadySelected = prevSelectedQuizzes.some(quiz => quiz['quiz-id'] === selectedQuiz['quiz-id']);
            if (isAlreadySelected) {
                return prevSelectedQuizzes.filter(quiz => quiz['quiz-id'] !== selectedQuiz['quiz-id']);
            } else {
                return [...prevSelectedQuizzes, selectedQuiz];
            }
        });
    };

    const calculateDaysSinceLastPerformance = (lastPerformedDate) => {
        const lastDate = new Date(lastPerformedDate);
        const currentDate = new Date();
        const differenceInTime = currentDate - lastDate;
        return Math.floor(differenceInTime / (1000 * 3600 * 24));
    };

    return (
        <div className="quiz-selector">
            {quizzes.map((quiz) => (
                <QuizItem
                    key={quiz['quiz-id']}
                    quiz={quiz}
                    isSelected={selectedQuizzes.some(selectedQuiz => selectedQuiz['quiz-id'] === quiz['quiz-id'])}
                    onSelect={() => handleSelectQuiz(quiz)}
                />
            ))}
            <div>{JSON.stringify(selectedQuizzes, null, 2)}</div>
            <button onClick={() => letsSelect(selectedQuizzes)}>Start Training</button>
        </div>        
    );
};

export default QuizSelector;
