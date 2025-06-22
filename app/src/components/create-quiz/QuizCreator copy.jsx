import React, { useState, useEffect, useRef } from "react";
import SectionList from "./SectionList";
import { BackButton } from "../../common/BackButton";
import QuizClient from "../../api/quiz-client";
import { useLocation } from "react-router-dom";
import protoQuiz from "../../../resources/proto-quiz.json";
import "./quiz-editor.css";
import { useNavigate } from "react-router-dom";
import { useBanner } from "../../context/BannerContext";
import { MESSAGES } from "../../common/constants";
import ButtonBar from "../ButtonBar";

export default function QuizCreator() {
  const [isEditingQuizTitle, setIsEditingQuizTitle] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });
  const [highlightedSections, setHighlightedSections] = useState([]);
  const [forgedQuiz, setForgedQuiz] = useState(protoQuiz);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);

  const hasMounted = useRef(false); // Ref to track if component has mounted
  const isSettingPreloadedQuiz = useRef(false); // Ref to track if setting preloadedQuiz
  const previousQuizState = useRef(forgedQuiz);
  const { addBanner } = useBanner();
  const location = useLocation();

  // quiz is preloaded quiz recieved on endit
  // TODO change quiz to preloadedQuiz and remove unecessary edit by checking if quiz exists
  const { preloadedQuiz, edit } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (preloadedQuiz) {
      isSettingPreloadedQuiz.current = true; // Set to true when setting preloadedQuiz
      setForgedQuiz(preloadedQuiz);
    }
  }, [preloadedQuiz]);

  useEffect(() => {
    if (hasMounted.current) {
      // Check if component has mounted
      // Check if the relevant properties have changed
      const hasChanges = forgedQuiz.sections.some((section, sectionIndex) => {
        const previousItems =
          previousQuizState.current.sections[sectionIndex]?.items || [];
        return section.items.some((item, itemIndex) => {
          const previousItem = previousItems[itemIndex];
          // Check if the previous item exists and compare properties
          return (
            !previousItem ||
            previousItem.question !== item.question ||
            previousItem.answer !== item.answer
          );
        });
      });

      if (autosaveEnabled && !isSettingPreloadedQuiz.current && hasChanges) {
        handleSaveQuiz();
      }
    } else {
      hasMounted.current = true; // Set to true after first render
    }

    // Update the previous quiz state to the current state
    previousQuizState.current = forgedQuiz;

    isSettingPreloadedQuiz.current = false; // Reset after the effect runs
  }, [forgedQuiz]);

  useEffect(() => {
    if (preloadedQuiz) {
      isSettingPreloadedQuiz.current = true; // Set to true when setting preloadedQuiz
      setForgedQuiz(preloadedQuiz);
    }
  }, [preloadedQuiz]);

  const updateForgedQuizTitle = (event) => {
    setForgedQuiz((prevState) => ({
      ...prevState,
      title: event.target.value,
    }));
  };

  const exitTitleEdit = () => {
    setIsEditingQuizTitle(false);
  };

  const handleQuizDescriptionChange = (event) => {
    setForgedQuiz((prevState) => ({
      ...prevState,
      description: event.target.value,
    }));
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
      return {
        ...prevQuiz,
        sections: newSections,
      };
    });

    if (updatedSection.items.length > 0) {
      const newHighlightedSections = highlightedSections.filter(
        (sectionIndex) => sectionIndex !== index
      );
      setHighlightedSections(newHighlightedSections);

      if (newHighlightedSections.length === 0) {
        setSaveMessage({ text: "", type: "" });
      }
    }
  };

  const deleteSection = (index) => {
    if (index === 0) return; // Prevent deletion of the first section
    setForgedQuiz((prevQuiz) => {
      const newSections = prevQuiz.sections.filter((_, i) => i !== index);
      return {
        ...prevQuiz,
        sections: newSections,
      };
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
      const quizJson = JSON.stringify(forgedQuiz, null, 2);

      try {
        let response;
        if (preloadedQuiz) {
          response = await QuizClient.updateQuiz(forgedQuiz);
        } else {
          response = await QuizClient.postQuiz(forgedQuiz);
        }

        addBanner(
          MESSAGES.API_MESSAGES.PUT_QUIZ[response.status].TYPE,
          MESSAGES.API_MESSAGES.PUT_QUIZ[response.status].TITLE,
          MESSAGES.API_MESSAGES.PUT_QUIZ[response.status].MESSAGE
        );
      } catch (error) {
        setSaveMessage({ text: "Error saving quiz.", type: "error" });
      }
    }
    setHighlightedSections([]);
  };

  const handleSaveAndExit = () => {
    handleSaveQuiz();
    navigate("/my-quizzes");
  };

  return (
    <div className="quiz-creator">
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
            contentType: "toggle",
            label: "Autosave",
            checked: autosaveEnabled,
            onChange: () => setAutosaveEnabled(!autosaveEnabled),
          },
          ...(saveMessage.text
            ? [
                {
                  type: "message",
                  text: saveMessage.text,
                  messageType: saveMessage.type,
                },
              ]
            : []),
        ]}
        rightItems={[
          {
            type: "button",
            label: "Back",
            onClick: () => navigate(-1),
          },
          {
            type: "button",
            label: "Save",
            onClick: handleSaveQuiz,
          },
          {
            type: "button",
            label: "Save and Exit",
            onClick: handleSaveAndExit,
          },
        ]}
      />
    </div>
  );
}
