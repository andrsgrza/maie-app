import React from "react";
import { useModal } from "../../context/ModalContext";
import { useNavigate } from "react-router-dom";
import ResourceList from "../resource/ResourceList";
import ResourceCard from "../resource/ResourceCard";

export default function Arena() {
  const { configureSelectModal, toggleSelectModal } = useModal();
  const navigate = useNavigate();

  const createTrainingFromQuizzes = (quizzes) => {
    return {
      id: "TEMP_" + Date.now(),
      title: "Quick Training",
      sets: [
        {
          title: "Quick Set",
          quizzes: quizzes.map((q) => ({
            quizId: q.id,
            title: q.title,
            sections: q.sections || [],
          })),
        },
      ],
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      lastPerformed: null,
      entitlementRole: "OWNER",
      resourceEntitlement: [],
    };
  };

  const handleQuickTraining = () => {
    console.log("CLICK: handleQuickTraining");

    configureSelectModal({
      isOpen: true,
      title: "Select Quizzes for Quick Training",
      selector: (setSelectedItems) => (
        <ResourceList
          resourceType="quiz"
          editable={false}
          selectable={true}
          onSelectionChange={setSelectedItems}
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
      ),
      onAdd: (selectedQuizzes) => {
        console.log("Selected quizzes:", selectedQuizzes);
        toggleSelectModal();
        const training = createTrainingFromQuizzes(selectedQuizzes);
        navigate("/perform-training", {
          state: { training },
        });
      },
      onClose: () => {
        console.log("Quick training modal closed");
      },
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Arena</h2>
      <button className="create-button" onClick={handleQuickTraining}>
        Quick Quiz Training
      </button>
    </div>
  );
}
