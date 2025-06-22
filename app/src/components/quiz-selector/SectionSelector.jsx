import React, { useEffect, useState } from "react";
import ButtonBar from "../ButtonBar";
import "./SectionSelector.css"; // Ensure to import the CSS file

const SectionSelector = ({
  quizTitle,
  sections,
  selectedSections,
  onChange,
  onContinue,
}) => {
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    if (selectAll) {
      const allTitles = sections.map((section) => section.title);
      onChange(allTitles);
    }
  }, []);

  const handleSectionChange = (item) => {
    let newSelectedSections;

    if (selectedSections.includes(item)) {
      newSelectedSections = selectedSections.filter((s) => s !== item);
    } else {
      newSelectedSections = [...selectedSections, item];
    }

    onChange(newSelectedSections);

    if (newSelectedSections.length === sections.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      // Deselect all
      onChange([]);
    } else {
      // Select all
      const allTitles = sections.map((section) => section.title);
      onChange(allTitles);
    }
    setSelectAll(!selectAll); // Toggle the selectAll state
  };

  return (
    <div className="section-selector">
      <h3 className="quiz-title">{quizTitle}</h3>
      <div className="section-item">
        <div className="select-all-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">Select All</span>
        </div>
        {/* <button
          className={`select-all-button ${selectAll ? "selected" : ""}`}
          onClick={handleSelectAllChange}
        >
          {selectAll ? "Unselect All" : "Select All"}
        </button> */}
      </div>
      {sections.map(({ title }) => (
        <div key={title} className="section-item">
          <button
            className={`section-button ${
              selectedSections.includes(title) ? "selected" : ""
            }`}
            onClick={() => handleSectionChange(title)}
          >
            {title}
          </button>
        </div>
      ))}
      {selectedSections.length === 0 && (
        <div className="no-selection-message">
          Please select at least one section to continue.
        </div>
      )}
    </div>
  );
};

export default SectionSelector;
