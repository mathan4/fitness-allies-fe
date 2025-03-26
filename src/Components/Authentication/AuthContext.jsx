
// Components/Authentication/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Store user data

  useEffect(() => {
    const storedAuth = localStorage.getItem('token'); // Check if token exists
    if (storedAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => { // Accept user data as argument
    setIsAuthenticated(true);
    setUser(userData); // Store user data in context
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove token
    setIsAuthenticated(false);
    setUser(null); // Clear user data
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};