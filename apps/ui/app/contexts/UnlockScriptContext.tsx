"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { UnlockScriptContextType } from "../types/UnlockScriptContextType";

const UnlockScriptContext = createContext<UnlockScriptContextType | null>(null);

export const UnlockScriptProvider = ({ children }: { children: ReactNode }) => {
  const [unlockScript, setUnlockScript] = useState<string | null>(null);

  const saveUnlockScript = (script: string | null | undefined) => {
    if (typeof script === "string") {
      setUnlockScript(script);
    }
  };

  return (
    <UnlockScriptContext.Provider value={{ unlockScript, saveUnlockScript }}>
      {children}
    </UnlockScriptContext.Provider>
  );
};

export const useUnlockScriptContext = () => useContext(UnlockScriptContext);
