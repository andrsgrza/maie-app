import React from "react";
import { BaseModal } from "./BaseModal";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "./Modal";
import JSONViewer from "react-json-viewer";
import QuizClient from "../../api/quiz-client";
import { useBanner } from "../../context/BannerContext";
import { MESSAGES } from "../constants";

export class ImportModal extends BaseModal {
  constructor(config = {}) {
    super(config);
    this.state = {
      jsonData: {},
      isValidJson: true,
      jsonText: "", // To store the raw JSON text
      isFileImported: false, // Track if a file has been imported
      isJsonImported: false, // Track if the user has imported the JSON
      validationErrors: [],
    };
    this.postImport = config.postImport;
  }

  // Method to handle text input validation
  handleJsonChange = (event) => {
    const text = event.target.value;
    this.setState({ jsonText: text });

    this.validateJson(text);
  };

  // Method to handle file input for importing JSON
  handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        this.setState({ jsonText: fileContent });
        this.validateJson(fileContent);
      };
      reader.readAsText(file);
    }
  };

  // Method to validate JSON input (both from textarea and file import)
  validateJson = (text) => {
    try {
      const parsedDocument = JSON.parse(text);

      let validationErrors = [];

      if (!parsedDocument.title) {
        validationErrors.push("The document is missing the 'title' field.");
      }

      if (!parsedDocument.metadata) {
        validationErrors.push("The document is missing the 'metadata' field.");
      } else {
        if (!parsedDocument.metadata.description) {
          validationErrors.push(
            "The 'metadata' object is missing the 'description' field."
          );
        }
        if (!parsedDocument.metadata.creationDate) {
          validationErrors.push(
            "The 'metadata' object is missing the 'creationDate' field."
          );
        }
      }

      if (!parsedDocument.sections) {
        validationErrors.push("The document is missing the 'sections' field.");
      } else if (!Array.isArray(parsedDocument.sections)) {
        validationErrors.push("The 'sections' field should be an array.");
      } else {
        parsedDocument.sections.forEach((section, index) => {
          if (!section.title) {
            validationErrors.push(
              `Section ${index + 1} is missing the 'title' field.`
            );
          }
          if (!section.items) {
            validationErrors.push(
              `Section ${index + 1} is missing the 'items' field.`
            );
          } else if (!Array.isArray(section.items)) {
            validationErrors.push(
              `Section ${
                index + 1
              } should have an 'items' field that is an array.`
            );
          } else {
            section.items.forEach((item, itemIndex) => {
              if (!item.question) {
                validationErrors.push(
                  `Item ${itemIndex + 1} in Section ${
                    index + 1
                  } is missing the 'question' field.`
                );
              }
              if (!item.answer) {
                validationErrors.push(
                  `Item ${itemIndex + 1} in Section ${
                    index + 1
                  } is missing the 'answer' field.`
                );
              }
            });
          }
        });
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("\n"));
      }

      this.setState({
        jsonData: parsedDocument,
        isValidJson: true,
        validationErrors: [],
        isFileImported: false, // Still allow editing unless user explicitly imports
      });
    } catch (error) {
      this.setState({
        isValidJson: false,
        validationErrors: error.message.split("\n"),
        isFileImported: false,
      });
    }
  };

  // Handle Tab key press
  handleKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const updatedText =
        this.state.jsonText.substring(0, start) +
        "\t" +
        this.state.jsonText.substring(end);

      this.setState({ jsonText: updatedText }, () => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      });
    }
  };

  // Method to import the JSON data
  importQuiz = async () => {
    if (this.state.isValidJson && this.state.jsonText.trim()) {
      try {
        const parsedQuiz = this.state.jsonData;

        // Send the parsed quiz data to the server
        const response = await QuizClient.postQuiz(parsedQuiz);
        this.postImport(response);
        // Add banner based on response

        // Check if response is successful
        if (response.status >= 200 && response.status < 300) {
          this.setState({ isJsonImported: true }); // Disable textarea after successful import
          // Optionally, you can also close the modal here
          // this.onClose();
        }
      } catch (error) {
        alert("Error while importing the quiz.");
      }
    } else {
      alert("Please provide valid JSON content.");
    }
  };

  render() {
    return (
      <div className="import-modal">
        <Modal>
          <ModalHeader title={this.title} onClose={this.onClose} />
          <ModalBody>
            {/* Button to browse JSON file */}
            <input
              type="file"
              accept="application/json"
              onChange={this.handleFileImport}
              style={{ marginBottom: "10px" }}
            />

            {/* Textarea for manual JSON input */}
            <textarea
              rows="10"
              style={{
                fontFamily: "monospace",
                border: this.state.isValidJson
                  ? "1px solid #ddd"
                  : "1px solid red",
              }}
              placeholder="Paste your document here"
              onChange={this.handleJsonChange}
              onKeyDown={this.handleKeyDown}
              value={this.state.jsonText}
              disabled={this.state.isJsonImported} // Only disable after the user imports
            ></textarea>

            {/* Render validation errors if JSON is invalid */}
            {!this.state.isValidJson && (
              <div style={{ color: "red", marginTop: "10px" }}>
                <h4>Errors:</h4>
                <ul>
                  {this.state.validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview of the parsed JSON */}
            {/* <h3>Preview</h3>
                        <JSONViewer json={this.state.jsonData} /> */}
          </ModalBody>
          <ModalFooter>
            <button
              onClick={this.importQuiz} // Updated to call importQuiz
              className="submit-button"
              disabled={!this.state.isValidJson}
            >
              Import Document
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
