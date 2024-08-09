"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AccountType } from "../types/Account";

const AccountContext = createContext({});

export const AccountContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const accountApiUrl = useRef("");
  const [accounts, setAccounts] = useState<AccountType[]>([]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(accountApiUrl.current);
      if (!response.ok) {
        throw new Error("Failed to fetch account count");
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching account count:", error);
      // alert(error);
    }
  };

  useEffect(() => {
    const isTauri = (window as any).__TAURI__;
    accountApiUrl.current = isTauri
      ? "http://localhost:9090/account"
      : "/api/account";

    if (isTauri) {
      import("@tauri-apps/api/shell").then((mod) => {
        const command = mod.Command.sidecar("bin/server");
        command.execute();
      });
    }

    fetchAccounts();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        accountApiUrl: accountApiUrl.current,
        accounts,
        fetchAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => useContext(AccountContext);
