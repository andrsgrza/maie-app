import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import QuizCreator from '../create-quiz/QuizCreator';
import QuizPerformer from '../perform-quiz/QuizPerformer';
import './main-page.css';
import QuizSelectorEdit from '../quiz-selector/quiz-selector-wrapper/QuizSelectorEdit';

export default function MainPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
            <div className="main-page">
                
                <div className={`left-menu ${isMenuOpen ? 'open' : 'collapsed'}`}>
                    <nav>
                        <ul>
                            <li><Link to="/my-quizzes">My Trainings</Link></li>
                            <li><Link to="/perform-quiz">Arena</Link></li>                            
                        </ul>
                    </nav>
                </div>
                <button 
                    onClick={toggleMenu} 
                    className={`menu-toggle ${isMenuOpen ? 'menu-open' : 'menu-collapsed'}`}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
                <div className="content">
                    <Routes>
                        <Route path="/create-quiz" element={<QuizCreator />} />
                        <Route path="/perform-quiz" element={<QuizPerformer/>} />
                        <Route path="/my-quizzes" element={<QuizSelectorEdit />} />
                        <Route path="/" element={() => <div>Dashboard</div>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
