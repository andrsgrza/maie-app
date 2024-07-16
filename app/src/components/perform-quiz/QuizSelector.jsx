import React, { useState, useEffect } from 'react';

import QuizItem from './QuizItem';
import './quiz-selector.css';

const QuizSelector = ({ quizzes, onSelected }) => {
    const [selectedQuizzes, setSelectedQuizzes] = useState([]);

    useEffect(() => {
        // Initialize the selected property for each quiz
        quizzes.forEach(quiz => quiz.selected = false);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (selectedQuizzes.length > 0) {
                if (event.key === 'Enter') {
                    onSelected(selectedQuizzes);
                }
            }
        };
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

    const filterIncorrectItems = (quiz) => {
        const filteredSections = quiz.sections.map(section => {
            return {
                ...section,
                items: section.items.filter(item => !item.isAnswerCorrect)
            };
        }).filter(section => section.items.length > 0);

        if (filteredSections.length > 0) {
            return {
                ...quiz,
                'quiz-id': `R${quiz['quiz-id']}`,
                sections: filteredSections
            };
        } else {
            return null;
        }
    };

    return (
        <div className="quiz-selector ">
            {quizzes.map((quiz) => {
                const incorrectQuiz = filterIncorrectItems(quiz);

                return (
                    <React.Fragment key={quiz['quiz-id']}>
                        <QuizItem
                            key={quiz['quiz-id']}
                            quiz={quiz}
                            isSelected={selectedQuizzes.some(selectedQuiz => selectedQuiz['quiz-id'] === quiz['quiz-id'])}
                            onSelect={() => handleSelectQuiz(quiz)}
                            redo={false}
                        />
                        {incorrectQuiz && (
                            <QuizItem
                                key={incorrectQuiz['quiz-id']}
                                quiz={incorrectQuiz}
                                isSelected={selectedQuizzes.some(selectedQuiz => selectedQuiz['quiz-id'] === incorrectQuiz['quiz-id'])}
                                onSelect={() => handleSelectQuiz(incorrectQuiz)}
                                redo={true}
                            />
                        )}
                    </React.Fragment>
                );
            })}
            <button className="basic-button" onClick={() => onSelected(selectedQuizzes)}>Start Training</button>
        </div>
    );
};

export default QuizSelector;
