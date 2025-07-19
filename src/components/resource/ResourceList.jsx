import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFetchResources from "../../hooks/useFetchResources";
import { MESSAGES } from "../../common/constants";
import { useBanner } from "../../context/BannerContext";
import { useModal } from "../../context/ModalContext";
import "./resource-list.css";
// Add this at the top of ResourceList.jsx
import mockTrainings from "../../../resources/mock-trainings.json";

export default function ResourceList({
  resourceType,
  renderItem,
  selectable = false,
  editable = false,
  onSelectionChange,
  filters = {},
}) {
  const {
    items: fetchedItems,
    setItems: setFetchedItems,
    isLoading: fetchedLoading,
    error: fetchedError,
  } = useFetchResources(resourceType, filters);

  const isTraining = resourceType === "training";
  const items = isTraining ? mockTrainings : fetchedItems;
  const setItems = isTraining ? () => {} : setFetchedItems;
  const isLoading = isTraining ? false : fetchedLoading;
  const error = isTraining ? null : fetchedError;

  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { addBanner } = useBanner();
  const { configureImportModal, toggleImportModal } = useModal();

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  const handleSelect = (item) => {
    if (!selectable) return;
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  };

  const handleDelete = async (itemId) => {
    if (!editable) return;
    try {
      const client = getClient();
      await client.delete(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      console.error("Error deleting item", err);
      throw err;
    }
  };

  const getClient = () => {
    switch (resourceType) {
      case "quiz":
        return require("../../api/quiz-client").default;
      case "training":
        return require("../../api/training-client").default;
      default:
        throw new Error("Unsupported resource type: " + resourceType);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openImportModal = () => {
    configureImportModal({
      isOpen: true,
      title: "Import Quiz",
      onClose: () => toggleImportModal(),
      postImport: postImportQuiz,
    });
    setIsDropdownOpen(false);
  };

  const postImportQuiz = (res) => {
    addBanner(
      MESSAGES.API_MESSAGES.POST_QUIZ[res.status].TYPE,
      MESSAGES.API_MESSAGES.POST_QUIZ[res.status].TITLE,
      MESSAGES.API_MESSAGES.POST_QUIZ[res.status].MESSAGE
    );
    if (res.status >= 200 && res.status < 300) {
      toggleImportModal();
      setItems((prevItems) => [...prevItems, res.data]);
    }
  };

  const getContent = () => {
    if (isLoading) return <h3>Loading...</h3>;
    if (error) return <h3>{error}</h3>;
    if (!items || items.length === 0) return <h3>No items found</h3>;

    return (
      <div className="resource-list-items">
        {items.map((item) => (
          <React.Fragment key={item.id}>
            {renderItem({
              item,
              isSelected: selectedItems.some((i) => i.id === item.id),
              onSelect: () => handleSelect(item),
              onDelete: () => handleDelete(item.id),
              editable,
              selectable,
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderAddButton = () => {
    if (resourceType !== "quiz" || !editable) return null;

    return (
      <div className="add-resource-wrapper">
        {isDropdownOpen && (
          <div className="add-resource-dropdown">
            <Link to="/quiz-manager" className="add-resource-dropdown-item">
              <i className="fas fa-plus"></i>
              Create New Quiz
            </Link>
            <button
              className="add-resource-dropdown-item"
              onClick={openImportModal}
            >
              <i className="fas fa-file-import"></i>
              Import JSON
            </button>
          </div>
        )}
        <button className="add-resource-button" onClick={toggleDropdown}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="resource-list-container">
      {getContent()}
      {renderAddButton()}
    </div>
  );
}
