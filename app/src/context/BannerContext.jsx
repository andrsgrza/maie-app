import React, { createContext, useState, useContext } from "react";
import BannerContainer from "../common/banner/BannerContainer";
// Create the context
const BannerContext = createContext();

// Create a custom hook to use the BannerContext
export const useBanner = () => {
  return useContext(BannerContext);
};

// BannerProvider component to wrap the app and provide banner management
export const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [counter, setCounter] = useState(0);

  // Function to add a new banner
  // Function to add a new banner
  const addBanner = (type, title, message, duration = 3000) => {
    setCounter((prevCounter) => {
      const id = prevCounter + 1; // Increment counter for each banner
      setBanners((prevBanners) => [
        ...prevBanners,
        { id, type, title, message },
      ]);

      // Set a timeout to remove the banner after the specified duration
      setTimeout(() => {
        removeBanner(id);
      }, duration);

      return id; // Update the counter state
    });
  };

  // Function to remove a banner by ID
  const removeBanner = (id) => {
    setBanners((prevBanners) =>
      prevBanners.filter((banner) => banner.id !== id)
    );
  };

  return (
    <BannerContext.Provider value={{ addBanner, removeBanner }}>
      {children}
      <BannerContainer banners={banners} />
    </BannerContext.Provider>
  );
};
