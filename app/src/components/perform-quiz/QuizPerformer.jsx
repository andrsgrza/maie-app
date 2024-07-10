import React, { useState } from 'react';
import QuizSelector from './QuizSelector';
import PerformQuiz from './PerformQuiz';
import './quiz-performer.css';
import QuizReport from '../report/QuizReport';

export default function QuizPerformer() {
    const [selectedQuizzes, setSelectedQuizzes] = useState([]);
    const [completedQuizes, setCompletedQuizes] = useState([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [allQuizesCompleted, setAllQuizesCompleted] = useState(false);

    const handleQuizzesSelected = (quizzes) => {        
        setSelectedQuizzes(quizzes);
        setCurrentQuizIndex(0);
    };

    const handleSubmitQuiz = (completedQuiz) => {
        setCompletedQuizes(prevState => [...prevState, completedQuiz]);
        setCurrentQuizIndex(prevIndex => prevIndex + 1);

        if (currentQuizIndex >= selectedQuizzes.length - 1) {
            setAllQuizesCompleted(true);
        }
    };

    return (
        <div className="quiz-performer centered-container">
            {selectedQuizzes.length === 0 && (
                <div className="quiz-selector">
                    <QuizSelector letsSelect={handleQuizzesSelected} />
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
            {allQuizesCompleted && (
                completedQuizes.map((completedQuiz, index) => (
                    <div key={`quiz-report-${index}`}>
                        <QuizReport
                            completedQuiz={completedQuiz}
                        />
                    </div>
                ))
            )}            
        </div>
    );
}
