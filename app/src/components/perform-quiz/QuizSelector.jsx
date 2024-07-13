import React, { useState, useEffect } from 'react';

import QuizItem from './QuizItem';
import './quiz-selector.css';

const QuizSelector = ({quizzes, onSelected}) => {
    const [selectedQuizzes, setSelectedQuizzes] = useState([]);

    useEffect(() => {
        // Initialize the selected property for each quiz
        quizzes.forEach(quiz => quiz.selected = false);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (selectedQuizzes.length > 0) {
                if (event.key === 'Enter') {
                    onSelected(selectedQuizzes)
                } 
            }
           

        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedQuizzes]);

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
        <div className="quiz-selector ">
            {quizzes.map((quiz) => (
                <React.Fragment key={quiz['quiz-id']}>
                    <QuizItem
                        key={quiz['quiz-id']}
                        quiz={quiz}
                        isSelected={selectedQuizzes.some(selectedQuiz => selectedQuiz['quiz-id'] === quiz['quiz-id'])}
                        onSelect={() => handleSelectQuiz(quiz)}
                        redo={false}
                    />
                    {quiz.redo && (
                        <QuizItem
                            key={`${quiz['quiz-id']}-redo`}
                            quiz={quiz}
                            isSelected={selectedQuizzes.some(selectedQuiz => selectedQuiz['quiz-id'] === quiz['quiz-id'])}
                            onSelect={() => handleSelectQuiz(quiz)}
                            redo={true}
                        />
                    )}
                </React.Fragment>
            ))}            
            <button className="basic-button" onClick={() => onSelected(selectedQuizzes)}>Start Training</button>
        </div>        
    );
};

export default QuizSelector;
