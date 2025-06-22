import React, { useState, useEffect } from "react";
import QuizSelectorPerform from "../quiz-selector/quiz-selector-wrapper/QuizSelectorPerform";
import PerformQuiz from "./PerformQuiz";
import QuizReport from "../report/QuizReport";
import SectionSelector from "../quiz-selector/SectionSelector";
import "./perform-quiz.css";
import ButtonBar from "../ButtonBar";

export default function QuizPerformer() {
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [allQuizzesCompleted, setAllQuizzesCompleted] = useState(false);
  const [selectedSections, setSelectedSections] = useState({});
  const [sectionsConfirmed, setSectionsConfirmed] = useState(false);

  const [trainingCreatorButtons, setTrainingCreatorButtons] = useState([
    {
      contentType: "button",
      label: "Continue",
      onClick: () => setSectionsConfirmed(true),
      disabled: false,
    },
  ]);

  const [quizReportButtons, setQuizReportButtons] = useState([
    {
      contentType: "button",
      label: "Arena",
      onClick: () => handleRefreshArena(),
      disabled: false,
    },
  ]);

  useEffect(() => {
    setSelectedSections({});
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.key === "Enter" && allQuizzesHaveSelections()) {
        event.preventDefault();
        setSectionsConfirmed(true);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [selectedSections, selectedQuizzes]);

  useEffect(() => {
    setTrainingCreatorButtons([
      {
        contentType: "button",
        label: "Continue",
        onClick: () => setSectionsConfirmed(true),
        disabled: !allQuizzesHaveSelections(),
      },
    ]);
  }, [selectedSections, selectedQuizzes]);

  const allQuizzesHaveSelections = () =>
    selectedQuizzes.every((_, index) => {
      const sections = selectedSections[index];
      return sections && sections.length > 0;
    });

  const handleQuizzesSelected = (quizzes) => {
    setSelectedQuizzes(quizzes);
    setCurrentQuizIndex(0);
    setSelectedSections({});
  };

  const handleSubmitQuiz = (completedQuiz) => {
    setCompletedQuizzes((prevState) => [...prevState, completedQuiz]);
    setCurrentQuizIndex((prevIndex) => prevIndex + 1);

    if (currentQuizIndex >= selectedQuizzes.length - 1) {
      setAllQuizzesCompleted(true);
    }

    // Update the selected quizzes with the completed quiz
    setSelectedQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz, index) =>
        index === currentQuizIndex ? completedQuiz : quiz
      )
    );
  };

  const handleRefreshArena = () => {
    setSelectedQuizzes([]);
    setCompletedQuizzes([]);
    setCurrentQuizIndex(0);
    setAllQuizzesCompleted(false);
    setSelectedSections({});
    setSectionsConfirmed(false);
  };

  const filterCurrentQuizSections = (quiz) => {
    const filteredQuiz = {
      ...quiz,
      sections: quiz.sections.filter((section) =>
        selectedSections[currentQuizIndex].includes(section.title)
      ),
    };
    return filteredQuiz;
  };

  return (
    <div className="quiz-performer centered-container">
      {selectedQuizzes.length === 0 && (
        <div className="quiz-selector">
          <QuizSelectorPerform onSelected={handleQuizzesSelected} />
        </div>
      )}

      <div className="section-selectors-container">
        {selectedQuizzes.length > 0 && !sectionsConfirmed && (
          <>
            {selectedQuizzes.map((quiz, index) => (
              <SectionSelector
                key={`section-selector-${index}`}
                quizTitle={quiz.title}
                sections={quiz.sections}
                selectedSections={selectedSections[index] || []}
                onChange={(sections) => {
                  setSelectedSections((prev) => ({
                    ...prev,
                    [index]: sections,
                  }));
                }}
                onContinue={() => setSectionsConfirmed(true)}
              />
            ))}
            <ButtonBar centerItems={trainingCreatorButtons} />
          </>
        )}
      </div>

      {selectedQuizzes.length > 0 &&
        currentQuizIndex < selectedQuizzes.length &&
        sectionsConfirmed &&
        selectedQuizzes.map((quiz, index) => (
          <>
            <div key={`perform-quiz-${index}`} style={{ display: "contents" }}>
              {currentQuizIndex === index ? (
                <PerformQuiz
                  quiz={filterCurrentQuizSections(quiz)}
                  onComplete={handleSubmitQuiz}
                />
              ) : null}
            </div>
          </>
        ))}
      {allQuizzesCompleted &&
        completedQuizzes.map((completedQuiz, index) => (
          <div className="quiz-report-container" key={`quiz-report-${index}`}>
            <QuizReport completedQuiz={completedQuiz} />
          </div>
        ))}
      {allQuizzesCompleted && <ButtonBar centerItems={quizReportButtons} />}
    </div>
  );
}
