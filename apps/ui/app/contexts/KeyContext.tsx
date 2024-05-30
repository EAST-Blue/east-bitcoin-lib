"use client";

import { ReactNode, createContext, useContext, useState } from "react";

const KeyContext = createContext({});

export const KeyContextProvider = ({ children }: { children: ReactNode }) => {
  const [key, setKey] = useState<string | null>(null);

  const clear = () => {
    setKey(null);
  };

  return (
    <KeyContext.Provider value={{ key, setKey, clear }}>
      {children}
    </KeyContext.Provider>
  );
};

export const useKeyContext = () => useContext(KeyContext);
