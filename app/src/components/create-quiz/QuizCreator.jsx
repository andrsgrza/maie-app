import React, { useState, useEffect } from 'react';
import SectionList from './SectionList';
import { saveAs } from 'file-saver';
import { postQuiz } from '../../quiz-client';
import { useLocation } from 'react-router-dom';

export default function QuizCreator() {
    const [sections, setSections] = useState([{ title: 'Section 1', items: [] }]);
    const [quizTitle, setQuizTitle] = useState('Quiz Title');
    const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });
    const [highlightedSections, setHighlightedSections] = useState([]);
    const location = useLocation();
    const { quiz, edit } = location.state || {};

    useEffect(() => {
        console.log(location.state)
        if (quiz) {
            setSections(quiz.sections);
            setQuizTitle(quiz.title);
            console.log("there is quiz",quiz.sections);
        } else {
            console.log("there is no quiz");
        }
    }, [quiz]);

    const addSection = () => {
        setSections([...sections, { title: `Section ${sections.length + 1}`, items: [] }]);
    };

    const updateSection = (index, updatedSection) => {
        const newSections = sections.map((section, i) => (i === index ? updatedSection : section));
        setSections(newSections);

        // Remove from highlightedSections if the section now has items
        if (updatedSection.items.length > 0) {
            const newHighlightedSections = highlightedSections.filter(sectionIndex => sectionIndex !== index);
            setHighlightedSections(newHighlightedSections);
            
            // Only clear the error message if there are no highlighted sections left
            if (newHighlightedSections.length === 0) {
                setSaveMessage({ text: '', type: '' });
            }
        }
    };

    const deleteSection = (index) => {
        if (index === 0) return; 
        const newSections = sections.filter((_, i) => i !== index);
        setSections(newSections);
    };

    const saveQuiz = () => {
        const emptySections = sections.map((section, index) => section.items.length === 0 ? index : null).filter(index => index !== null);
        if (emptySections.length > 0) {
            setSaveMessage({ text: 'All sections must have at least one question.', type: 'error' });
            setHighlightedSections(emptySections);
        } else {
            const quiz = {
                title: quizTitle,                
                quizid: 2,
                metadata: {
                    author: "agarza",
                    description:"This is another demo quiz",
                    lastPerformed:"2024-06-15"
                },
                sections
            };
            const quizJson = JSON.stringify(quiz, null, 2);
            console.log("quiz", quizJson);
            postQuiz(quiz)
            console.log("Quiz allegedly saved!");
            // const blob = new Blob([quizJson], { type: "application/json;charset=utf-8" });
            // saveAs(blob, `${quizTitle.replace(/\s+/g, '_').toLowerCase()}.json`);
            // setSaveMessage({ text: 'Quiz saved successfully!', type: 'success' });
            // setHighlightedSections([]);
        }
    };

    return (
        <div className='quiz-creator'>
            <SectionList 
                sections={sections} 
                updateSection={updateSection} 
                deleteSection={deleteSection} 
                addSection={addSection} 
                quizTitle={quizTitle} 
                setQuizTitle={setQuizTitle} 
                highlightedSections={highlightedSections}
                edit={edit}
            />
            <div className='save-quiz-container'>
                {saveMessage.text && (
                    <p className={`save-message ${saveMessage.type}`}>
                        {saveMessage.text}
                    </p>
                )}
                <button 
                    className='save-quiz-button' 
                    onClick={saveQuiz}
                >
                    Save Quiz
                </button>
            </div>
        </div>
    );
}
