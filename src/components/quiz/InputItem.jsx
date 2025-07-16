import React, { useState, useRef, useEffect } from "react";

export default function InputItem({
  item,
  addItem,
  onCancel,
  keepOpen,
  setKeepOpen,
  edit,
  updateItem,
  index,
  hasSubmitted,
}) {
  const [question, setQuestion] = useState(item?.question || "");
  const [answer, setAnswer] = useState(item?.answer || "");
  const questionInputRef = useRef(null);
  const answerInputRef = useRef(null);

  useEffect(() => {
    if (questionInputRef.current) {
      questionInputRef.current.focus();
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "question") {
      setQuestion(value);
    } else if (name === "answer") {
      setAnswer(value);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (questionInputRef.current.value === "") {
        question.current.focus();
      }
      if (answerInputRef.current.value === "") {
        answerInputRef.current.focus();
      } else {
        handleOnClick();
      }
    }
  };

  const handleOnClick = () => {
    if (question && answer) {
      if (edit) {
        const id = item.id;
        updateItem({ question, answer }, index);
      } else {
        item = { question, answer, editMode: false };
        addItem(item);

        setQuestion("");
        setAnswer("");
        if (keepOpen) {
          questionInputRef.current.focus();
        }
      }
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    handleOnClick();
  };

  const handleOnCancel = () => {
    onCancel(index);
  };

  return (
    <div className="input-item">
      <h2>Enter the question and answer:</h2>
      <form onSubmit={handleOnSubmit}>
        <label>
          Question:
          <textarea
            name="question"
            placeholder="Enter your question"
            value={question}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={questionInputRef}
          />
        </label>
        <label>
          Answer:
          <textarea
            name="answer"
            placeholder="Enter your answer"
            value={answer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={answerInputRef}
          />
        </label>
        {/* {!edit && (
          <label className="keep-open-label">
            <input
              type="checkbox"
              checked={keepOpen}
              onChange={() => setKeepOpen(!keepOpen)}
            />
            Auto-create next
          </label>
        )} */}
        <button type="submit">Submit</button>
        <button type="button" onClick={handleOnCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
