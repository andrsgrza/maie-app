import React, { useState, useRef, useEffect } from 'react';

export default function InputItem({ addItem, onCancel, keepOpen, setKeepOpen }) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const questionInputRef = useRef(null);

    useEffect(() => {
        if (questionInputRef.current) {
            questionInputRef.current.focus();
        }
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'question') {
            setQuestion(value);
        } else if (name === 'answer') {
            setAnswer(value);
        }
    };

    const handleOnClick = () => {
        if (question && answer) {
            addItem({ question, answer });
            setQuestion('');
            setAnswer('');
            if (keepOpen && questionInputRef.current) {
                questionInputRef.current.focus();
            }
        }
    };

    const handleOnSubmit = (event) => {
        event.preventDefault();
        handleOnClick();
    };

    return (
        <div className='input-item'>
            <h2>Enter the question and answer:</h2>
            <form onSubmit={handleOnSubmit}>
                <label>
                    Question:
                    <input
                        type="text"
                        name="question"
                        placeholder="Enter your question"
                        value={question}
                        onChange={handleInputChange}
                        ref={questionInputRef}
                    />
                </label>
                <label>
                    Answer:
                    <input
                        type="text"
                        name="answer"
                        placeholder="Enter your answer"
                        value={answer}
                        onChange={handleInputChange}
                    />
                </label>
                <label className='keep-open-label'>
                    <input
                        type="checkbox"
                        checked={keepOpen}
                        onChange={() => setKeepOpen(!keepOpen)}
                    />
                    Keep form open after submission
                </label>
                <button type="submit">Submit Item</button>
                <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
            </form>
        </div>
    );
}
