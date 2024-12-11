import React, { createContext, useState, useContext } from 'react';
import { ConfirmModal } from '../common/modal/ConfirmModal'
import { ImportModal } from '../common/modal/ImportModal'
import HandleEntitlementModal from '../common/modal/HandleEntitlementModal'

// Create the context
const ModalContext = createContext();

// Create a custom hook to use the ModalContext
export const useModal = () => {
    return useContext(ModalContext);
};


export const ModalProvider = ({ children }) => {

    const [confirmModal, setConfirmModal] = useState(new ConfirmModal());
    const [importModal, setImportModal] = useState(new ImportModal());
    const [handleEntitlementState, setHandleEntitlementState] = useState({ isOpen: false });

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
    const toggleHandleEntitlementModal = () => {
        setHandleEntitlementState(prevState => ({
            ...prevState,
            isOpen: !prevState.isOpen
        }));
    };

    return (
        <ModalContext.Provider value={{
                configureConfirmModal,
                toggleConfirmModal,
                configureImportModal,
                toggleImportModal,
                toggleHandleEntitlementModal,
            }}>
            {children}
            {confirmModal.isOpen && <ConfirmModal {...confirmModal} />}
            {importModal.isOpen && <ImportModal {...importModal} />}
            {handleEntitlementState.isOpen && <HandleEntitlementModal toggleModal={toggleHandleEntitlementModal} />}
        </ModalContext.Provider>
    );
    

};