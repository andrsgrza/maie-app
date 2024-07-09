import React, { useState, useEffect, useRef } from 'react';
import './perform-quiz.css';
import QuizReport from '../report/QuizReport';

export default function PerformQuiz({ quiz, onComplete }) {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isMarked, setIsMarked] = useState(false);
    const [completedQuiz, setCompletedQuiz] = useState(JSON.parse(JSON.stringify(quiz)));


    const answerInputRef = useRef(null);    

    useEffect(() => {
        if (answerInputRef.current) {
            answerInputRef.current.focus();
        }
    }, [currentQuestionIndex, currentSectionIndex]);

    const restartQuiz = () => {
        setCurrentSectionIndex(0);
        setCurrentQuestionIndex(0)
        setUserAnswer('');
        setShowAnswer(false)        
        setIsAnswerCorrect(null)
        setAnswers([]);
        setIsMarked(false)
    }

    const handleNextQuestion = (e) => {                
        const userAnswer = answerInputRef.current.value;
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

    const handleNextSection = (e) => {
        const userAnswer = answerInputRef.current.value;
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
        console.log("Submitting quiz", answerInputRef.current.value);
        const userAnswer = answerInputRef.current.value;
        
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
            // Ensure that onComplete gets the updated quiz state
            setTimeout(() => {
                onComplete(updatedQuiz);
            }, 0);
            return updatedQuiz;
        });
        
        restartQuiz();
    }
    

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
                {showAnswer && (
                    <div className="answer-section">
                        <p>Correct Answer: {quiz.sections[currentSectionIndex].items[currentQuestionIndex].answer}</p>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="correct"
                                    onChange={() => handleMarkAnswer(true)}
                                />
                                Correct
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="correct"
                                    onChange={() => handleMarkAnswer(false)}
                                />
                                Incorrect
                            </label>
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
                    {isLastSection() ? "Quiz Completed" : "Next Section"}
                </button>
                
                )}
        </div>
    );
}
