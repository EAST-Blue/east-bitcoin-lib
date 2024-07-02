"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ConfigContext = createContext({});

export const ConfigContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [config, setConfig] = useState({
    network: "regtest",
    uri: null,
    explorer: null,
  });

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/config");
      if (!response.ok) {
        throw new Error("Failed to fetch account count");
      }
      const config = await response.json();

      if (config) {
        setConfig(config);
      }
    } catch (error) {
      console.error("Error fetching account count:", error);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        network: config.network,
        uri: config.uri,
        explorer: config.explorer,
        fetchConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => useContext(ConfigContext);
