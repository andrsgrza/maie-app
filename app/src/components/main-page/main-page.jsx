import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import QuizCreator from '../create-quiz/QuizCreator';
import PerformQuiz from '../perform-quiz/PerformQuiz';
import './main-page.css';
import logo from '../../../resources/logo.jpeg'; // Correctly import the image

export default function MainPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
            <div className="main-page">
                <button 
                    onClick={toggleMenu} 
                    className={`menu-toggle ${isMenuOpen ? 'menu-open' : 'menu-collapsed'}`}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
                <div className={`left-menu ${isMenuOpen ? 'open' : 'collapsed'}`}>
                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="logo" />
                    </div>
                    <nav>
                        <ul>
                            <li><Link to="/create-quiz">Create Quiz</Link></li>
                            <li><Link to="/perform-quiz">Perform Quiz</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="content">
                    <Routes>
                        <Route path="/create-quiz" element={<QuizCreator />} />
                        <Route path="/perform-quiz" element={<PerformQuiz />} />
                        <Route path="/" element={() => <div>Dashboard</div>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
