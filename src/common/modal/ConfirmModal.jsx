import React from "react";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "./Modal";

export function ConfirmModal({
  title = "Confirm Action",
  message = "Are you sure?",
  onConfirm = () => {},
  onClose = () => {},
  buttonAClass = "cancel-button",
  buttonBClass = "confirm-button",
  buttonAContent = "Cancel",
  buttonBContent = "Confirm",
}) {
  const handleOnClose = () => {
    onClose();
  };

  const handleOnConfirm = () => {
    onConfirm();
  };

  return (
    <Modal>
      <ModalHeader title={title} onClose={handleOnClose} />
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <button onClick={handleOnClose} className={buttonAClass}>
          {buttonAContent}
        </button>
        <button onClick={handleOnConfirm} className={buttonBClass}>
          {buttonBContent}
        </button>
      </ModalFooter>
    </Modal>
  );
}
