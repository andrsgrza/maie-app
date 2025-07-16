import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaEdit, FaTrash, FaKey, FaDownload } from "react-icons/fa";

import ResourceList from "../resource/ResourceList";
import ResourceCard from "../resource/ResourceCard";

import { useModal } from "../../context/ModalContext";

export default function MyQuizzes({ editable = true, selectable = false }) {
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const {
    configureHandleEntitlementModal,
    configureConfirmModal,
    toggleConfirmModal,
  } = useModal();
  const navigate = useNavigate();

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

  const handleEdit = (quiz) => {
    navigate("/create-quiz", {
      state: { preloadedQuiz: quiz, edit: true },
    });
  };

  const handleEntitlements = (quiz) => {
    configureHandleEntitlementModal({
      resourceId: quiz.id,
      isOpen: true,
    });
  };

  const handleDownload = (quiz) => {
    const quizJson = JSON.stringify(quiz, null, 2);
    const blob = new Blob([quizJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quiz.title.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ResourceList
      resourceType="quiz"
      editable={editable}
      selectable={selectable}
      renderItem={({ item, onDelete, isSelected, onSelect }) => (
        <ResourceCard
          key={item.id}
          item={item}
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
              onClick: handleEdit,
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
              onClick: () => {
                let isSubmitting = false;
                configureConfirmModal({
                  isOpen: true,
                  title: "Confirm quiz deletion",
                  message: "Are you sure you want to remove this quiz?",
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
                      const msg = `Failed to delete quiz: ${error.message}`;
                      configureConfirmModal({
                        isOpen: true,
                        title: "Error",
                        message: msg,
                        onClose: () => toggleConfirmModal(),
                        buttonAClass: "cancel-button",
                        buttonBClass: "delete-button",
                        buttonAContent: "Close",
                        buttonBContent: "Retry",
                        onConfirm: async () => {
                          toggleConfirmModal();
                        },
                      });
                      console.error(msg);
                      isSubmitting = false;
                    }
                  },
                });
              },
            },
          ]}
        />
      )}
    />
  );
}
