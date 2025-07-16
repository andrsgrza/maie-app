// ... otros imports
import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import QuizSelectorPerform from "../arena/QuizSelectorPerform";
import SectionSelector from "../quiz/SectionSelector";
import ButtonBar from "../ButtonBar";
import "./training-manager.css";
import { useModal } from "../../context/ModalContext";
import { useBanner } from "../../context/BannerContext";
import { useLocation } from "react-router-dom";

export default function TrainingManager() {
  const { state } = useLocation();
  const [sets, setSets] = useState([]);
  const [trainingTitle, setTrainingTitle] = useState("");
  const { configureSelectModal } = useModal();
  const { addBanner } = useBanner();
  const bottomRef = useRef(null);
  const [editingSetId, setEditingSetId] = useState(null);
  const inputRef = useRef(null);

  const editMode = state?.edit || false;
  const preloadedTraining = state?.preloadedTraining || null;

  useEffect(() => {
    if (editMode && preloadedTraining) {
      setTrainingTitle(preloadedTraining.title);
      const restoredSets = preloadedTraining.sets.map((set, setIndex) => ({
        setId: `set-${Date.now()}-${setIndex}`,
        title: set.title,
        quizzes: set.quizzes.map((quiz, qIndex) => ({
          ...quiz,
          configId: `config-${Date.now()}-${qIndex}`,
          selectedSections: quiz.sections.map((s) => s.title),
        })),
      }));
      setSets(restoredSets);
    }
  }, [editMode, preloadedTraining]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setEditingSetId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateCanContinue = () => {
    return (
      trainingTitle.trim().length > 0 &&
      sets.length > 0 &&
      sets.every(
        (set) =>
          set.quizzes.length > 0 &&
          set.quizzes.every(
            (quiz) => quiz.selectedSections && quiz.selectedSections.length > 0
          )
      )
    );
  };

  const handleAddSet = () => {
    setSets((prev) => [
      ...prev,
      {
        setId: `set-${Date.now()}`,
        title: `Set ${prev.length + 1}`,
        quizzes: [],
      },
    ]);

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleSetTitleChange = (setId, newTitle) => {
    setSets((prevSets) =>
      prevSets.map((set) =>
        set.setId === setId ? { ...set, title: newTitle } : set
      )
    );
  };

  const handleRemoveSet = (setId) => {
    setSets((prev) => prev.filter((set) => set.setId !== setId));
  };

  const handleAddQuizToSet = (setId) => {
    let currentSelected = [];

    configureSelectModal({
      isOpen: true,
      title: "Select Quizzes",
      selector: () => (
        <QuizSelectorPerform
          onSelected={(selectedQuizzes) =>
            handleQuizzesSelected(setId, selectedQuizzes)
          }
          onSelectionChange={(quizzes) => {
            currentSelected = quizzes;
          }}
          hideStartButton={true}
        />
      ),
      onClose: () => configureSelectModal({ isOpen: false }),
      onAdd: () => {
        handleQuizzesSelected(setId, currentSelected);
        configureSelectModal({ isOpen: false });
      },
    });
  };

  const handleQuizzesSelected = (setId, selectedQuizzes) => {
    if (!selectedQuizzes || selectedQuizzes.length === 0) return;

    const quizzesWithConfig = selectedQuizzes.map((quiz, index) => ({
      ...quiz,
      configId: `config-${Date.now()}-${index}`,
      selectedSections: [],
    }));

    setSets((prevSets) =>
      prevSets.map((set) =>
        set.setId === setId
          ? { ...set, quizzes: [...set.quizzes, ...quizzesWithConfig] }
          : set
      )
    );
  };

  const handleSectionChange = (setId, quizConfigId, selectedSections) => {
    setSets((prevSets) =>
      prevSets.map((set) =>
        set.setId === setId
          ? {
              ...set,
              quizzes: set.quizzes.map((quiz) =>
                quiz.configId === quizConfigId
                  ? { ...quiz, selectedSections }
                  : quiz
              ),
            }
          : set
      )
    );
  };

  const handleRemoveQuizFromSet = (setId, quizConfigId) => {
    setSets((prevSets) =>
      prevSets.map((set) =>
        set.setId === setId
          ? {
              ...set,
              quizzes: set.quizzes.filter(
                (quiz) => quiz.configId !== quizConfigId
              ),
            }
          : set
      )
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const [type, setId] = result.type.split("-");

    if (type === "set") {
      const reorderedSets = Array.from(sets);
      const [movedSet] = reorderedSets.splice(result.source.index, 1);
      reorderedSets.splice(result.destination.index, 0, movedSet);
      setSets(reorderedSets);
    }

    if (type === "quiz") {
      setSets((prevSets) =>
        prevSets.map((set) =>
          set.setId === setId
            ? reorderQuizzesInSet(
                set,
                result.source.index,
                result.destination.index
              )
            : set
        )
      );
    }
  };

  const reorderQuizzesInSet = (set, sourceIndex, destIndex) => {
    const newQuizzes = Array.from(set.quizzes);
    const [movedQuiz] = newQuizzes.splice(sourceIndex, 1);
    newQuizzes.splice(destIndex, 0, movedQuiz);
    return { ...set, quizzes: newQuizzes };
  };

  const handleSave = () => {
    const formattedSets = sets.map((set) => ({
      title: set.title,
      quizzes: set.quizzes.map((quiz) => ({
        quizId: quiz.id,
        title: quiz.title,
        sections: quiz.sections.filter((section) =>
          quiz.selectedSections.includes(section.title)
        ),
      })),
    }));

    const trainingConfig = {
      title: trainingTitle,
      sets: formattedSets,
    };

    addBanner("success", "Training Saved", "Your training has been saved!");
  };

  return (
    <div className="training-manager with-bottom-bar">
      <div className="training-settings-card">
        <h3>Training Settings</h3>
        <div className="settings-field">
          <label>Training Title</label>
          <input
            type="text"
            value={trainingTitle}
            onChange={(e) => setTrainingTitle(e.target.value)}
            placeholder="Enter training title"
          />
        </div>
      </div>

      <ButtonBar
        leftItems={[
          {
            label: "Back",
            contentType: "button",
            onClick: () => window.history.back(),
          },
        ]}
        centerItems={[
          {
            label: (
              <>
                <i className="fas fa-plus" /> Add Set
              </>
            ),
            contentType: "button",
            onClick: handleAddSet,
          },
        ]}
        rightItems={[
          {
            label: "Save",
            contentType: "button",
            onClick: handleSave,
            disabled: !updateCanContinue(),
          },
        ]}
      />

      {sets.length === 0 && (
        <p
          style={{ padding: "1rem", fontStyle: "italic", textAlign: "center" }}
        >
          No sets yet. Click "Add Set" to start creating your training!
        </p>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-sets" type="set">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="sets-list"
            >
              {sets.map((set, setIndex) => (
                <Draggable
                  key={set.setId}
                  draggableId={set.setId}
                  index={setIndex}
                >
                  {(providedSet) => (
                    <div
                      ref={providedSet.innerRef}
                      {...providedSet.draggableProps}
                      className="training-set"
                    >
                      <div className="set-header">
                        <div
                          {...providedSet.dragHandleProps}
                          className="drag-handle"
                        >
                          ⋮⋮
                        </div>
                        {editingSetId === set.setId ? (
                          <input
                            ref={inputRef}
                            className="set-title"
                            value={set.title}
                            onChange={(e) =>
                              handleSetTitleChange(set.setId, e.target.value)
                            }
                            autoFocus
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <h4
                            className="set-title"
                            onClick={() => setEditingSetId(set.setId)}
                            style={{ cursor: "pointer" }}
                          >
                            {set.title}
                          </h4>
                        )}
                        <button
                          className="remove-set-btn"
                          onClick={() => handleRemoveSet(set.setId)}
                        >
                          ✕
                        </button>
                      </div>
                      <Droppable
                        droppableId={set.setId}
                        direction="horizontal"
                        type={`quiz-${set.setId}`}
                      >
                        {(providedQuiz) => (
                          <div
                            {...providedQuiz.droppableProps}
                            ref={providedQuiz.innerRef}
                            className="section-selectors-row"
                          >
                            {set.quizzes.map((quiz, quizIndex) => (
                              <Draggable
                                key={quiz.configId}
                                draggableId={quiz.configId}
                                index={quizIndex}
                              >
                                {(providedQuizItem) => (
                                  <div
                                    ref={providedQuizItem.innerRef}
                                    {...providedQuizItem.draggableProps}
                                    className="quiz-config-item"
                                  >
                                    <div className="quiz-config-header">
                                      <div
                                        {...providedQuizItem.dragHandleProps}
                                        className="drag-handle"
                                      >
                                        ⋮⋮
                                      </div>
                                      <span>{quiz.title}</span>
                                      <button
                                        className="remove-set-btn"
                                        onClick={() =>
                                          handleRemoveQuizFromSet(
                                            set.setId,
                                            quiz.configId
                                          )
                                        }
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <SectionSelector
                                      quizTitle={quiz.title}
                                      sections={quiz.sections}
                                      selectedSections={
                                        quiz.selectedSections || []
                                      }
                                      onChange={(sections) =>
                                        handleSectionChange(
                                          set.setId,
                                          quiz.configId,
                                          sections
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {providedQuiz.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <div className="add-quiz-wrapper-bottom">
                        <button
                          className="add-quiz-btn"
                          onClick={() => handleAddQuizToSet(set.setId)}
                        >
                          <i className="fas fa-plus" /> Add Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <div ref={bottomRef} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
