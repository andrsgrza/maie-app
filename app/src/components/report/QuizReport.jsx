import React, {useState} from 'react';
import './quiz-report.css';
import { cleanQuizData } from'/app/src/utils/quizUtils.js'

const QuizReport = ({ completedQuiz }) => {
    const { title, sections } = completedQuiz;
    const totalQuestions = sections.reduce((total, section) => total + section.items.length, 0);
    const correctAnswers = sections.reduce((total, section) => total + section.items.filter(item => item.isAnswerCorrect).length, 0);
    const incorrectAnswers = totalQuestions - correctAnswers;

    const [activated, setActivated] = useState(false);
    const handleSaveRedoQuiz = () => {
        const redoQuiz = cleanQuizData(completedQuiz);
        console.log(redoQuiz);
        setActivated(true);
    }


    return (
        <div className="quiz-report">            
            <h2>{title} - Quiz Report</h2>            
            <div className="overall-summary">
                <h3>Overall Summary</h3>
                <div className="quiz-summary">
                    <div className="summary-item">
                        <span className="summary-label">Total Questions:</span>
                        <span className="summary-value">{totalQuestions}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Correct Answers:</span>
                        <span className="summary-value">{correctAnswers}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Incorrect Answers:</span>
                        <span className="summary-value">{incorrectAnswers}</span>
                    </div>
                </div>
            </div>
            {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="quiz-section">
                    <h3>{section.title}</h3>
                    <div className="quiz-summary">
                        <div className="summary-item">
                            <span className="summary-label">Total Questions:</span>
                            <span className="summary-value">{section.items.length}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Correct Answers:</span>
                            <span className="summary-value">{section.items.filter(item => item.isAnswerCorrect).length}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Incorrect Answers:</span>
                            <span className="summary-value">{section.items.filter(item => !item.isAnswerCorrect).length}</span>
                        </div>
                    </div>
                    <ul className="quiz-details">
                        {section.items.map((item, index) => (
                            <li key={index} className={`quiz-item ${item.isAnswerCorrect ? 'correct' : 'incorrect'}`}>
                                <p><strong>{item.question}</strong> </p>
                                <p><strong>Your Answer:</strong> {item.userAnswer}</p>
                                <p><strong>Correct Answer:</strong> {item.answer}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}            
            <button className="basic-button" onClick={handleSaveRedoQuiz}>Save ReDo Quiz</button>
            {activated && (
                <p>
                    <pre>{JSON.stringify(completedQuiz, null, 2)}</pre>
                </p>
            )}
        </div>
    );
}

export default QuizReport;
