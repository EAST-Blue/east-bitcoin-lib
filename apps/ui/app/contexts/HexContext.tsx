"use client";

import { BitcoinUTXO } from "@east-bitcoin-lib/sdk/dist/repositories/bitcoin/types";
import { ReactNode, createContext, useContext, useState } from "react";
import { InputContextType } from "../types/InputContextType";

const InputContext = createContext<InputContextType | null>(null);

export const InputContextProvider = ({ children }: { children: ReactNode }) => {
  const [utxos, setUtxos] = useState<BitcoinUTXO[]>([]);

  const saveUtxos = (_utxos: BitcoinUTXO[]) => {
    const newUtxos = [...utxos, ..._utxos];
    setUtxos(newUtxos);
  };

  const removeUtxoByTxid = (txid: string) => {
    const newUtxos = utxos.filter((i) => i.txid !== txid);
    setUtxos(newUtxos);
  };

  return (
    <InputContext.Provider value={{ utxos, saveUtxos, removeUtxoByTxid }}>
      {children}
    </InputContext.Provider>
  );
};

export const useInputContext = () => useContext(InputContext);
