"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { NetworkEnum } from "../enums/NetworkEnum";

const NetworkContext = createContext({});

export const NetworkContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [network, setNetwork] = useState<string | null>(null);
  const [networkOption, setNetworkOption] = useState<NetworkEnum | null>(null);

  const clear = () => {
    setNetwork(null);
    setNetworkOption(null);
  };

  return (
    <NetworkContext.Provider
      value={{ network, networkOption, setNetwork, setNetworkOption, clear }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetworkContext = () => useContext(NetworkContext);
