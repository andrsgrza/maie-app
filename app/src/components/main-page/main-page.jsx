import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import QuizCreator from '../create-quiz/QuizCreator';
import QuizPerformer from '../perform-quiz/QuizPerformer';
import './main-page.css';
import QuizSelectorEdit from '../quiz-selector/quiz-selector-wrapper/QuizSelectorEdit';
import Login from '../login/LoginForm';
import RegistryForm from '../login/RegistryForm';
import TopBar from './TopBar';
import SidebarMenu from './SidebarLoginMenu';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { UserClient } from '../../api/user-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BannerProvider } from '../../context/BannerContext';
import { ModalProvider } from '../../context/ModalContext';


export default function MainPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
            <MainPageContent 
                isMenuOpen={isMenuOpen}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                toggleMenu={toggleMenu}
            />
        </Router>
    );
}

function MainPageContent({ isMenuOpen, currentUser, setCurrentUser, toggleMenu }) {
    const navigate = useNavigate();
    const { authenticate, unauthenticate, isAuthenticated } = useAuth();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await UserClient.whoAmI();
                if(response.status >= 200 && response.status < 300) {
                    setCurrentUser(response.data);                    
                    authenticate();
                } else if( response.status === 401 || response.status === 403 ) {                        
                    setCurrentUser(null);                    
                    unauthenticate();
                } else {
                    setCurrentUser(null);
                    unauthenticate();
                    //navigate('/error')
                    console.error('Unexpected response status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching user data from main page:', error);
            }
          
        };
    
        verifyAuth();
    }, [navigate, setCurrentUser]);

    const Home = () =>  currentUser ? <h2>Welcome {currentUser.username}</h2> : <h2>Welcome. Login or register to start learning</h2>;
    const Profile = () => <h2>User Profile Page</h2>;
    const Error = () => <h2>There was en error</h2>;

    const TopNavButtonContainer = () => (
        <div className="sidebar-top-button-container">
            <button className='sidebar-button menu-open' onClick={toggleMenu}>✕</button>
            <button className='sidebar-button menu-open'>☰</button>
        </div>
    );

    const getNavigationMenu = () => (
        <div className={`left-menu ${isMenuOpen ? 'open' : 'collapsed'}`}>
            <TopNavButtonContainer />
            {isAuthenticated ? (
                <nav>
                    <ul>
                        <li><Link to="/my-quizzes">My Trainings</Link></li>
                        <li><Link to="/perform-quiz">Arena</Link></li>
                    </ul>
                </nav>
            ) : (<SidebarMenu />) }
        </div>
    );

    return (
        <>
            <div className="main-page">
                {getNavigationMenu()}
                <div className="content">
                    <ModalProvider>
                    <TopBar enableStart={isMenuOpen} openSidebar={toggleMenu} showMenu={currentUser ? true : false} />
                    <div className="inner-content"> 
                        <BannerProvider>
                        <Routes>
                            <Route path="/signup" element={<PublicRoute><RegistryForm /></PublicRoute>} />
                            <Route path="/login" element={<PublicRoute><Login setCurrentUser={setCurrentUser} /></PublicRoute>} />
                            {/* <Route path="/my-quizzes" element={<PrivateRoute><QuizSelectorEdit /></PrivateRoute>} /> */}
                            <Route path="/my-quizzes" element={<QuizSelectorEdit />} />
                            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                            <Route path="/error" element={<PublicRoute><Error /></PublicRoute>} />
                            <Route path="/create-quiz" element={<PrivateRoute><QuizCreator /></PrivateRoute>} />
                            <Route path="/perform-quiz" element={<PrivateRoute><QuizPerformer /></PrivateRoute>} />
                            <Route path="/" element={<Home />} />
                        </Routes>
                        </BannerProvider>                          
                    </div>
                    </ ModalProvider>
                </div>
            </div>
        </>
    );
}
