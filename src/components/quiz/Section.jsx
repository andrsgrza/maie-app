import React, { useState, useEffect } from "react";
import ItemList from "./ItemList";
import Item from "./item.js";
import "./Section.css";

export default function Section({
  section,
  updateSection,
  deleteSection,
  hasError,
  isFirstSection,
  edit,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sectionTitle, setSectionTitle] = useState(section.title);
  const [isAddingItem, setIsAddingItem] = useState(section.items.length === 0);
  const [keepOpen, setKeepOpen] = useState(false);
  const [items, setItems] = useState(section.items || []);

  const [showAddItemButton, setShowAddItemButton] = useState(false);

  useEffect(() => {
    if (edit) {
      setIsAddingItem(section.items.length === 0);
      setSectionTitle(section.title);
      setItems(section.items);
    }
  }, [section.items, edit]);

  const addItem = (item) => {
    const newItems = [...items, item];
    const updatedItems = newItems.map((existingItem) => {
      return { ...existingItem, newElement: "value" };
    });

    setItems(newItems);

    updateSection({ ...section, items: newItems });
    if (!keepOpen) {
      setIsAddingItem(false);
    }
  };

  const updateItem = (updatedItem, index) => {
    const newItems = items.map((item, idx) =>
      index === idx ? new Item(updatedItem.question, updatedItem.answer) : item
    );
    setItems(newItems);
    updateSection({ ...section, items: newItems });
    setShowAddItemButton(true);
  };

  const handleEditModeToggle = (index) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, editMode: !item.editMode } : item
    );

    setItems(updatedItems);
    updateSection({ ...section, items: updatedItems });
  };

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    updateSection({ ...section, items: newItems });
    if (newItems.length === 0) {
      setIsAddingItem(true);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleAddItem = () => {
    setIsAddingItem(!isAddingItem);
  };

  const handleTitleChange = (event) => {
    setSectionTitle(event.target.value);
  };

  const saveTitle = () => {
    setIsEditingTitle(false);
    updateSection({ ...section, title: sectionTitle });
  };

  return (
    <div className={`section ${hasError ? "section-error" : ""}`}>
      <div className="section-header">
        <div className="collapse-icon" onClick={toggleCollapse}>
          {isCollapsed ? (
            <i className="fas fa-chevron-down"></i>
          ) : (
            <i className="fas fa-chevron-up"></i>
          )}
        </div>
        {isEditingTitle ? (
          <input
            type="text"
            value={sectionTitle}
            onChange={handleTitleChange}
            onBlur={saveTitle}
            onKeyPress={(e) => e.key === "Enter" && saveTitle()}
            autoFocus
          />
        ) : (
          <h2 onClick={() => setIsEditingTitle(true)}>{section.title}</h2>
        )}
        <div className="section-actions">
          {!isFirstSection && (
            <button onClick={deleteSection}>
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
      </div>
      {!isCollapsed && (
        <>
          <ItemList
            items={items}
            isAddingItem={isAddingItem}
            deleteItem={deleteItem}
            updateItem={updateItem}
            addItem={addItem}
            toggleAddItem={toggleAddItem}
            handleEditModeToggle={handleEditModeToggle}
            setKeepOpen={setKeepOpen}
            keepOpen={keepOpen}
            hasSubmitted={showAddItemButton}
          />
          {!isAddingItem && (
            <button className="add-item-button" onClick={toggleAddItem}>
              Add Item
            </button>
          )}
        </>
      )}
    </div>
  );
}
