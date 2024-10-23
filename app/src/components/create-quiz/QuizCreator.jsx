import React, { useState, useEffect } from 'react';
import SectionList from './SectionList';
import { BackButton } from '../../common/BackButton';
import QuizClient from '../../api/quiz-client';
import { useLocation } from 'react-router-dom';
import protoQuiz from '../../../resources/proto-quiz.json';
import './quiz-editor.css'
import { useNavigate } from 'react-router-dom';
import { useBanner } from '../../context/BannerContext';
import { MESSAGES } from '../../common/constants';

export default function QuizCreator() {
    const [isEditingQuizTitle, setIsEditingQuizTitle] = useState(false);    
    const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });
    const [highlightedSections, setHighlightedSections] = useState([]);
    const [forgedQuiz, setForgedQuiz] = useState(protoQuiz);
    const { addBanner } = useBanner();
    const location = useLocation();
    
    // quiz is preloaded quiz recieved on endit
    // TODO change quiz to preloadedQuiz and remove unecessary edit by checking if quiz exists
    const { preloadedQuiz, edit } = location.state || {};
    const navigate = useNavigate();

    useEffect(() => {
        if (preloadedQuiz) {
            setForgedQuiz(preloadedQuiz)
        } 
    }, [preloadedQuiz]);

    const updateForgedQuizTitle = (event) => {
        console.log("updating forged quiz title")
        setForgedQuiz((prevState) => ({
            ...prevState,
            title: event.target.value
        }));
    };


    const exitTitleEdit = () => {
        setIsEditingQuizTitle(false);
    };

    const handleQuizDescriptionChange = (event) => {
        setForgedQuiz((prevState) => ({
            ...prevState,
            metadata: {
                ...prevState.metadata,
                description: event.target.value
            }
        }));
    };

    

    const addSection = () => {
        setForgedQuiz((prevQuiz) => ({
            ...prevQuiz,
            sections: [...prevQuiz.sections, { title: `Section ${prevQuiz.sections.length + 1}`, items: [] }]
        }));
    };
    
    const updateSection = (index, updatedSection) => {
        setForgedQuiz((prevQuiz) => {
            const newSections = prevQuiz.sections.map((section, i) => (i === index ? updatedSection : section));
            return {
                ...prevQuiz,
                sections: newSections
            };
        });
    
        if (updatedSection.items.length > 0) {
            const newHighlightedSections = highlightedSections.filter(sectionIndex => sectionIndex !== index);
            setHighlightedSections(newHighlightedSections);
    
            if (newHighlightedSections.length === 0) {
                setSaveMessage({ text: '', type: '' });
            }
        }
    };
    
    const deleteSection = (index) => {
        if (index === 0) return; // Prevent deletion of the first section
        setForgedQuiz((prevQuiz) => {
            const newSections = prevQuiz.sections.filter((_, i) => i !== index);
            return {
                ...prevQuiz,
                sections: newSections
            };
        });
    };
    

    const handleSaveQuiz = async () => {
        console.log("saving quiz");
        const emptySections = forgedQuiz.sections.map((section, index) => section.items.length === 0 ? index : null).filter(index => index !== null);
        if (emptySections.length > 0) {
            setSaveMessage({ text: 'All sections must have at least one question submitted.', type: 'error' });
            setHighlightedSections(emptySections);
        } else {
            console.log("empty sections", emptySections);
            const quizJson = JSON.stringify(forgedQuiz, null, 2);
            console.log("quiz", quizJson);
                try{
                    let response;
                    if(preloadedQuiz){
                        response = await QuizClient.updateQuiz(forgedQuiz)
                    }else {
                        response = await QuizClient.postQuiz(forgedQuiz)
                    }
                    console.log('edit response', response)
                    addBanner(
                        MESSAGES.API_MESSAGES.PUT_QUIZ[response.status].TYPE,
                        MESSAGES.API_MESSAGES.PUT_QUIZ[response.status].TITLE,
                        MESSAGES.API_MESSAGES.PUT_QUIZ[response.status].MESSAGE
                    )
                } catch (error) {
                    console.error('Error saving quiz:', error);
                    setSaveMessage({ text: 'Error saving quiz.', type: 'error' });
                }
                
                navigate('/my-quizzes');
        }
        setHighlightedSections([]);
    }

    return (
        <div className='quiz-creator'>
            <div className='input-quiz-meta centered-container'>
                {isEditingQuizTitle ? (
                    <input
                        type="text"
                        value={forgedQuiz.title}
                        onChange={updateForgedQuizTitle}
                        onKeyPress={(e) => e.key === 'Enter' && exitTitleEdit()}
                        onBlur={exitTitleEdit}
                        autoFocus
                        className='quiz-title-input'
                        placeholder='Title'
                    />
                ) : (
                    <h1 onClick={() => setIsEditingQuizTitle(true)} className='quiz-title'>{forgedQuiz.title}</h1>
                )}
                <label>
                    Description:
                    <textarea
                        name="description"
                        placeholder="Provide a description for the quiz"
                        onChange={handleQuizDescriptionChange}
                        value={forgedQuiz.metadata?.description}
                    />
                </label>
            </div>
            <SectionList 
                sections={forgedQuiz.sections} 
                updateSection={updateSection} 
                deleteSection={deleteSection} 
                addSection={addSection} 
                highlightedSections={highlightedSections}
                edit={edit}
            />
            <div className='save-quiz-container'>
                {saveMessage.text && (
                    <p className={`save-message ${saveMessage.type}`}>
                        {saveMessage.text}
                    </p>
                )}
                <BackButton />
                <button 
                    className='save-quiz-button' 
                    onClick={handleSaveQuiz}
                >
                    Save Quiz
                </button>
            </div>
        </div>
    );
}
