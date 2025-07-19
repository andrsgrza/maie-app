import React, { useState } from "react";
import { useModal } from "../../context/ModalContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./quiz-report.css";

export default function TrainingReport({ completedTraining: propTraining }) {
  const location = useLocation();
  const locationTraining = location.state?.completedTraining;
  const completedTraining = propTraining || locationTraining;

  if (!completedTraining) return <div>No training report available</div>;

  const { title, sets } = completedTraining;
  const { configureSelectModal, toggleSelectModal } = useModal();

  const [trainingSaved, setTrainingSaved] = useState(false);

  const navigate = useNavigate();

  const handleOpenCreationModal = () => {
    navigate("/training-manager", {
      state: {
        page: "create-from-execution",
        executedTraining: completedTraining,
      },
    });

    // configureSelectModal({
    //   isOpen: true,
    //   title: "Create Training From Result",
    //   selector: () => {},
    //   onAdd: () => {
    // if (!selectedMode) return;
    // const trainingToSave = buildTrainingByMode(selectedMode);
    // trainingToSave.title = newTitle;
    // console.log("💾 Saving new training:", trainingToSave);
    // toggleSelectModal();
    // setTrainingSaved(true);
    //   },
    //   onClose: () => toggleSelectModal(),
    //   confirmButtonText: "Create Training",
    // });
  };

  return (
    <div className="training-report">
      <h1>{title} - Training Report</h1>

      {sets.map((set, i) => (
        <div key={i} className="training-set-report">
          <h3>{set.title}</h3>
          {set.resources?.map((quiz, j) => (
            <div key={j} className="training-quiz-report">
              <h4>{quiz.title}</h4>
              {quiz.sections?.map((section, k) => (
                <div key={k} className="training-section-report">
                  <h5>{section.title}</h5>
                  <ul>
                    {section.items?.map((item, idx) => (
                      <li
                        key={idx}
                        className={
                          item.isAnswerCorrect ? "correct" : "incorrect"
                        }
                      >
                        <strong>Q:</strong> {item.question} <br />
                        <strong>Your Answer:</strong> {item.answer} <br />
                        <strong>Correct:</strong>{" "}
                        {item.isAnswerCorrect ? "✔" : "✘"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <button className="basic-button" onClick={handleOpenCreationModal}>
        Create Training
      </button>

      {trainingSaved && (
        <div className="redo-training-saved-message">
          <p>Training 'Training title' successfully saved (console only)</p>
        </div>
      )}
    </div>
  );
}
