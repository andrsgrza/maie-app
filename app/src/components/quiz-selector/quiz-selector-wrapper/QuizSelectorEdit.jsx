import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuizSelector from '../QuizSelector';
import './quiz-selector-edit.css';
import { getQuizzes, postQuiz } from '../../../quiz-client';

export default function QuizSelectorEdit() {
    const [quizzes, setQuizzes] = useState([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [isFileLoaded, setIsFileLoaded] = useState(false); 

    const fetchQuizzes = async () => {
        try {
            const response = await getQuizzes();
            console.log("Quizzes fetched:", response);
            setQuizzes(response);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    },[])

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const openModal = () => {
        setIsDropdownOpen(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsFileLoaded(false);
        setJsonInput('');
    };


    const handleFileInput = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e) => {
                setJsonInput(e.target.result);
                setIsFileLoaded(true);
            };
            reader.readAsText(file);
        } else {
            alert("Please select a valid JSON file.");
            event.target.value = ""; // Clear the file input
        }
    };

    const handleTextareaChange = (event) => {
        if (!isFileLoaded) {
            setJsonInput(event.target.value);
        }
    };

    const handleKeyDown = (event) => {
        const textarea = event.target;
        const start = textarea.selectionStart; // Get the start position of the selection
        const end = textarea.selectionEnd; // Get the end position of the selection
    
        // Shift+Enter for new lines
        if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            setJsonInput(prev => prev.substring(0, start) + "\n" + prev.substring(end));
            // Move the cursor to the correct position after the newline
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
        // Tab for inserting tabs
        else if (event.key === "Tab") {
            event.preventDefault();
            setJsonInput(prev => prev.substring(0, start) + "\t" + prev.substring(end));
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
        // Enter to submit quiz import
        else if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            importQuiz();
        }
    };
    

    const importQuiz = async () => {
        if (jsonInput.trim()) {
            try {
                const parsedQuiz = JSON.parse(jsonInput);
                // Handle the imported quiz data
                const insertedQuiz = await postQuiz(parsedQuiz);
                console.log("Quiz Imported: ", parsedQuiz);
                console.log("Quiz inserted: ", insertedQuiz);
                setQuizzes(prevQuizzes => [...prevQuizzes, insertedQuiz]);
                console.log("Quiz Imported: ", parsedQuiz);
                closeModal(); // Close modal after successful import
            } catch (error) {
                alert("Invalid JSON format.");
            }
        } else {
            alert("Please provide JSON content.");
        }
    };

    return (
        <div className='quiz-selector-wrapper centered-container'>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h3>Import Quiz via JSON</h3>
                        <input
                            type="file"
                            id="jsonFileInput"
                            accept=".json"
                            onChange={handleFileInput}
                        />
                        <textarea
                            id="jsonInput"
                            value={jsonInput}
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Paste your JSON here..."
                            rows="6"
                            disabled={isFileLoaded} // Disable when file is loaded
                        ></textarea>
                        <button onClick={importQuiz} className="submit-button">
                            Import Quiz
                        </button>
                    </div>
                </div>
            )}
            <QuizSelector quizzes={quizzes} setQuizzes={setQuizzes} editable={true} />
            <div className="add-quiz-wrapper">
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <Link to="/create-quiz" className="dropdown-item button-link">
                            Create New Quiz
                        </Link>
                        <button className="dropdown-item" onClick={openModal}>
                            Import JSON
                        </button>
                    </div>
                )}
            </div>
            <button className="add-quiz-button" onClick={toggleDropdown}>
                <i className="fas fa-plus"></i> 
            </button>
        </div>
    );
}
