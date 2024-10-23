import React, { useState, useEffect } from 'react';
import QuizClient from '../../api/quiz-client';
import QuizItem from '../perform-quiz/QuizItem';
import ErrorBanner from '../../common/banner/Banner';
import './quiz-selector.css';
import { MESSAGES } from '../../common/constants';
import { useBanner } from '../../context/BannerContext';
import { useNavigate } from 'react-router-dom';


const QuizSelector = ({quizzes, setQuizzes, onSelected, selectible, editable, isLoading, error }) => {

    const [selectedQuizzes, setSelectedQuizzes] = useState([]);
    const [startTrainingEnabled, setStartTrainingEnabled] = useState(false);
    const { addBanner } = useBanner();
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize the selected property for each quiz
        quizzes.forEach(quiz => quiz.selected = false);
    }, []);

    useEffect(() => {        
        setStartTrainingEnabled(selectedQuizzes.length > 0);
    }, [selectedQuizzes]);    

    useEffect(() => {
        const handleKeyDown = (event) => {            
            if (selectedQuizzes.length > 0) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent default behavior
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
        if(!selectible) {
            return;
        }
        setSelectedQuizzes(prevSelectedQuizzes => {
            const isAlreadySelected = prevSelectedQuizzes.some(quiz => quiz['id'] === selectedQuiz['id']);
            if (isAlreadySelected) {
                return prevSelectedQuizzes.filter(quiz => quiz['id'] !== selectedQuiz['id']);
            } else {
                return [...prevSelectedQuizzes, selectedQuiz];
            }
        });
    };

    const onDeleteQuiz = async (quizId) => {
        try {
            const response = await QuizClient.deleteQuiz(quizId);
            console.log('response', response)
            setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };


    return (
        <div className="quiz-selector"> 
            {isLoading ? <pre>Loading</pre> : (
                quizzes.map((quiz) => {
                    return (
                        <React.Fragment key={quiz['id']}>                        
                            <QuizItem
                                key={quiz['id']}
                                quiz={quiz}
                                selectible={selectible}
                                editable={editable}
                                isSelected={selectedQuizzes.some(selectedQuiz => selectedQuiz['id'] === quiz['id'])}
                                onSelect={() => handleSelectQuiz(quiz)}
                                redo={false}
                                onDelete={onDeleteQuiz}
                            />
                        </React.Fragment>
                    );
                })
            )}
            {selectible && <button className="basic-button"
                    onClick={() => onSelected(selectedQuizzes)}
                    disabled={!startTrainingEnabled}>
                Start Training
            </button>}
        </div>
    );
};

export default QuizSelector;
