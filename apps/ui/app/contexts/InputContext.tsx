"use client";

import { ReactNode, createContext, useContext, useState } from "react";

const InputContext = createContext({});

export const InputContextProvider = ({ children }: { children: ReactNode }) => {
  const [utxos, setUtxos] = useState<string[] | null>(null);

  return (
    <InputContext.Provider value={{ utxos, setUtxos }}>
      {children}
    </InputContext.Provider>
  );
};

export const useInputContext = () => useContext(InputContext);
