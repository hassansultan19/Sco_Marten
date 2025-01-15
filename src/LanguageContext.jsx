// src/LanguageContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create a context for language
const LanguageContext = createContext();

// Provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the Language context
export const useLanguage = () => {
  return useContext(LanguageContext);
};
