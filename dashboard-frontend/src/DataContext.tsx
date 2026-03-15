import React, { createContext, ReactNode, useContext, useState } from 'react';

interface Data {
  // Define the structure of data you are storing
  // Example:
  // id: number;
  // name: string;
  [key: string]: any; // this is a more flexible approach but try to define a more strict type if possible
}

interface DataContextType {
  data: Data | null;
  setData: React.Dispatch<React.SetStateAction<Data | null>>;
}

interface DataProviderProps {
  children: ReactNode;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<Data | null>(null);

  const value = { data, setData };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
