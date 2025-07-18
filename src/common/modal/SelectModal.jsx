import React, { useState } from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "./Modal";
import "./HandleEntitlementModal.css";

export default function SelectModal({
  toggleModal,
  title = "Select Items",
  selector,
  onClose,
  onAdd,
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    } else {
      toggleModal();
    }
  };

  console.log("Rendering SelectModal");
  return (
    <Modal>
      <ModalHeader title={title} onClose={handleOnClose} />
      <ModalBody>
        {selector && typeof selector === "function" ? (
          selector(setSelectedItems)
        ) : (
          <div>No selector provided</div>
        )}
      </ModalBody>
      <ModalFooter>
        <button
          className="add-button"
          onClick={() => {
            onAdd(selectedItems);
          }}
        >
          Add
        </button>
      </ModalFooter>
    </Modal>
  );
}
