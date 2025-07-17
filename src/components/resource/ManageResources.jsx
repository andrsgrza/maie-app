import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ResourceList from "./ResourceList";
import ResourceCard from "./ResourceCard";
import { useModal } from "../../context/ModalContext";
import { FaEdit, FaTrash, FaKey, FaDownload, FaPlus } from "react-icons/fa";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./manage-resources.css";

export default function ManageResources({ resourceType = "quiz" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    configureConfirmModal,
    toggleConfirmModal,
    configureHandleEntitlementModal,
  } = useModal();

  const isTraining = resourceType === "training";

  const [openSetsByResource, setOpenSetsByResource] = useState({});
  const [openSubsetsByResource, setOpenSubsetsByResource] = useState({});

  const toggleResourceSets = (resourceId) => {
    setOpenSetsByResource((prev) => ({
      ...prev,
      [resourceId]: !prev[resourceId],
    }));
  };

  const toggleSubset = (resourceId, index) => {
    setOpenSubsetsByResource((prev) => {
      const current = prev[resourceId] || [];
      return {
        ...prev,
        [resourceId]: current.includes(index)
          ? current.filter((i) => i !== index)
          : [...current, index],
      };
    });
  };

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

  const handleEdit = (item) => {
    const route = isTraining ? "/create-training" : "/create-quiz";
    navigate(route, {
      state: {
        [isTraining ? "preloadedTraining" : "preloadedQuiz"]: item,
        edit: true,
      },
    });
  };

  const handleEntitlements = (item) => {
    configureHandleEntitlementModal({
      resourceId: item.id,
      isOpen: true,
    });
  };

  const handleDownload = (item) => {
    const dataStr = JSON.stringify(item, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.title.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRemove = (item, onDelete) => {
    let isSubmitting = false;
    configureConfirmModal({
      isOpen: true,
      title: `Confirm ${resourceType} deletion`,
      message: `Are you sure you want to remove this ${resourceType}?`,
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
    <div className="page-container">
      {isTraining && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <button
            className="create-button"
            onClick={() => navigate("/create-training")}
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
      )}

      <ResourceList
        resourceType={resourceType}
        editable={true}
        renderItem={({
          item,
          onDelete,
          isSelected,
          onSelect,
          editable,
          selectable,
        }) => {
          const setsOpen = openSetsByResource[item.id] || false;
          const openSubsets = openSubsetsByResource[item.id] || [];

          return (
            <ResourceCard
              item={item}
              resourceType={resourceType}
              selectable={selectable}
              isSelected={isSelected}
              onSelect={onSelect}
              roleBadgeClass={getRoleBadgeClass(item.entitlementRole)}
              roleTooltip={getRoleTooltip(item.entitlementRole)}
              actions={[
                {
                  label: "Edit",
                  icon: <FaEdit />,
                  className: "edit",
                  onClick: () => handleEdit(item),
                },
                {
                  label: "Entitlements",
                  icon: <FaKey />,
                  className: "entitlement",
                  onClick: () => handleEntitlements(item),
                },
                {
                  label: "Download",
                  icon: <FaDownload />,
                  className: "download",
                  onClick: () => handleDownload(item),
                },
                {
                  label: "Remove",
                  icon: <FaTrash />,
                  className: "danger",
                  onClick: () => handleRemove(item, onDelete),
                },
              ]}
            >
              {isTraining && (
                <>
                  <div
                    className="training-card-header"
                    onClick={() => toggleResourceSets(item.id)}
                  >
                    <button className="toggle-btn">
                      <FontAwesomeIcon
                        icon={setsOpen ? faChevronDown : faChevronRight}
                      />
                    </button>
                    <span className="sets-label">Sets:</span>
                    <span className="sets-count">{item.sets.length}</span>
                  </div>
                  {setsOpen && (
                    <div className="sets-container">
                      {item.sets?.map((set, sIdx) => (
                        <div className="set-preview" key={sIdx}>
                          <div
                            className="set-header"
                            onClick={() => toggleSubset(item.id, sIdx)}
                          >
                            <button className="toggle-btn">
                              <FontAwesomeIcon
                                icon={
                                  openSubsets.includes(sIdx)
                                    ? faChevronDown
                                    : faChevronRight
                                }
                              />
                            </button>
                            <strong>{set.title}</strong>
                          </div>
                          {openSubsets.includes(sIdx) && (
                            <div className="training-quizzes-container">
                              {set.quizzes?.map((quiz) => (
                                <div
                                  className="quiz-preview"
                                  key={quiz.quizId || quiz.title}
                                >
                                  <strong>{quiz.title}</strong>
                                  <div className="sections-preview">
                                    {quiz.sections?.map((section) => (
                                      <span
                                        key={section.title}
                                        className="section-chip"
                                      >
                                        {section.title}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </ResourceCard>
          );
        }}
      />
    </div>
  );
}
