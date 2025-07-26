import React, { useState } from "react";
import {
  filterTrainingByQuizIds,
  filterTrainingByQuestionIds,
  filterIncorrectQuestionsOnly,
  filterIncorrectSections,
  filterIncorrectQuizzes,
} from "../../utils/trainingUtils";
import "./training-manager.css";

export default function TrainingManager(props) {
  const isModal = !!props.executedTraining;
  const state = isModal
    ? {
        executedTraining: props.executedTraining,
        page: props.mode || "create-from-execution",
        edit: props.edit,
      }
    : {};

  const currentPage = state?.page || "editor";
  if (currentPage === "editor") return <TrainingEditor state={state} />;
  if (currentPage === "create-from-execution")
    return (
      <CreateFromExecution
        state={state}
        onTrainingChanged={props.onTrainingChanged}
      />
    );
  return null;
}

function CreateFromExecution({ state, onTrainingChanged }) {
  const [localSelected, setLocalSelected] = useState(null);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const completedTraining = state?.executedTraining;
  const [newTitle, setNewTitle] = useState(
    `Retry Training - ${completedTraining?.title || ""}`
  );
  if (!completedTraining) throw new Error("No training received");
  const { sets } = completedTraining;

  const MODES = [
    { label: "Incorrect Questions", description: "Only incorrect questions." },
    { label: "Incorrect Sections", description: "Sections with mistakes." },
    { label: "Incorrect Quizzes", description: "Quizzes with errors." },
    { label: "Manual Quiz Selection", description: "Select specific quizzes." },
    {
      label: "Manual Question Selection",
      description: "Select specific questions.",
    },
    { label: "Repeat Entire Training", description: "Clone entire training." },
  ];

  const getAllQuizzes = () =>
    sets.flatMap((set) => set.resources || []).filter((r) => r.quizId);

  function buildTrainingByMode() {
    switch (localSelected) {
      case "Incorrect Questions":
        return {
          ...filterIncorrectQuestionsOnly(completedTraining),
          title: newTitle,
        };
      case "Incorrect Sections":
        return {
          ...filterIncorrectSections(completedTraining),
          title: newTitle,
        };
      case "Incorrect Quizzes":
        return {
          ...filterIncorrectQuizzes(completedTraining),
          title: newTitle,
        };
      case "Repeat Entire Training":
        return {
          ...JSON.parse(JSON.stringify(completedTraining)),
          title: newTitle,
        };
      case "Manual Quiz Selection":
        return {
          ...filterTrainingByQuizIds(completedTraining, selectedQuizzes),
          title: newTitle,
        };
      case "Manual Question Selection":
        return {
          ...filterTrainingByQuestionIds(completedTraining, selectedQuestions),
          title: newTitle,
        };
      default:
        return null;
    }
  }

  // Notifica al padre en cada cambio relevante
  React.useEffect(() => {
    if (!localSelected) {
      onTrainingChanged && onTrainingChanged(null);
    } else {
      const trainingToSave = buildTrainingByMode();
      onTrainingChanged && onTrainingChanged(trainingToSave);
    }
    // eslint-disable-next-line
  }, [localSelected, selectedQuizzes, selectedQuestions, newTitle]);

  return (
    <div className="training-modal-content">
      <div className="modal-title-input">
        <label>Training Title:</label>
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
              setSelectedQuizzes([]);
              setSelectedQuestions([]);
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

      {localSelected === "Manual Quiz Selection" && (
        <div className="manual-select-block">
          <p>Select quizzes to include:</p>
          <div className="pill-grid">
            {getAllQuizzes().map((quiz) => {
              const isSelected = selectedQuizzes.includes(quiz.quizId);
              return (
                <div
                  key={quiz.quizId}
                  className={`pill ${isSelected ? "pill-selected" : ""}`}
                  onClick={() =>
                    setSelectedQuizzes((prev) =>
                      prev.includes(quiz.quizId)
                        ? prev.filter((id) => id !== quiz.quizId)
                        : [...prev, quiz.quizId]
                    )
                  }
                >
                  {quiz.title}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {localSelected === "Manual Question Selection" && (
        <div className="manual-select-block">
          <p>Select specific questions:</p>
          {getAllQuizzes().map((quiz) => (
            <div key={quiz.quizId} className="question-block">
              <h4>{quiz.title}</h4>
              {quiz.sections.map((section) => (
                <div key={section.title} className="section-block">
                  <h5>{section.title}</h5>
                  <div className="pill-grid">
                    {section.items.map((item, idx) => {
                      const exists = selectedQuestions.some(
                        (q) =>
                          q.quizId === quiz.quizId &&
                          q.sectionTitle === section.title &&
                          q.question === item.question
                      );
                      return (
                        <div
                          key={`${quiz.quizId}-${section.title}-${idx}`}
                          className={`pill ${exists ? "pill-selected" : ""}`}
                          onClick={() =>
                            setSelectedQuestions((prev) =>
                              exists
                                ? prev.filter(
                                    (q) =>
                                      !(
                                        q.quizId === quiz.quizId &&
                                        q.sectionTitle === section.title &&
                                        q.question === item.question
                                      )
                                  )
                                : [
                                    ...prev,
                                    {
                                      quizId: quiz.quizId,
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
          ))}
        </div>
      )}
    </div>
  );
}
function TrainingEditor({ state }) {
  const [sets, setSets] = useState([]);
  const [trainingTitle, setTrainingTitle] = useState("");
  const [editingSetId, setEditingSetId] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const { configureSelectModal } = useModal();
  const { addBanner } = useBanner();

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
            onClick: () => {
              if (state?.onClose) state.onClose();
              else window.history.back();
            },
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
