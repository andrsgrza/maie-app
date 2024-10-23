import React, { Component } from 'react';

export class BaseModal extends Component {
    constructor(config = {}) {
        super(config);
        console.log('config in BaseModal constructor ', JSON.stringify(config, null, 2))
        this.state = {
            isOpen: config.isOpen || false
        };
        console.log("Base Modal. Is open: ", this.state.isOpen);
        this.title = config.title || '';
        this.onClose = config.onClose || (() => {});
        console.log('base modal config: ', config);
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    }
}
