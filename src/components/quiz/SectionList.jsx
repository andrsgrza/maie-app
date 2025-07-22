import React, { useState } from "react";
import Section from "./Section";

export default function SectionList({
  sections,
  updateSection,
  deleteSection,
  addSection,
  highlightedSections = [],
  edit,
}) {
  return (
    <div className="section-list">
      {sections.map((section, index) => (
        <Section
          key={index}
          section={section}
          updateSection={(updatedSection) =>
            updateSection(index, updatedSection)
          }
          deleteSection={() => deleteSection(index)}
          hasError={highlightedSections.includes(index)}
          isFirstSection={index === 0}
          edit={edit}
        />
      ))}
      <button className="add-section-button" onClick={addSection}>
        Add Section
      </button>
    </div>
  );
}
