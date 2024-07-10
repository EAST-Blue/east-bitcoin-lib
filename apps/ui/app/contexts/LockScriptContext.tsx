"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { LockScriptContextType } from "../types/LockScriptContextType";

const LockScriptContext = createContext<LockScriptContextType | null>(null);

export const LockScriptProvider = ({ children }: { children: ReactNode }) => {
  const [lockScript, setLockScript] = useState<string | null>(null);

  const saveLockScript = (script: string) => {
    setLockScript(script);
  };

  return (
    <LockScriptContext.Provider value={{ lockScript, saveLockScript }}>
      {children}
    </LockScriptContext.Provider>
  );
};

export const useLockScriptContext = () => useContext(LockScriptContext);
