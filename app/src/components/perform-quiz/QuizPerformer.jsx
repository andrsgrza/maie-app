import React, { useState, useEffect } from 'react';
import QuizSelectorPerform from '../quiz-selector/quiz-selector-wrapper/QuizSelectorPerform';
import PerformQuiz from './PerformQuiz';
import './quiz-performer.css';
import QuizReport from '../report/QuizReport';

export default function QuizPerformer() {
    const [selectedQuizzes, setSelectedQuizzes] = useState([]); 
    const [completedQuizzes, setCompletedQuizzes] = useState([]); 
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0); 
    const [allQuizzesCompleted, setAllQuizzesCompleted] = useState(false);

    const handleQuizzesSelected = (quizzes) => {        
        setSelectedQuizzes(quizzes);
        setCurrentQuizIndex(0);
    };

    const handleSubmitQuiz = (completedQuiz) => {
        setCompletedQuizzes(prevState => [...prevState, completedQuiz]);
        setCurrentQuizIndex(prevIndex => prevIndex + 1);

        if (currentQuizIndex >= selectedQuizzes.length - 1) {
            setAllQuizzesCompleted(true);
        }

        // Update the selected quizzes with the completed quiz
        setSelectedQuizzes(prevQuizzes => prevQuizzes.map((quiz, index) => 
            index === currentQuizIndex ? completedQuiz : quiz
        ));
    };

    const handleRefreshArena = () => {
        setSelectedQuizzes([]);
        setCompletedQuizzes([]);
        setCurrentQuizIndex(0);
        setAllQuizzesCompleted(false);
    }
    
    return (
        <div className="quiz-performer centered-container">            
            {selectedQuizzes.length === 0 && (
                <div className="quiz-selector">
                    <QuizSelectorPerform
                        onSelected={handleQuizzesSelected}
                    />
                </div>
            )}            
            {selectedQuizzes.length > 0 && currentQuizIndex < selectedQuizzes.length && (
                selectedQuizzes.map((quiz, index) => (
                    <div key={`perform-quiz-${index}`}>
                        {currentQuizIndex === index ? (
                            <PerformQuiz
                                quiz={quiz}
                                onComplete={handleSubmitQuiz}
                            />
                        ) : null}
                    </div>
                ))
            )}            
            {allQuizzesCompleted && (
                completedQuizzes.map((completedQuiz, index) => (
                    <div key={`quiz-report-${index}`}>
                        <QuizReport
                            completedQuiz={completedQuiz}                            
                        />                        
                    </div>                    
                ))                
            )}
             {allQuizzesCompleted && (
                <div>
                    <button className="basic-button" onClick={handleRefreshArena}>Go to Arena</button>
                </div>
            )}                        
        </div>
    );
}
