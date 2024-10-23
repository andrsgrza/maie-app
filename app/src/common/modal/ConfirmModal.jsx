import React from 'react';
import { BaseModal } from './BaseModal';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';

export class ConfirmModal extends BaseModal {
  constructor(config = {}) {
    console.log("config in ConfirmModal constructor ", JSON.stringify(config, null, 2));
    super(config);
    this.message = config.message || '';
    this.onConfirm = config.onConfirm || (() => {});
    this.onClose = config.onClose || (() => {});
    this.buttonAClass =  config.buttonAClass || 'cancel-button';
    this.buttonBClass = config.buttonBClass || 'confrm-button';
    this.buttonAContent = config.buttonAContent || 'Cancel';
    this.buttonBContent = config.buttonBContent || 'Confirm';
  } 

  configure(config) {
    console.log("configuring")
    Object.assign(this, config);
    console.log("this",this)
  }

  render() {
    return (
      <Modal>
        <ModalHeader title={this.title} onClose={this.onClose} />
        <ModalBody>
          {this.message}
        </ModalBody>
        <ModalFooter>
          <button onClick={this.onClose} className={this.buttonAClass}>
            {this.buttonAContent}
          </button>
          <button onClick={this.onConfirm} className={this.buttonBClass}>
            {this.buttonBContent}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}
