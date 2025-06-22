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
  const [trainingSubmittable, setTrainningSubmittable] = useState(true);

  const [buttons, setButtons] = useState([
    {
      label: "Continue",
      onClick: () => setSectionsConfirmed(true),
      disabled: true,
    },
  ]);

  useEffect(() => {
    setSelectedSections({});
  }, []);

  useEffect(() => {
    const allQuizzesHaveSelections = selectedQuizzes.every((_, index) => {
      const sections = selectedSections[index];
      return sections && sections.length > 0;
    });

    setButtons([
      {
        label: "Continue",
        onClick: () => setSectionsConfirmed(true),
        disabled: !allQuizzesHaveSelections,
      },
    ]);
  }, [selectedSections, selectedQuizzes]);

  const handleButtonClick = (buttonLabel) => {
    console.log(`${buttonLabel} clicked!`);
  };

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
            <ButtonBar buttons={buttons} />
            <p>{trainingSubmittable ? "yes" : "no"}</p>
          </>
        )}
      </div>

      {console.log("Selected sections:", selectedSections)}
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
          <div key={`quiz-report-${index}`}>
            <QuizReport completedQuiz={completedQuiz} />
          </div>
        ))}
      {allQuizzesCompleted && (
        <div>
          <button className="basic-button" onClick={handleRefreshArena}>
            Go to Arena
          </button>
        </div>
      )}
    </div>
  );
}
