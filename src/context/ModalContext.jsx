import React, { createContext, useState, useContext } from "react";
import { ConfirmModal } from "../common/modal/ConfirmModal";
import { ImportModal } from "../common/modal/ImportModal";
import HandleEntitlementModal from "../common/modal/HandleEntitlementModal";
import SelectModal from "../common/modal/SelectModal";
import { BannerProvider } from "./BannerContext";

const ModalContext = createContext();

export const useModal = () => {
  return useContext(ModalContext);
};

export const ModalProvider = ({ children }) => {
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: "Confirm Action",
  });
  const [importModal, setImportModal] = useState(new ImportModal());
  const [handleEntitlementState, setHandleEntitlementState] = useState({
    isOpen: false,
    resourceId: null,
  });
  const [selectModalState, setSelectModalState] = useState({
    isOpen: false,
    resourceId: null,
  });

  const configureConfirmModal = (config) => {
    setConfirmModalState((prevModal) => ({ ...prevModal, ...config }));
  };

  const toggleConfirmModal = () => {
    setConfirmModalState((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };

  const configureImportModal = (config) => {
    setImportModal((prevModal) => ({ ...prevModal, ...config }));
  };

  const toggleImportModal = () => {
    setImportModal((prevModal) => {
      const newModal = new ImportModal(prevModal);
      newModal.isOpen = !prevModal.isOpen;
      return newModal;
    });
  };

  const toggleHandleEntitlementModal = () => {
    setHandleEntitlementState((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };

  const configureHandleEntitlementModal = (config) => {
    setHandleEntitlementState((prevModal) => ({ ...prevModal, ...config }));
  };

  const toggleSelectModal = () => {
    setSelectModalState((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };

  const configureSelectModal = (config) => {
    console.log("Setting select modal state", config);
    setSelectModalState((prevModal) => ({ ...prevModal, ...config }));
  };

  if (selectModalState.isOpen) {
    console.log("Select modal isOpen:", selectModalState.isOpen);
  }
  return (
    <ModalContext.Provider
      value={{
        configureConfirmModal,
        toggleConfirmModal,
        configureImportModal,
        toggleImportModal,
        toggleHandleEntitlementModal,
        configureHandleEntitlementModal,
        handleEntitlementState,
        selectModalState, // Make sure this is exported
        toggleSelectModal,
        configureSelectModal,
      }}
    >
      {children}
      {importModal.isOpen && <ImportModal {...importModal} />}
      {confirmModalState.isOpen && <ConfirmModal {...confirmModalState} />}
      {handleEntitlementState.isOpen && (
        <HandleEntitlementModal toggleModal={toggleHandleEntitlementModal} />
      )}

      {selectModalState.isOpen && (
        <BannerProvider>
          <SelectModal
            toggleModal={toggleSelectModal}
            {...selectModalState} // This spreads all the configured props including onClose
          />
        </BannerProvider>
      )}
    </ModalContext.Provider>
  );
};
