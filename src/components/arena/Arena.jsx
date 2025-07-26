import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResourceList from "../resource/ResourceList";
import ResourceCard from "../resource/ResourceCard";

import "./arena.css";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "../../common/modal/Modal.jsx";
import useFetchResources from "../../hooks/useFetchResources.js";

// SVG icons (Lucide style, inline SVGs)
const ICONS = {
  manual: (
    <svg
      height="18"
      viewBox="0 0 24 24"
      width="18"
      fill="none"
      stroke="#355"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 17v-6a2 2 0 0 1 4 0v6" />
      <path d="M12 11V7a2 2 0 1 1 4 0v4" />
      <path d="M16 11V5a2 2 0 1 1 4 0v6" />
      <path d="M12 20v-1" />
      <path d="M8 20v-1" />
      <circle cx="12" cy="20" r="1" />
      <circle cx="8" cy="20" r="1" />
      <circle cx="16" cy="20" r="1" />
    </svg>
  ),
  total: (
    <svg
      height="18"
      viewBox="0 0 24 24"
      width="18"
      fill="none"
      stroke="#1f883d"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  min: (
    <svg
      height="18"
      viewBox="0 0 24 24"
      width="18"
      fill="none"
      stroke="#c08a00"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  progresivo: (
    <svg
      height="18"
      viewBox="0 0 24 24"
      width="18"
      fill="none"
      stroke="#0074d9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  repeat: (
    <svg
      height="18"
      viewBox="0 0 24 24"
      width="18"
      fill="none"
      stroke="#b34747"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  quiz: (
    <svg
      height="18"
      viewBox="0 0 24 24"
      width="18"
      fill="none"
      stroke="#295080"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="12" x="3" y="6" rx="2" />
      <path d="M12 12v.01" />
      <path d="M7 12v.01" />
      <path d="M17 12v.01" />
    </svg>
  ),
  date: (
    <svg
      height="18"
      viewBox="0 0 24 24"
      width="18"
      fill="none"
      stroke="#23446c"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  ),
};

const CLEAR_OUT_OPTIONS = [
  {
    label: "Manual (user marks complete)",
    value: "Manual",
    desc: "The session will only be marked as complete when the user decides to do so manually.",
    icon: ICONS.manual,
  },
  {
    label: "Perfect Score",
    value: "Perfect Score",
    desc: "The session will be marked as complete only if you answer all questions correctly.",
    icon: ICONS.total,
  },
  {
    label: "Minimum Performance (%)",
    value: "Minimum Performance",
    desc: "The session is marked as complete when you reach a minimum percentage of correct answers configured by you.",
    icon: ICONS.min,
  },
  {
    label: "Progressive Sessions (clear until correcting errors)",
    value: "Progressive",
    desc: "You will have successive sessions that only include previous errors, until you correct all your errors.",
    icon: ICONS.progresivo,
  },
  {
    label: "N Repetitions",
    value: "Repetitions",
    desc: "The session will be considered complete when you have completed the training N times.",
    icon: ICONS.repeat,
  },
];

const CLEAR_OUT_LABELS = {
  Manual: "Manual",
  "Perfect Score": "Perfect Score",
  "Minimum Performance": "Minimum Performance",
  Progressive: "Progressive",
  Repetitions: "N Repetitions",
};

const statusBadgeClass = (status) => {
  if (status === "Pending") return "badge badge-pending";
  if (status === "In Progress") return "badge badge-inprogress";
  if (status === "Completed") return "badge badge-completed";
  return "badge";
};

const mainActionLabel = (status) => {
  if (status === "Pending") return "Start";
  if (status === "In Progress") return "Continue";
  if (status === "Completed") return "View Report";
  return "";
};

const Accordion = ({ title, open, onToggle, children }) => (
  <div className="arena-accordion">
    <button
      type="button"
      className="arena-accordion-header"
      onClick={onToggle}
      aria-expanded={open}
    >
      <span>{title}</span>
      <span className={`arena-accordion-arrow${open ? " open" : ""}`}>▼</span>
    </button>
    {open && <div className="arena-accordion-body">{children}</div>}
  </div>
);

export default function Arena() {
  const navigate = useNavigate();
  const [modal, setModal] = useState({ open: false, mode: null });

  // ---- Quick Training Selection State ----
  const [quickSelected, setQuickSelected] = useState([]);

  // ---- New Training Session State ----
  const [accordionQuizOpen, setAccordionQuizOpen] = useState(true);
  const [selectedTraining, setSelectedTraining] = useState(undefined);
  const [clearOutType, setClearOutType] = useState(CLEAR_OUT_OPTIONS[0].value);
  const [enableDueDate, setEnableDueDate] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [minScore, setMinScore] = useState(80);
  const [repeatCount, setRepeatCount] = useState(3);
  const [randomQuestions, setRandomQuestions] = useState(false);
  const [randomSections, setRandomSections] = useState(false);
  const [allowBackQuestion, setAllowBackQuestion] = useState(true);
  const [allowBackSection, setAllowBackSection] = useState(true);

  const selectedClearOutObj =
    CLEAR_OUT_OPTIONS.find((o) => o.value === clearOutType) ||
    CLEAR_OUT_OPTIONS[0];

  const handleOpenSessionModal = () => {
    setSelectedTraining([]);
    setClearOutType(CLEAR_OUT_OPTIONS[0].value);
    setEnableDueDate(false);
    setDueDate("");
    setMinScore(80);
    setRepeatCount(3);
    setRandomQuestions(false);
    setRandomSections(false);
    setAllowBackQuestion(true);
    setAllowBackSection(true);
    setModal({ open: true, mode: "session" });
  };

  // -- QUICK TRAINING MODAL --
  const renderQuickTrainingModal = () => (
    <div>
      <p>
        <b>Select the quizzes for your Quick Training:</b>
      </p>
      <ResourceList
        resourceType="quiz"
        editable={false}
        selectable={true}
        onSelectionChange={setQuickSelected}
        renderItem={({ item, isSelected, onSelect }) => (
          <ResourceCard
            item={item}
            selectable={true}
            isSelected={isSelected}
            onSelect={onSelect}
            actions={[]}
          />
        )}
      />
      <div className="info-box" style={{ marginTop: 14 }}>
        <b>Preview:</b> Will create a training with{" "}
        <b>{quickSelected.length}</b> quiz
        {quickSelected.length !== 1 ? "zes" : ""}.
        {quickSelected.length > 0 && (
          <ul
            style={{
              margin: "8px 0 0 18px",
              fontSize: "1.01rem",
              color: "#1f883d",
            }}
          >
            {quickSelected.map((quiz) => (
              <li key={quiz.id || quiz.title}>{quiz.title || quiz}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const handleQuickStart = () => {
    if (quickSelected.length === 0) return;
    const training = {
      title: "Quick Training",
      sets: [
        {
          title: "Quick Training Set",
          resources: quickSelected.map((quiz) => ({
            ...quiz, // pasa todo el objeto!
            type: "quiz", // puedes sobrescribir/añadir type si quieres
          })),
          quizzes: quickSelected.map((quiz) => ({
            ...quiz, // pasa todo el objeto!
            type: "quiz", // puedes sobrescribir/añadir type si quieres
          })),
        },
      ],
    };

    setModal({ open: false, mode: null });
    navigate("/perform-training", {
      state: { training },
    });
  };

  const handleScheduleSession = () => {
    // Generar sessionId único (puedes usar Date.now por ahora)
    const sessionId = "SESSION_" + Date.now();

    // Construye el objeto de session
    const session = {
      sessionId,
      trainingTitle: selectedTraining,
      // Si tienes trainingId, agrégalo aquí
      status: "Pending",
      dueDate: enableDueDate ? dueDate : null,
      clearOutType,
      minScore: clearOutType === "Minimum Performance" ? minScore : undefined,
      repeatCount: clearOutType === "Repetitions" ? repeatCount : undefined,
      createdAt: new Date().toISOString(),
      settings: {
        randomQuestions,
        randomSections,
        allowBackQuestion,
        allowBackSection,
      },
    };

    setModal({ open: false, mode: null });
    // Aquí podrías guardar la sesión en el backend o actualizar el estado global
  };

  // -- NEW TRAINING SESSION MODAL --
  const renderNewSessionModal = () => {
    const {
      resources: fetchedTrainings,
      setResources: setFetchedResources,
      isLoading: fetchedLoading,
      error: fetchedError,
    } = useFetchResources("trainings");
    if (fetchedLoading) {
      return <h1>Loading</h1>;
    } else {
      return (
        <div>
          <p>
            <b>Select an existing training:</b>
          </p>
          <select
            className="arena-select"
            value={selectedTraining}
            onChange={(e) => setSelectedTraining(e.target.value)}
          >
            {fetchedTrainings.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <p>
            <b>Configure the session:</b>
          </p>
          <div className="arena-due-row">
            <label className="arena-label" style={{ marginBottom: 0 }}>
              Due Date
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={enableDueDate}
                onChange={() => setEnableDueDate(!enableDueDate)}
                aria-label="Enable Due Date"
              />
              <span className="slider" />
            </label>
          </div>
          {enableDueDate && (
            <input
              id="due-date"
              type="date"
              className="arena-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ marginBottom: 12 }}
            />
          )}
          <label className="arena-label" htmlFor="clearout">
            Clear Out Strategy:
          </label>
          <select
            className="arena-select"
            id="clearout"
            value={clearOutType}
            onChange={(e) => setClearOutType(e.target.value)}
          >
            {CLEAR_OUT_OPTIONS.map((opt) => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="clearout-desc">{selectedClearOutObj.desc}</div>
          {clearOutType === "Minimum Performance" && (
            <div className="arena-checkbox-row" style={{ marginTop: 5 }}>
              <label
                className="arena-label"
                style={{ margin: 0, minWidth: 80 }}
              >
                Min. %
              </label>
              <input
                type="number"
                className="arena-input"
                min={1}
                max={100}
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                style={{ maxWidth: 85, margin: 0 }}
              />
            </div>
          )}
          {clearOutType === "Repetitions" && (
            <div className="arena-checkbox-row" style={{ marginTop: 5 }}>
              <label
                className="arena-label"
                style={{ margin: 0, minWidth: 80 }}
              >
                N times
              </label>
              <input
                type="number"
                className="arena-input"
                min={1}
                max={20}
                value={repeatCount}
                onChange={(e) => setRepeatCount(e.target.value)}
                style={{ maxWidth: 85, margin: 0 }}
              />
            </div>
          )}

          {/* Quiz Settings: Accordion */}
          <Accordion
            title="Quiz Settings"
            open={accordionQuizOpen}
            onToggle={() => setAccordionQuizOpen((v) => !v)}
          >
            <div className="arena-checkbox-row" style={{ marginTop: 2 }}>
              <label className="arena-label" style={{ margin: 0, flex: 1 }}>
                Random order of <b>questions</b>
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={randomQuestions}
                  onChange={() => setRandomQuestions(!randomQuestions)}
                  aria-label="Random Questions"
                />
                <span className="slider" />
              </label>
            </div>
            <div className="arena-checkbox-row" style={{ marginTop: 10 }}>
              <label className="arena-label" style={{ margin: 0, flex: 1 }}>
                Random order of <b>sections</b>
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={randomSections}
                  onChange={() => setRandomSections(!randomSections)}
                  aria-label="Random Sections"
                />
                <span className="slider" />
              </label>
            </div>
            <div className="arena-checkbox-row" style={{ marginTop: 10 }}>
              <label className="arena-label" style={{ margin: 0, flex: 1 }}>
                Allow going to <b>previous question</b>
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={allowBackQuestion}
                  onChange={() => setAllowBackQuestion(!allowBackQuestion)}
                  aria-label="Back Question"
                />
                <span className="slider" />
              </label>
            </div>
            <div className="arena-checkbox-row" style={{ marginTop: 10 }}>
              <label className="arena-label" style={{ margin: 0, flex: 1 }}>
                Allow going to <b>previous section</b>
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={allowBackSection}
                  onChange={() => setAllowBackSection(!allowBackSection)}
                  aria-label="Back Section"
                />
                <span className="slider" />
              </label>
            </div>
          </Accordion>

          {/* --------- MODERN PREVIEW ---------- */}
          <div className="arena-session-preview" style={{ marginTop: 18 }}>
            <div className="arena-preview-title">Session Summary</div>
            <table className="arena-preview-table">
              <tbody>
                <tr>
                  <td className="arena-preview-icon">{ICONS.quiz}</td>
                  <td className="arena-preview-label">Training</td>
                  <td className="arena-preview-value">{selectedTraining}</td>
                </tr>
                <tr>
                  <td className="arena-preview-icon">
                    {selectedClearOutObj.icon}
                  </td>
                  <td className="arena-preview-label">Clear out</td>
                  <td className="arena-preview-value">
                    {selectedClearOutObj.label}
                    {clearOutType === "Minimum Performance" && (
                      <>&nbsp;({minScore}%)</>
                    )}
                    {clearOutType === "Repetitions" && (
                      <>&nbsp;({repeatCount}x)</>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="arena-preview-icon">{ICONS.date}</td>
                  <td className="arena-preview-label">Due date</td>
                  <td className="arena-preview-value">
                    {enableDueDate && dueDate ? (
                      <b>{dueDate}</b>
                    ) : (
                      <span style={{ color: "#aaa" }}>No due date</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <div style={{ height: 6 }} />
                  </td>
                </tr>
                <tr>
                  <td className="arena-preview-icon"></td>
                  <td className="arena-preview-label" colSpan={2}>
                    <b>Quiz settings:</b>
                  </td>
                </tr>
                <tr>
                  <td className="arena-preview-icon"></td>
                  <td className="arena-preview-label">Question order</td>
                  <td className="arena-preview-value">
                    {randomQuestions ? "Random" : "Original"}
                  </td>
                </tr>
                <tr>
                  <td className="arena-preview-icon"></td>
                  <td className="arena-preview-label">Section order</td>
                  <td className="arena-preview-value">
                    {randomSections ? "Random" : "Original"}
                  </td>
                </tr>
                <tr>
                  <td className="arena-preview-icon"></td>
                  <td className="arena-preview-label">
                    Go to previous question
                  </td>
                  <td className="arena-preview-value">
                    {allowBackQuestion ? "Yes" : "No"}
                  </td>
                </tr>
                <tr>
                  <td className="arena-preview-icon"></td>
                  <td className="arena-preview-label">
                    Go to previous section
                  </td>
                  <td className="arena-preview-value">
                    {allowBackSection ? "Yes" : "No"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="arena-container">
      <div className="arena-actions">
        <button onClick={() => setModal({ open: true, mode: "quick" })}>
          Quick Training
        </button>
        <button className="secondary" onClick={handleOpenSessionModal}>
          New Training Session
        </button>
      </div>

      <div className="arena-section-title">Your Training Sessions</div>

      <ResourceList
        resourceType="session"
        renderItem={({ item }) => (
          <div className="session-card" key={item.id}>
            <div className="session-info">
              <span className={statusBadgeClass(item.status)}>
                {item.status}
              </span>
              <div className="session-title">{item.trainingTitle}</div>
              <div className="session-meta">
                {CLEAR_OUT_LABELS[item.clearOutType] || item.clearOutType}
                {item.dueDate && (
                  <span style={{ marginLeft: 10 }}>Due: {item.dueDate}</span>
                )}
              </div>
            </div>
            <div className="session-actions">
              <button
                className="session-action-btn main"
                onClick={() => alert(mainActionLabel(item.status))}
                style={{ width: 120 }}
              >
                {mainActionLabel(item.status)}
              </button>
              <button
                className="session-action-btn outline"
                onClick={() => alert("Delete session")}
                style={{ width: 120 }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
        selectable={false}
        editable={false}
        filters={{}}
      />

      {/* MODALS */}
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, mode: null })}
      >
        <ModalHeader
          title={
            modal.mode === "quick"
              ? "Quick Training"
              : modal.mode === "session"
              ? "New Training Session"
              : ""
          }
          onClose={() => setModal({ open: false, mode: null })}
        />
        <ModalBody>
          {modal.mode === "quick"
            ? renderQuickTrainingModal()
            : modal.mode === "session"
            ? renderNewSessionModal()
            : null}
        </ModalBody>
        <ModalFooter>
          <button
            className="secondary-button"
            onClick={() => setModal({ open: false, mode: null })}
          >
            Cancel
          </button>
          <button
            className="primary-button"
            onClick={
              modal.mode === "quick"
                ? handleQuickStart
                : modal.mode === "session"
                ? handleScheduleSession
                : undefined
            }
            disabled={modal.mode === "quick" && quickSelected.length === 0}
          >
            {modal.mode === "quick" ? "Start" : "Schedule"}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
