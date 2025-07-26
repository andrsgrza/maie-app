import React, { useState, useEffect, useRef } from "react";
import SectionList from "./SectionList";
import { BackButton } from "../../common/BackButton";
import QuizClient from "../../api/quiz-client";
import { useLocation, useNavigate } from "react-router-dom";
import protoQuiz from "../../../resources/proto-quiz.json";
import "./quiz-manager.css";
import { useBanner } from "../../context/BannerContext";
import { MESSAGES } from "../../common/constants";
import ButtonBar from "../ButtonBar";

export default function QuizManager(props) {
  const location = useLocation();
  const pageMode = location.state?.page;

  if (pageMode === "create-from-execution") {
    return <CreateFromExecution executedQuiz={location.state?.executedQuiz} />;
  }

  return <QuizEditor />;
}

function QuizEditor({ preloadedQuiz: propQuiz, edit: propEdit }) {
  const [isEditingQuizTitle, setIsEditingQuizTitle] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });
  const [highlightedSections, setHighlightedSections] = useState([]);
  const [forgedQuiz, setForgedQuiz] = useState(protoQuiz);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [quizLoaded, setQuizLoaded] = useState(false);

  const hasMounted = useRef(false);
  const isSettingPreloadedQuiz = useRef(false);
  const previousQuizState = useRef(forgedQuiz);
  const { addBanner } = useBanner();
  const location = useLocation();
  const navigate = useNavigate();

  // Permite recibir por prop (directo) o por location.state
  const { preloadedQuiz: stateQuiz, edit: stateEdit } = location.state || {};

  // Decide qué usar
  const preloadedQuiz = propQuiz || stateQuiz;
  const edit = typeof propEdit !== "undefined" ? propEdit : stateEdit;

  // Soporte para cargar el quiz preexistente solo una vez
  useEffect(() => {
    if (preloadedQuiz) {
      setForgedQuiz(preloadedQuiz);
      previousQuizState.current = preloadedQuiz;
    }
    setQuizLoaded(true); // <-- Listo para autosave SOLO después de cargar
  }, [preloadedQuiz]);

  useEffect(() => {
    // Evitar autosave en primer render/después de cargar quiz
    if (!quizLoaded) return;

    const hasChanges = forgedQuiz.sections.some((section, sectionIndex) => {
      const previousItems =
        previousQuizState.current.sections[sectionIndex]?.items || [];
      return section.items.some((item, itemIndex) => {
        const previousItem = previousItems[itemIndex];
        return (
          !previousItem ||
          previousItem.question !== item.question ||
          previousItem.answer !== item.answer
        );
      });
    });

    if (autosaveEnabled && hasChanges) {
      handleSaveQuiz();
    }
    previousQuizState.current = forgedQuiz;
  }, [forgedQuiz, autosaveEnabled, quizLoaded]);

  // ...resto del código igual

  const updateForgedQuizTitle = (event) => {
    setForgedQuiz((prev) => ({ ...prev, title: event.target.value }));
  };

  const exitTitleEdit = () => setIsEditingQuizTitle(false);

  const handleQuizDescriptionChange = (event) => {
    setForgedQuiz((prev) => ({ ...prev, description: event.target.value }));
  };

  const addSection = () => {
    setForgedQuiz((prevQuiz) => ({
      ...prevQuiz,
      sections: [
        ...prevQuiz.sections,
        { title: `Section ${prevQuiz.sections.length + 1}`, items: [] },
      ],
    }));
  };

  const updateSection = (index, updatedSection) => {
    setForgedQuiz((prevQuiz) => {
      const newSections = prevQuiz.sections.map((section, i) =>
        i === index ? updatedSection : section
      );
      return { ...prevQuiz, sections: newSections };
    });

    if (updatedSection.items.length > 0) {
      const newHighlightedSections = highlightedSections.filter(
        (i) => i !== index
      );
      setHighlightedSections(newHighlightedSections);
      if (newHighlightedSections.length === 0)
        setSaveMessage({ text: "", type: "" });
    }
  };

  const deleteSection = (index) => {
    if (index === 0) return;
    setForgedQuiz((prevQuiz) => {
      const newSections = prevQuiz.sections.filter((_, i) => i !== index);
      return { ...prevQuiz, sections: newSections };
    });
  };

  const handleSaveQuiz = async () => {
    const emptySections = forgedQuiz.sections
      .map((section, index) => (section.items.length === 0 ? index : null))
      .filter((index) => index !== null);
    if (emptySections.length > 0) {
      setSaveMessage({
        text: "All sections must have at least one question submitted.",
        type: "error",
      });
      setHighlightedSections(emptySections);
    } else {
      try {
        let response;
        if (forgedQuiz?.id) {
          response = await QuizClient.updateQuiz(forgedQuiz);
        } else {
          response = await QuizClient.postQuiz(forgedQuiz);
        }
        Object.assign(forgedQuiz, response.data);
        addBanner(
          MESSAGES.API_MESSAGES.PUT_QUIZ[response.status].TYPE,
          MESSAGES.API_MESSAGES.PUT_QUIZ[response.status].TITLE,
          MESSAGES.API_MESSAGES.PUT_QUIZ[response.status].MESSAGE
        );
      } catch (error) {
        setSaveMessage({ text: `Error saving quiz: ${error}`, type: "error" });
      }
    }
    setHighlightedSections([]);
  };

  const handleSaveAndExit = () => {
    handleSaveQuiz();
    navigate("/my-quizzes");
  };

  return (
    <div className="quiz-creator with-bottom-bar">
      <div className="centered-container">
        {isEditingQuizTitle ? (
          <input
            type="text"
            value={forgedQuiz.title}
            onChange={updateForgedQuizTitle}
            onKeyPress={(e) => e.key === "Enter" && exitTitleEdit()}
            onBlur={exitTitleEdit}
            autoFocus
            className="quiz-title-input"
            placeholder="Title"
          />
        ) : (
          <h1
            onClick={() => setIsEditingQuizTitle(true)}
            className="quiz-title"
          >
            {forgedQuiz.title}
          </h1>
        )}
        <label className="description-wrapper">
          Description:
          <textarea
            name="description"
            placeholder="Provide a description for the quiz"
            onChange={handleQuizDescriptionChange}
            value={forgedQuiz.description}
          />
        </label>
      </div>

      <div className="centered-container section-list-wrapper">
        <SectionList
          sections={forgedQuiz.sections}
          updateSection={updateSection}
          deleteSection={deleteSection}
          addSection={addSection}
          highlightedSections={highlightedSections}
          edit={edit}
        />
      </div>
      <ButtonBar
        leftItems={[
          {
            contentType: "switch",
            label: "Autosave",
            checked: autosaveEnabled,
            onChange: () => setAutosaveEnabled(!autosaveEnabled),
          },
          ...(saveMessage.text
            ? [
                {
                  contentType: "message",
                  text: saveMessage.text,
                  messageType: saveMessage.type,
                },
              ]
            : []),
        ]}
        rightItems={[
          { label: "Back", onClick: () => navigate(-1) },
          { label: "Save", onClick: handleSaveQuiz },
          { label: "Save and Exit", onClick: handleSaveAndExit },
        ]}
      />
    </div>
  );
}

function CreateFromExecution({ executedQuiz, onQuizChanged }) {
  const [localSelected, setLocalSelected] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [newTitle, setNewTitle] = useState(
    `Retry Quiz - ${executedQuiz?.title || ""}`
  );

  if (!executedQuiz) return <div>No quiz execution provided</div>;
  const { sections } = executedQuiz;

  const MODES = [
    {
      label: "Incorrect Questions",
      description: "Only the questions you got wrong.",
    },
    {
      label: "Incorrect Sections",
      description: "Entire sections where you made mistakes.",
    },
    {
      label: "Manual Section Selection",
      description: "Manually select which sections to include.",
    },
    {
      label: "Manual Question Selection",
      description: "Manually select which questions to include.",
    },
    { label: "Repeat Entire Quiz", description: "Clone the entire quiz." },
  ];

  function buildQuizByMode() {
    switch (localSelected) {
      case "Incorrect Questions":
        return {
          ...executedQuiz,
          title: newTitle,
          sections: executedQuiz.sections
            .map((section) => ({
              ...section,
              items: section.items.filter(
                (item) => item.isAnswerCorrect === false
              ),
            }))
            .filter((section) => section.items.length > 0),
        };
      case "Incorrect Sections":
        return {
          ...executedQuiz,
          title: newTitle,
          sections: executedQuiz.sections.filter((section) =>
            section.items.some((item) => item.isAnswerCorrect === false)
          ),
        };
      case "Manual Section Selection":
        return {
          ...executedQuiz,
          title: newTitle,
          sections: executedQuiz.sections.filter((section) =>
            selectedSections.includes(section.title)
          ),
        };
      case "Manual Question Selection":
        return {
          ...executedQuiz,
          title: newTitle,
          sections: executedQuiz.sections
            .map((section) => {
              const filteredItems = section.items.filter((item) =>
                selectedQuestions.some(
                  (q) =>
                    q.sectionTitle === section.title &&
                    q.question === item.question
                )
              );
              return { ...section, items: filteredItems };
            })
            .filter((section) => section.items.length > 0),
        };
      case "Repeat Entire Quiz":
        return {
          ...executedQuiz,
          title: newTitle,
          sections: JSON.parse(JSON.stringify(executedQuiz.sections)),
        };
      default:
        return null;
    }
  }

  // Notifica al padre en cada cambio relevante
  useEffect(() => {
    if (!localSelected) {
      onQuizChanged && onQuizChanged(null);
    } else {
      const quizToSave = buildQuizByMode();
      onQuizChanged && onQuizChanged(quizToSave);
    }
    // eslint-disable-next-line
  }, [localSelected, selectedQuestions, selectedSections, newTitle]);

  // Resto de la UI (sin botones de footer/modal)
  return (
    <div className="training-modal-content">
      <div className="modal-title-input">
        <label>Quiz Title:</label>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="title-input"
        />
      </div>
      <div className="modal-mode-options">
        {MODES.map(({ label }) => (
          <div
            key={label}
            className={`mode-option ${
              localSelected === label ? "selected" : ""
            }`}
            onClick={() => {
              setLocalSelected(label);
              setSelectedQuestions([]);
              setSelectedSections([]);
            }}
          >
            {label}
          </div>
        ))}
      </div>
      {localSelected && (
        <div className="mode-description">
          {MODES.find((m) => m.label === localSelected)?.description}
        </div>
      )}

      {localSelected === "Manual Section Selection" && (
        <div className="manual-select-block">
          <p>Select sections to include:</p>
          <div className="pill-grid">
            {sections.map((section) => {
              const selected = selectedSections.includes(section.title);
              return (
                <div
                  key={section.title}
                  className={`pill ${selected ? "pill-selected" : ""}`}
                  onClick={() =>
                    setSelectedSections((prev) =>
                      prev.includes(section.title)
                        ? prev.filter((t) => t !== section.title)
                        : [...prev, section.title]
                    )
                  }
                >
                  {section.title}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {localSelected === "Manual Question Selection" && (
        <div className="manual-select-block">
          <p>Select specific questions:</p>
          {sections.map((section) => (
            <div key={section.title} className="question-block">
              <h4>{section.title}</h4>
              <div className="pill-grid">
                {section.items.map((item, idx) => {
                  const exists = selectedQuestions.some(
                    (q) =>
                      q.sectionTitle === section.title &&
                      q.question === item.question
                  );
                  return (
                    <div
                      key={`${section.title}-${idx}`}
                      className={`pill ${exists ? "pill-selected" : ""}`}
                      onClick={() =>
                        setSelectedQuestions((prev) =>
                          exists
                            ? prev.filter(
                                (q) =>
                                  !(
                                    q.sectionTitle === section.title &&
                                    q.question === item.question
                                  )
                              )
                            : [
                                ...prev,
                                {
                                  sectionTitle: section.title,
                                  question: item.question,
                                },
                              ]
                        )
                      }
                    >
                      {item.question}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { CreateFromExecution };
