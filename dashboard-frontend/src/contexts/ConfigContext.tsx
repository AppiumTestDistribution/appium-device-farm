import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Config context interface
interface ConfigContextType {
  loading: boolean;
}

// Create context with default values
const ConfigContext = createContext<ConfigContextType>({
  loading: true,
});

// Config provider props
interface ConfigProviderProps {
  children: ReactNode;
}

// Config provider component
export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = 'Appium Device Farm';
    setLoading(false);
  }, []);

  const value = {
    loading,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

// Custom hook to use config context
export const useConfig = () => useContext(ConfigContext);
