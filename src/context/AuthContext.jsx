import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const authenticate = () => setIsAuthenticated(true);
    const unauthenticate = () => setIsAuthenticated(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, authenticate, unauthenticate }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
