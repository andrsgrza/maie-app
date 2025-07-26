import React from 'react';
import '../common.css';

const Modal = ({ open, children, onClose }) => {
  if (!open) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
};

export const ModalHeader = ({ title, onClose }) => (
  <div className="modal-header">
    <h3>{title}</h3>
    {onClose && (
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
    )}
  </div>
);

export const ModalBody = ({ children }) => <div className="modal-body">{children}</div>;

export const ModalFooter = ({ children }) => <div className="modal-footer">{children}</div>;

export default Modal;
