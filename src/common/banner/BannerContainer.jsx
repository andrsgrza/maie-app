import React from 'react';
import '../common.css'; // Assuming you have CSS styles for the container and banners
import { useBanner } from '../../context/BannerContext';

const BannerContainer = ({ banners }) => {
    return (
        <div className="banner-container">
            {banners.map((banner) => (
                <Banner
                    key={banner.id}
                    id={banner.id}
                    type={banner.type}
                    title={banner.title}
                    message={banner.message}
                />
            ))}
        </div>
    );
};

// Banner component to represent each banner
const Banner = ({ id, type, title, message }) => {
    const { removeBanner } = useBanner();

    // Define banner colors based on the type
    const bannerClasses = {
        error: 'banner-error',
        success: 'banner-success',
        warning: 'banner-warning',
        message: 'banner-message',
    };

    return (
        <div className={`banner ${bannerClasses[type]}`}>
            <div className="banner-content">
                {title && <strong>{title}</strong>}
                <p>{message}</p>
            </div>
            <button className="close-button" onClick={() => removeBanner(id)}>
                &times;
            </button>
        </div>
    );
};

export default BannerContainer;
