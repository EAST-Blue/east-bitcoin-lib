"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AccountType, AccountContextType } from "../types/Account";

const AccountContext = createContext({});

export const AccountContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/account");
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
    fetchAccounts();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        fetchAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => useContext(AccountContext);
