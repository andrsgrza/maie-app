import React, { useState, useEffect, useRef } from 'react';
import './perform-quiz.css';

export default function PerformQuiz({ quiz, onComplete }) {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);    
    const [isMarked, setIsMarked] = useState(false);
    const [completedQuiz, setCompletedQuiz] = useState(JSON.parse(JSON.stringify(quiz)));    

    const answerInputRef = useRef(null);

    useEffect(() => {
        if (answerInputRef.current) {
            answerInputRef.current.focus();
        }
    }, [currentQuestionIndex, currentSectionIndex]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (showAnswer) {
                if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'c') {
                    handleMarkAnswer(true);
                } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'm') {
                    handleMarkAnswer(false);
                }
            }
            if (event.key === 'Enter') {
                if(isMarked){
                    if(isLastQuestionInSection()){
                        if(isLastSection()){
                            handleSubmitQuiz();
                        }else{
                            handleNextSection();
                        }
                    }else{
                        handleNextQuestion();
                    }                
                } else{
                    handleSubmitAnswer(); 
                } 
            } 

        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showAnswer, userAnswer, isMarked]);

    const restartQuiz = () => {
        setCurrentSectionIndex(0);
        setCurrentQuestionIndex(0);
        setUserAnswer('');
        setShowAnswer(false);
        setIsAnswerCorrect(null);        
        setIsMarked(false);
    };

    const handleNextQuestion = () => {
        //const userAnswer = answerInputRef.current.value;
        setCompletedQuiz((prev) => {
            const newSections = [...prev.sections];
            newSections[currentSectionIndex].items[currentQuestionIndex] = {
                ...newSections[currentSectionIndex].items[currentQuestionIndex],
                userAnswer,
                isAnswerCorrect,
            };
            return {
                ...prev,
                sections: newSections,
            };
        });
        setShowAnswer(false);
        setIsAnswerCorrect(null);
        setUserAnswer('');
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsMarked(false);
    };

    const handleNextSection = () => {
        setCompletedQuiz((prev) => {
            const newSections = [...prev.sections];
            newSections[currentSectionIndex].items[currentQuestionIndex] = {
                ...newSections[currentSectionIndex].items[currentQuestionIndex],
                userAnswer,
                isAnswerCorrect,
            };
            return {
                ...prev,
                sections: newSections,
            };
        });
        setShowAnswer(false);
        setIsAnswerCorrect(null);
        setUserAnswer('');
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentQuestionIndex(0);
        setIsMarked(false);
    };

    const handleSubmitAnswer = () => {        
        setShowAnswer(true);        
    };

    const handleMarkAnswer = (isCorrect) => {
        setIsAnswerCorrect(isCorrect);
        setIsMarked(true);
    };

    const handleSubmitQuiz = () => {
        setCompletedQuiz((prev) => {
            const newSections = [...prev.sections];
            newSections[currentSectionIndex].items[currentQuestionIndex] = {
                ...newSections[currentSectionIndex].items[currentQuestionIndex],
                userAnswer,
                isAnswerCorrect,
            };
            const updatedQuiz = {
                ...prev,
                sections: newSections,
            };
            setTimeout(() => {
                onComplete(updatedQuiz);
            }, 0);
            return updatedQuiz;
        });
        restartQuiz();
    };

    const isLastQuestionInSection = () => {
        return currentQuestionIndex >= quiz.sections[currentSectionIndex].items.length - 1;
    };

    const isLastSection = () => {
        return currentSectionIndex >= quiz.sections.length - 1;
    };

    return (
        <div className="perform-quiz">
            <h2>{quiz.title}</h2>
            
            <h3 className="section-title">{quiz.sections[currentSectionIndex].title}</h3>
            <div className="question-section">
                <h3>{quiz.sections[currentSectionIndex].items[currentQuestionIndex].question}</h3>
                
                {!showAnswer && (
                    <div>
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            ref={answerInputRef}
                        />
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={!userAnswer.trim()}
                            className={!userAnswer.trim() ? 'disabled' : ''}
                        >
                        Submit
                        </button>
                    </div>
                )}
                {showAnswer && (
                    <div className="answer-section">
                        <p>Correct Answer: {quiz.sections[currentSectionIndex].items[currentQuestionIndex].answer}</p>
                        <div className="button-group">
                            <button
                                onClick={() => handleMarkAnswer(true)}
                                className={`mark-button ${isAnswerCorrect === true ? 'selected' : ''}`}
                            >
                                Correct
                            </button>
                            <button
                                onClick={() => handleMarkAnswer(false)}
                                className={`mark-button ${isAnswerCorrect === false ? 'selected' : ''}`}
                            >
                                Incorrect
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {!isLastQuestionInSection() ? (
                <button
                    onClick={handleNextQuestion}
                    disabled={!isMarked}
                    className={!isMarked ? 'disabled' : ''}
                >
                    Next Question
                </button>
            ) : (
                <button
                    onClick={isLastSection() ? handleSubmitQuiz : handleNextSection}
                    disabled={!isMarked}
                    className={!isMarked ? 'disabled' : ''}
                >
                    {isLastSection() ? "Submit Quiz" : "Next Section"}
                </button>
            )}
        </div>
    );
}
