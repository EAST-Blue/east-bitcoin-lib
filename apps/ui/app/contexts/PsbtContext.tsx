"use client";

import { ReactNode, createContext, useContext, useState } from "react";

const PsbtContext = createContext({});

export const PsbtContextProvider = ({ children }: { children: ReactNode }) => {
  const [utxos, setUtxos] = useState<string[]>([]);
  const [output, setOutput] = useState<string[]>([]);

  const clear = () => {
    setUtxos([]);
    setOutput([]);
  };

  return (
    <PsbtContext.Provider value={{ utxos, output, clear }}>
      {children}
    </PsbtContext.Provider>
  );
};

export const usePsbtContext = () => useContext(PsbtContext);
