import React, { useState } from 'react';
import './perform-quiz.css';

export default function PerformQuiz() {
    const [quizzes, setQuizzes] = useState([]); // Placeholder for quizzes
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [answers, setAnswers] = useState([]);

    // Placeholder for loading quizzes from backend
    const loadQuizzes = () => {
        // This function will load quizzes from the backend
        // For now, we will use dummy data
        const dummyQuizzes = [
            {
                title: 'Sample Quiz',
                sections: [
                    {
                        title: 'Section 1',
                        items: [
                            { question: 'What is 2 + 2?', answer: '4' },
                            { question: 'What is the capital of France?', answer: 'Paris' }
                        ]
                    }
                ]
            }
        ];
        setQuizzes(dummyQuizzes);
    };

    const handleStartQuiz = (quiz) => {
        setCurrentQuiz(quiz);
        setCurrentQuestionIndex(0);
        setUserAnswer('');
        setShowAnswer(false);
        setIsAnswerCorrect(null);
        setAnswers([]);
    };

    const handleNextQuestion = () => {
        setShowAnswer(false);
        setIsAnswerCorrect(null);
        setUserAnswer('');
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handleCheckAnswer = () => {
        setShowAnswer(true);
    };

    const handleMarkAnswer = (isCorrect) => {
        setIsAnswerCorrect(isCorrect);
        setAnswers([...answers, { question: currentQuiz.sections[0].items[currentQuestionIndex].question, userAnswer, isCorrect }]);
    };

    return (
        <div className="perform-quiz">
            <h1>Perform Quiz</h1>
            {!currentQuiz ? (
                <div>
                    <button onClick={loadQuizzes}>Load Quizzes</button>
                    <ul>
                        {quizzes.map((quiz, index) => (
                            <li key={index}>
                                {quiz.title} <button onClick={() => handleStartQuiz(quiz)}>Start Quiz</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <h2>{currentQuiz.title}</h2>
                    <div className="question-section">
                        <h3>{currentQuiz.sections[0].items[currentQuestionIndex].question}</h3>
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                        />
                        <button onClick={handleCheckAnswer}>Check Answer</button>
                        {showAnswer && (
                            <div className="answer-section">
                                <p>Correct Answer: {currentQuiz.sections[0].items[currentQuestionIndex].answer}</p>
                                <button onClick={() => handleMarkAnswer(true)}>Mark as Correct</button>
                                <button onClick={() => handleMarkAnswer(false)}>Mark as Incorrect</button>
                            </div>
                        )}
                    </div>
                    {currentQuestionIndex < currentQuiz.sections[0].items.length - 1 && (
                        <button onClick={handleNextQuestion}>Next Question</button>
                    )}
                    {currentQuestionIndex === currentQuiz.sections[0].items.length - 1 && (
                        <div>
                            <h3>Quiz Completed!</h3>
                            <ul>
                                {answers.map((answer, index) => (
                                    <li key={index}>
                                        {answer.question} - Your Answer: {answer.userAnswer} - {answer.isCorrect ? 'Correct' : 'Incorrect'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
