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
   
    const handleKeyDown = (event) => {        
        console.log("TOP",event)
        console.log("top event in instance of OF OBJECT", event instanceof(Object))
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent default behavior
            const answer = answerInputRef.current.value.trim(); // Trim to handle spaces
            console.log("VALUE", answer ? "not undefined" : "is undefined", answerInputRef.current);
            if (userAnswer.trim() !== '') {
                handleSubmitAnswer();
            } else {
                console.log("Textarea is empty, not submitting answer.");
            }
        }
    };
    

    useEffect(() => {
        const handleGlobalKeyDown = (event) => {       
            console.log("global",event)     
            if (showAnswer) {
                if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'c') {
                    handleMarkAnswer(true);
                } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'm') {
                    handleMarkAnswer(false);
                }
            }
            console.log("global event is isntaine opf OF OBJECT", event instanceof(Object))
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault(); // Prevent default behavior
                if(isMarked){
                    console.log("MARKESD")
                    if(isLastQuestionInSection()){
                        if(isLastSection()){
                            handleSubmitQuiz();
                        }else{
                            handleNextSection();
                        }
                    }else{
                        handleNextQuestion();
                    }                
                } else if(userAnswer.trim() !== ''){
                    console.log("ANSWER",userAnswer.trim());
                    handleSubmitAnswer(); 
                } 
            } 

        }
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
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
        console.log("Submitting")       
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
                <textarea
                    name="answer-input"
                    placeholder="Write here your answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={handleKeyDown} // Add this line
                    ref={answerInputRef}
                    disabled={showAnswer}
                />
                {!showAnswer && (
                    <div>                        
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
                        <h4>Correct Answer:<br></br><br></br>{quiz.sections[currentSectionIndex].items[currentQuestionIndex].answer}</h4>
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
