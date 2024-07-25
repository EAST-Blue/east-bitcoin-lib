"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const ConfigContext = createContext({});

export const ConfigContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const configApiUrl = useRef("");
  const [config, setConfig] = useState({
    network: "regtest",
    uri: "https://blockstream-electrs-api.regnet.btc.eastlayer.io",
    explorer: "https://explorer.regnet.btc.eastlayer.io",
    regbox: "https://regbox.regnet.btc.eastlayer.io",
  });

  const fetchConfig = async () => {
    try {
      const response = await fetch(configApiUrl.current);
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

    const isTauri = (window as any).__TAURI__;
    configApiUrl.current = isTauri
      ? "http://localhost:9090/config"
      : "/api/config";

    if (isTauri) {
      import("@tauri-apps/api/shell").then((mod) => {
        const command = mod.Command.sidecar("bin/server");
        command.execute();
      });
    }
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        network: config.network,
        uri: config.uri,
        explorer: config.explorer,
        regbox: config.regbox,
        configApiUrl: configApiUrl.current,
        fetchConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => useContext(ConfigContext);
