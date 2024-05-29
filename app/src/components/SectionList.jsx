import React, { useState } from 'react';
import Section from './Section';

export default function SectionList({ sections, updateSection, deleteSection, addSection, quizTitle, setQuizTitle, highlightedSections }) {
    const [isEditingQuizTitle, setIsEditingQuizTitle] = useState(false);

    const handleQuizTitleChange = (event) => {
        setQuizTitle(event.target.value);
    };

    const saveQuizTitle = () => {
        setIsEditingQuizTitle(false);
    };

    return (
        <div className='section-list'>
            {isEditingQuizTitle ? (
                <input
                    type="text"
                    value={quizTitle}
                    onChange={handleQuizTitleChange}
                    onBlur={saveQuizTitle}
                    onKeyPress={(e) => e.key === 'Enter' && saveQuizTitle()}
                    autoFocus
                    className='quiz-title-input'
                />
            ) : (
                <h1 onClick={() => setIsEditingQuizTitle(true)} className='quiz-title'>{quizTitle}</h1>
            )}
            {sections.map((section, index) => (
                <Section
                    key={index}
                    section={section}
                    updateSection={(updatedSection) => updateSection(index, updatedSection)}
                    deleteSection={() => deleteSection(index)}
                    hasError={highlightedSections.includes(index)}
                    isFirstSection={index === 0}
                />
            ))}
            <button className='add-section-button' onClick={addSection}>Add Section</button>
        </div>
    );
}
