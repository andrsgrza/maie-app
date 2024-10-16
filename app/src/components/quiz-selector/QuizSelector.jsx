import React, { useState, useEffect } from 'react';
import QuizClient from '../../api/quiz-client';
import QuizItem from '../perform-quiz/QuizItem';
import ErrorBanner from '../../common/Banner';
import './quiz-selector.css';
import { MESSAGES } from '../../common/constants';
import { useBanner } from '../../context/BannerContext';
import { useNavigate } from 'react-router-dom';


const QuizSelector = ({quizzes, setQuizzes, onSelected, selectible, editable }) => {

    const [selectedQuizzes, setSelectedQuizzes] = useState([]);
    const [startTrainingEnabled, setStartTrainingEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { addBanner } = useBanner();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            const response = await QuizClient.getQuizzes();
            console.log('response', response.status)
            if(response.status >= 200 && response.status < 300){
                setQuizzes(response.data);

                setIsLoading(false);
            } else if ( response.status === 403 || response.status === 401) {                
                addBanner('error', MESSAGES.ERROR.STATUS_MESSAGES[response.status], MESSAGES.ERROR.FEATURE_MESSAGES.FETCH_QUIZZES);                
                navigate('/login')
            } else{
                addBanner(
                    'error',
                    MESSAGES.ERROR.STATUS_MESSAGES[response.status]
                        ? MESSAGES.ERROR.STATUS_MESSAGES[response.status]
                        : MESSAGES.ERROR.DEFAULT_TITLE
                    ,
                    MESSAGES.ERROR.FEATURE_MESSAGES.FETCH_QUIZZES
                );
                navigate('/error')
            }
        };
        fetchQuizzes();
        
    }, []);

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
            await QuizClient.deleteQuiz(quizId);
            setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const filterIncorrectItems = (quiz) => {
        return null
        const filteredSections = quiz.sections.map(section => {
            return {
                ...section,
                items: section.items.filter(item => !item.isAnswerCorrect)
            };
        }).filter(section => section.items.length > 0);

        if (filteredSections.length > 0) {
            return {
                ...quiz,
                'id': `R${quiz['id']}`,
                sections: filteredSections
            };
        } else {
            return null;
        }
    };

    return (
        <div className="quiz-selector"> 
            {isLoading ? <pre>Loading</pre> : (
                quizzes.map((quiz) => {
                    const incorrectQuiz = filterIncorrectItems(quiz);
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
                            {incorrectQuiz && (
                                <QuizItem
                                    key={incorrectQuiz['id']}
                                    quiz={incorrectQuiz}
                                    selectible={selectible}
                                    editable={editable}
                                    isSelected={selectedQuizzes.some(selectedQuiz => selectedQuiz['id'] === incorrectQuiz['id'])}
                                    onSelect={() => handleSelectQuiz(incorrectQuiz)}
                                    redo={true}
                                />
                            )}
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
