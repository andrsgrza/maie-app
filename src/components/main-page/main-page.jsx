import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import "./main-page.css";
import TopBar from "./TopBar";
import SidebarMenu from "./SidebarLoginMenu";
import HomeGuest from "./home-page/HomeGuest";
import HomeUser from "./home-page/HomeUser";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import { UserClient } from "../../api/user-client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BannerProvider } from "../../context/BannerContext";
import { ModalProvider } from "../../context/ModalContext";
import { useLocation } from "react-router-dom";
import useFetchResources from "../../hooks/useFetchResources";
import expressQuizzes from "../../../resources/demo-quizes/express.json";

import QuizManager from "../quiz/QuizManager";
import Arena from "../arena/Arena";
import Login from "../auth/LoginForm";
import RegistryForm from "../auth/RegistryForm";
import TrainingManager from "../training/TrainingManager";
import ManageResources from "../resource/ManageResources";
import PerformQuiz from "../arena/PerformQuiz";
import PerformTraining from "../arena/PerformTraining";
import TrainingReport from "../report/TrainingReport";

export default function MainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <ModalProvider>
        <BannerProvider>
          <MainPageContent
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            toggleMenu={toggleMenu}
          />
        </BannerProvider>
      </ModalProvider>
    </Router>
  );
}

function MainPageContent({
  isMenuOpen,
  setIsMenuOpen,
  currentUser,
  setCurrentUser,
  toggleMenu,
}) {
  const navigate = useNavigate();
  const { authenticate, unauthenticate, isAuthenticated } = useAuth();

  const handleClickOnSidebar = () => {
    setIsMenuOpen(false);
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await UserClient.whoAmI();
        if (response.status >= 200 && response.status < 300) {
          setCurrentUser(response.data);
          authenticate();
        } else if (response.status === 401 || response.status === 403) {
          setCurrentUser(null);
          unauthenticate();
        } else {
          setCurrentUser(null);
          unauthenticate();
        }
      } catch (error) {}
    };

    verifyAuth();
  }, [navigate, setCurrentUser]);

  const Home = () =>
    currentUser ? <HomeUser username={currentUser.username} /> : <HomeGuest />;
  const Profile = () => <h2>User Profile Page</h2>;
  const Error = () => <h2>There was en error</h2>;

  const TopNavButtonContainer = () => (
    <div className="sidebar-top-button-container">
      <button className="sidebar-button menu-open" onClick={toggleMenu}>
        ✕
      </button>
      <button className="sidebar-button menu-open">☰</button>
    </div>
  );
  const handleCreateFromExecution = () => {
    handleClickOnSidebar(); // Close sidebar
    navigate("/training-manager", {
      state: {
        page: "create-from-execution",
        executedTraining: {
          id: "TEMP_1752957427617",
          title: "Quick Training",
          sets: [
            {
              title: "Quick Set",
              resources: [
                {
                  quizId: "RQ_c5003267",
                  title: "Test Quiz",
                  sections: [
                    {
                      title: "Section 1",
                      items: [
                        {
                          question: "S1 Q1",
                          answer: "S1 Q1",
                          userAnswer: "asdfasdf",
                          isAnswerCorrect: true,
                        },
                        {
                          question: "S1 Q2",
                          answer: "S1 Q2",
                          userAnswer: "asdfasd",
                          isAnswerCorrect: false,
                        },
                      ],
                    },
                    {
                      title: "Section 2",
                      items: [
                        {
                          question: "S2 Q1",
                          answer: "S2 Q1",
                          userAnswer: "asdfasd",
                          isAnswerCorrect: true,
                        },
                      ],
                    },
                    {
                      title: "Section 3",
                      items: [
                        {
                          question: "S2 Q2",
                          answer: "S2 Q2",
                          userAnswer: "sadfasd",
                          isAnswerCorrect: false,
                        },
                      ],
                    },
                  ],
                },
                {
                  quizId: "RQ_95b5a930",
                  title: "Title3",
                  sections: [
                    {
                      title: "Section",
                      items: [
                        {
                          question: "asdfasdf",
                          answer: "asdfasdf",
                          userAnswer: "asdfasf",
                          isAnswerCorrect: true,
                        },
                        {
                          question: "asfdas",
                          answer: "adsfasdf",
                          userAnswer: "asdfsa",
                          isAnswerCorrect: false,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          createdAt: "2025-07-19T20:37:07.617Z",
          lastEdited: "2025-07-19T20:37:07.617Z",
          lastPerformed: "2025-07-19T20:37:20.974Z",
          entitlementRole: "OWNER",
          resourceEntitlement: [],
        },
      },
    });
  };

  const getNavigationMenu = () => (
    <div className={`left-menu ${isMenuOpen ? "open" : "collapsed"}`}>
      <TopNavButtonContainer />
      {isAuthenticated ? (
        <nav>
          <ul>
            <li>
              <Link to="/my-quizzes" onClick={handleClickOnSidebar}>
                Quizzes{" "}
              </Link>
            </li>
            <li>
              <Link to="/my-trainings" onClick={handleClickOnSidebar}>
                Trainings
              </Link>
            </li>
            <li>
              <Link to="/arena" onClick={handleClickOnSidebar}>
                Arena
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  handleClickOnSidebar();
                  navigate("/quiz-manager/create-from-execution", {
                    state: {
                      page: "create-from-execution",
                      executedQuiz: {
                        id: "RQ_TEST1234",
                        title: "Executed Sample Quiz",
                        sections: [
                          {
                            title: "Section 1",
                            items: [
                              {
                                question: "What is React?",
                                answer: "A library",
                                userAnswer: "A framework",
                                isAnswerCorrect: false,
                              },
                              {
                                question: "JSX stands for?",
                                answer: "JavaScript XML",
                                userAnswer: "JavaScript Extension",
                                isAnswerCorrect: false,
                              },
                            ],
                          },
                        ],
                      },
                    },
                  });
                }}
              >
                Create Quiz From Execution
              </button>
            </li>
          </ul>
        </nav>
      ) : (
        <SidebarMenu onLinkClick={handleClickOnSidebar} />
      )}
    </div>
  );

  return (
    <>
      <div className="main-page">
        {getNavigationMenu()}
        <div className="content">
          <TopBar
            enableStart={isMenuOpen}
            openSidebar={toggleMenu}
            showMenu={currentUser ? true : false}
          />
          <div className="inner-content">
            <Routes>
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <RegistryForm />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login setCurrentUser={setCurrentUser} />
                  </PublicRoute>
                }
              />
              <Route
                path="/my-quizzes"
                element={
                  <div className=" centered-container">
                    <PrivateRoute>
                      <ManageResources resourceType="quiz" />
                    </PrivateRoute>
                  </div>
                }
              />
              <Route
                path="/my-trainings"
                element={
                  <div className=" centered-container">
                    <PrivateRoute>
                      <ManageResources resourceType="training" />
                    </PrivateRoute>
                  </div>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/error"
                element={
                  <PublicRoute>
                    <Error />
                  </PublicRoute>
                }
              />
              <Route
                path="/quiz-manager"
                element={
                  <PrivateRoute>
                    <QuizManager />
                  </PrivateRoute>
                }
              />
              <Route
                path="/quiz-manager/create-from-execution"
                element={
                  <PrivateRoute>
                    <div className="centered-container">
                      <QuizManager />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/perform-training"
                element={
                  <div className=" centered-container">
                    <PrivateRoute>
                      <PerformTraining />
                    </PrivateRoute>
                  </div>
                }
              />
              <Route
                path="/training-report"
                element={
                  <div className=" centered-container">
                    <PrivateRoute>
                      <TrainingReport />
                    </PrivateRoute>
                  </div>
                }
              />
              <Route
                path="/arena"
                element={
                  <PrivateRoute>
                    <Arena />
                  </PrivateRoute>
                }
              />
              <Route
                path="/training-manager"
                element={
                  <PrivateRoute>
                    <div className="centered-container">
                      <TrainingManager />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
