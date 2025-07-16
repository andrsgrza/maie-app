import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FaEdit, FaTrash, FaKey, FaDownload, FaPlus } from "react-icons/fa";

import ResourceList from "../resource/ResourceList";
import ResourceCard from "../resource/ResourceCard";

import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";

import "./my-trainings.css";

function SetPreview({ set }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="set-preview">
      <div className="set-header" onClick={() => setOpen((o) => !o)}>
        <button className="toggle-btn">
          <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} />
        </button>
        <strong>{set.title}</strong>
      </div>
      {open && (
        <div className="training-quizzes-container">
          {set.quizzes?.map((quiz, qIdx) => (
            <div className="quiz-preview" key={qIdx}>
              <strong>{quiz.title}</strong>
              <div className="sections-preview">
                {quiz.sections?.map((section, secIdx) => (
                  <span key={secIdx} className="section-chip">
                    {section.title}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyTrainings() {
  const navigate = useNavigate();
  const {
    configureConfirmModal,
    toggleConfirmModal,
    configureHandleEntitlementModal,
  } = useModal();

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "OWNER":
        return "role-owner";
      case "READ_WRITE":
        return "role-read-write";
      case "READ_ONLY":
        return "role-read-only";
      default:
        return "role-unknown";
    }
  };

  const getRoleTooltip = (role) => {
    switch (role) {
      case "OWNER":
        return "You are the owner";
      case "READ_WRITE":
        return "You can edit";
      case "READ_ONLY":
        return "View only";
      default:
        return "Unknown permission";
    }
  };

  const handleCreateTraining = () => {
    navigate("/create-training");
  };

  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <button
          className="create-button"
          onClick={handleCreateTraining}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaPlus />
          Create Training
        </button>
      </div>

      <ResourceList
        resourceType="training"
        editable={true}
        renderItem={({
          item,
          onSelect,
          onDelete,
          isSelected,
          editable,
          selectable,
        }) => {
          const [isExpanded, setIsExpanded] = useState(false);

          const toggleExpanded = (e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          };

          const handleEdit = () => {
            navigate("/create-training", {
              state: { preloadedTraining: item, edit: true },
            });
          };

          const handleEntitlements = () => {
            configureHandleEntitlementModal({
              resourceId: item.id,
              isOpen: true,
            });
          };

          const handleDownload = () => {
            const json = JSON.stringify(item, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${item.title.replace(/\s+/g, "_")}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          };

          const handleRemove = () => {
            let isSubmitting = false;
            configureConfirmModal({
              isOpen: true,
              title: "Confirm training deletion",
              message: "Are you sure you want to remove this training?",
              onClose: () => {
                if (!isSubmitting) toggleConfirmModal();
              },
              buttonAClass: "cancel-button",
              buttonBClass: "delete-button",
              buttonAContent: "Cancel",
              buttonBContent: "Delete",
              onConfirm: async () => {
                try {
                  isSubmitting = true;
                  await onDelete(item.id);
                  toggleConfirmModal();
                } catch (error) {
                  isSubmitting = false;
                  toggleConfirmModal();
                }
              },
            });
          };

          return (
            <ResourceCard
              item={item}
              resourceType="training"
              onSelect={onSelect}
              isSelected={isSelected}
              selectable={selectable}
              roleBadgeClass={getRoleBadgeClass(item.entitlementRole)}
              roleTooltip={getRoleTooltip(item.entitlementRole)}
              actions={[
                {
                  label: "Edit",
                  icon: <FaEdit />,
                  className: "edit",
                  onClick: handleEdit,
                },
                {
                  label: "Entitlements",
                  icon: <FaKey />,
                  className: "entitlement",
                  onClick: handleEntitlements,
                },
                {
                  label: "Download",
                  icon: <FaDownload />,
                  className: "download",
                  onClick: handleDownload,
                },
                {
                  label: "Remove",
                  icon: <FaTrash />,
                  className: "danger",
                  onClick: handleRemove,
                },
              ]}
            >
              <div className="training-card-header">
                <button className="toggle-btn" onClick={toggleExpanded}>
                  <FontAwesomeIcon
                    icon={isExpanded ? faChevronDown : faChevronRight}
                  />
                </button>
                <span>{`Sets: ${item.sets.length}`}</span>
              </div>
              {isExpanded && (
                <div className="sets-container">
                  {item.sets?.map((set, sIdx) => (
                    <SetPreview key={sIdx} set={set} />
                  ))}
                </div>
              )}
            </ResourceCard>
          );
        }}
      />
    </div>
  );
}
