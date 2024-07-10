"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { OutputContextType, PSBTOutput } from "../types/OutputContextType";

const OutputContext = createContext<OutputContextType | null>(null);

export const OutputContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [outputs, setOutputs] = useState<PSBTOutput[]>([]);

  const saveOutputs = (_outputs: PSBTOutput[]) => {
    const newOutputs = [...outputs, ..._outputs];
    setOutputs(newOutputs);
  };

  const removeOutputByAddress = (address: string) => {
    const newOutputs = outputs.filter((i) => i.address !== address);
    setOutputs(newOutputs);
  };

  const removeOutputByScript = (script: string) => {
    const newOutputs = outputs.filter((i) => i.script !== script)
    setOutputs(newOutputs)
  }

  return (
    <OutputContext.Provider
      value={{ outputs, saveOutputs, removeOutputByAddress, removeOutputByScript }}
    >
      {children}
    </OutputContext.Provider>
  );
};

export const useOutputContext = () => useContext(OutputContext);
