import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "../../common/modal/Modal";
import TrainingManager from "../training/TrainingManager";
import QuizReport from "./QuizReport";
import "./quiz-report.css";

export default function TrainingReport({ completedTraining: propTraining }) {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewTraining, setPreviewTraining] = useState(null);

  const completedTraining =
    propTraining ||
    location.state?.completedTraining ||
    location.state?.training ||
    null;

  if (!completedTraining) return <div>No training report available</div>;
  const { title, sets } = completedTraining;

  return (
    <div className="training-report">
      <h1>{title} - Training Report</h1>
      {sets.map((set, i) => (
        <div key={i} className="training-set-report">
          <h3>{set.title}</h3>
          {set.resources?.map((quiz, j) => (
            <div key={j} className="training-quiz-report">
              <QuizReport completedQuiz={quiz} />
            </div>
          ))}
        </div>
      ))}

      <button className="basic-button" onClick={() => setModalOpen(true)}>
        Create Training
      </button>

      {modalOpen && (
        <Modal>
          <ModalHeader
            title="Create Training From Result"
            onClose={() => setModalOpen(false)}
          />
          <ModalBody>
            <TrainingManager
              executedTraining={completedTraining}
              mode="create-from-execution"
              onTrainingChanged={setPreviewTraining}
            />
            {previewTraining && (
              <pre className="debug-box" style={{ marginTop: "1rem" }}>
                {JSON.stringify(previewTraining, null, 2)}
              </pre>
            )}
          </ModalBody>
          <ModalFooter>
            <button
              className="secondary-button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="primary-button"
              onClick={() => {
                if (previewTraining) {
                  setModalOpen(false);
                }
              }}
              disabled={!previewTraining}
            >
              Add
            </button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
