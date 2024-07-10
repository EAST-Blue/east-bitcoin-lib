"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { KeyOptionEnum } from "../enums/KeyOptionEnum";

const KeyContext = createContext({});

export const KeyContextProvider = ({ children }: { children: ReactNode }) => {
  const [key, setKey] = useState<string | null>(null);
  const [keyOption, setKeyOption] = useState<KeyOptionEnum | null>(null);

  const clear = () => {
    setKey(null);
    setKeyOption(null);
  };

  return (
    <KeyContext.Provider
      value={{ key, keyOption, setKey, setKeyOption, clear }}
    >
      {children}
    </KeyContext.Provider>
  );
};

export const useKeyContext = () => useContext(KeyContext);
