import React from 'react';

export function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
    return (
        <div className={`confirm-modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm}>Confirm</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}