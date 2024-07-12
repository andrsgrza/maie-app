import React, { useState } from 'react';
import QuizSelector from './QuizSelector';
import PerformQuiz from './PerformQuiz';
import './quiz-performer.css';
import QuizReport from '../report/QuizReport';
import quiz4 from '../../../resources/demo-quizes/single-question-multiple-sections.json';
import quiz3 from '../../../resources/demo-quizes/single-question-single-section.json';
import quiz1 from '../../../resources/demo-quizes/quiz_title.json';
import quiz2 from '../../../resources/demo-quizes/quiz.json'; 
import quiz5 from '../../../resources/demo-quizes/control.json'; 

export default function QuizPerformer() {
    const [selectedQuizzes, setSelectedQuizzes] = useState([]); 
    const [completedQuizzes, setCompletedQuizzes] = useState([]); 
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0); 
    const [allQuizzesCompleted, setAllQuizzesCompleted] = useState(false);

    const loadQuizzes = () => {
        return [quiz1, quiz2, quiz3, quiz4, quiz5];
    }
    const quizzes = loadQuizzes();

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
                    <QuizSelector quizzes={quizzes} onSelected={handleQuizzesSelected} />
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
