import React, { createContext, useState, useContext } from 'react';
import { ConfirmModal } from '../common/modal/ConfirmModal'
import { ImportModal } from '../common/modal/ImportModal'

// Create the context
const ModalContext = createContext();

// Create a custom hook to use the ModalContext
export const useModal = () => {
    return useContext(ModalContext);
};


export const ModalProvider = ({ children }) => {

    const [confirmModal, setConfirmModal] = useState(new ConfirmModal());
    const [importModal, setImportModal] = useState(new ImportModal());

    const configureConfirmModal = (config) => {
        setConfirmModal(prevModal => ({ ...prevModal, ...config }));
    };

    const toggleConfirmModal = () => {
        setConfirmModal(prevModal => {
            const newModal = new ConfirmModal(prevModal);
            newModal.isOpen = !prevModal.isOpen;
            return newModal;
        });
    }
    const configureImportModal = (config) => {
        setImportModal(prevModal => ({ ...prevModal, ...config }));
    };

    const toggleImportModal = () => {
        setImportModal(prevModal => {
            const newModal = new ImportModal(prevModal);
            newModal.isOpen = !prevModal.isOpen;
            return newModal;
        });
    }

    return (
        <ModalContext.Provider value={{
                configureConfirmModal,
                toggleConfirmModal,
                configureImportModal,
                toggleImportModal,
            }}>
            {children}
            {confirmModal.isOpen && <ConfirmModal {...confirmModal} />}
            {importModal.isOpen && <ImportModal {...importModal} />}
        </ModalContext.Provider>
    );
    

};