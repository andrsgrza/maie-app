import React, { Component } from "react";

export class BaseModal extends Component {
  constructor(config = {}) {
    super(config);
    this.state = {
      isOpen: config.isOpen || false,
    };

    this.title = config.title || "";
    this.onClose = config.onClose || (() => {});

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  }
}
