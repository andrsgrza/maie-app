import React, { useState, useEffect, useRef } from "react";
import "./quiz-item.css";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaKey, FaDownload, FaCog } from "react-icons/fa";
import { useModal } from "../../context/ModalContext";
import { formatRoleName } from "../../util/stringParser";

const QuizItem = ({
  quiz,
  isSelected,
  onSelect,
  onDelete,
  editable,
  selectible,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownAlignment, setDropdownAlignment] = useState("left");
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);
  const {
    configureConfirmModal,
    toggleConfirmModal,
    toggleHandleEntitlementModal,
    configureHandleEntitlementModal,
  } = useModal();

  // Using useNavigate hook for navigation
  const navigate = useNavigate();

  useEffect(() => {
    if (dropdownOpen && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const isOverflowingRight = dropdownRect.right > window.innerWidth;
      // Only update the alignment if it's the first time opening
      if (dropdownAlignment === "left" && isOverflowingRight) {
        setDropdownAlignment("right");
      }
    }
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        toggleRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !toggleRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to navigate to edit page
  const handleEdit = () => {
    navigate("/create-quiz", {
      state: { preloadedQuiz: quiz, edit: true },
    });
  };

  const calculateDaysSinceLastPerformance = (creationDateDate) => {
    const lastDate = new Date(creationDateDate);
    const currentDate = new Date();
    const differenceInTime = currentDate - lastDate;
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
  };
  const handleDownloadQuiz = () => {
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

  const handleRemoveClick = (e) => {
    e.stopPropagation();

    configureConfirmModal({
      isOpen: true,
      title: "Confirm quiz deletion",
      message: "Are you sure you want to delete this quiz?",
      onClose: () => toggleConfirmModal(),
      buttonAClass: "cancel-button",
      buttonBClass: "delete-button",
      buttonAContent: "Cancel",
      buttonBContent: "Delete",
      onConfirm: () => {
        try {
          onDelete(quiz.id);
          toggleConfirmModal();
        } catch (error) {}
      },
    });
  };

  const handleOpenEntitlementModal = () => {
    configureHandleEntitlementModal({
      resourceId: quiz.id,
    });
    toggleHandleEntitlementModal();
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(dateString).toLocaleDateString("en-EN", options);
  };

  return (
    <div
      className={`quiz-item ${isSelected ? "selected" : ""}  ${
        selectible ? "quiz-item-selectible" : ""
      }`}
      onClick={() => (quiz.redo ? onSelect(quiz.id) : onSelect(quiz.id))}
    >
      <div className="quiz-item-header">
        <h3>{quiz.title}</h3>
        <p>{formatRoleName(quiz.entitlementRole)}</p>
        <p>{quiz.description}</p>
        {editable ? (
          <p>Created on {formatDate(quiz.createdAt)}</p>
        ) : (
          <p>
            Last performed {calculateDaysSinceLastPerformance(quiz.createdAt)}{" "}
            days ago
          </p>
        )}
      </div>
      {editable && (
        <div className="quiz-item-actions">
          <div className="dropdown-wrapper">
            <button
              className="dropdown-toggle"
              onClick={toggleDropdown}
              ref={toggleRef}
            >
              <FaCog />
            </button>

            {dropdownOpen && (
              <ul
                className={`dropdown-menu2 ${
                  dropdownAlignment === "right" ? "dropdown-align-right" : ""
                }`}
                ref={dropdownRef}
              >
                <li
                  className="entitlement-element"
                  onClick={handleOpenEntitlementModal}
                >
                  <FaKey className="icon" /> Entitlements
                </li>
                <li className="edit-element" onClick={handleEdit}>
                  <FaEdit className="icon" /> Edit
                </li>
                <li className="download-element" onClick={handleDownloadQuiz}>
                  <FaDownload className="icon" /> Download
                </li>
                <li className="delete-element" onClick={handleRemoveClick}>
                  <FaTrash className="icon" /> Remove
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizItem;
