import React, { useState } from 'react';
import './common.css'; // Assuming you have a styles folder or CSS module system

const ErrorBanner = ({ message }) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null; // Don't render if the banner is dismissed

    return (
        <div className="error-banner">
            <div className="error-message">{message}</div>
            <button className="close-button" onClick={() => setVisible(false)}>
                &times;
            </button>
        </div>
    );
};

export default ErrorBanner;
