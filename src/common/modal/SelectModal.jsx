import React, { useState, useEffect, useRef } from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "./Modal";
import "./HandleEntitlementModal.css";

export default function SelectModal({
  toggleModal,
  title = "Select Items",
  selector,
  onClose,
  onAdd,
}) {
  const [isLoading, setIsLoading] = useState(true);

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    } else {
      toggleModal();
    }
  };

  return (
    <Modal>
      <ModalHeader title={title} onClose={handleOnClose} />
      <ModalBody>
        {selector && typeof selector === "function" ? (
          selector()
        ) : (
          <ResourceList
            resourceType="quiz"
            editable={false}
            selectable={true}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <button className="add-button" onClick={onAdd}>
          Add
        </button>
      </ModalFooter>
    </Modal>
  );
}
