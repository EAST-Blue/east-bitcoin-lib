"use client";

import { useEffect, useState } from "react";
import Leftbar from "../components/Leftbar";
import { Wallet } from "@east-bitcoin-lib/sdk";
import ImportAccountModal from "../components/ImportAccount";
import * as bip39 from "bip39";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccountContext } from "../contexts/AccountContext";
import { AccountContextType, AccountType } from "../types/Account";
import NetworkSection from "../components/Network";
import { useConfigContext } from "../contexts/ConfigContext";
import { NetworkConfigType } from "../types/ConfigType";
import AccountCard from "../components/AccountCard";

const Account = () => {
  const { accounts, fetchAccounts } = useAccountContext() as AccountContextType;
  const { uri } = useConfigContext() as NetworkConfigType;

  const [isImportAccountModalOpen, setIsImportAccountModalOpen] =
    useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<AccountType | null>(null);

  const toastInvalidMnemonic = () => {
    toast.error(<p>Mnemonic Invalid</p>, { autoClose: 1500 });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Could not copy text: ", err);
    });
  };

  const onImportAccount = async (mnemonic: string) => {
    const isExist = accounts.find((account) => account.mnemonic === mnemonic);
    if (isExist) return;

    const isValidMnemonic = bip39.validateMnemonic(mnemonic);
    if (!isValidMnemonic) {
      toastInvalidMnemonic();
      return;
    }

    await saveMnemonic(mnemonic);
    fetchAccounts();
  };

  const saveMnemonic = async (importMnemonic?: string | undefined) => {
    let mnemonic;
    if (importMnemonic) {
      mnemonic = importMnemonic;
    } else {
      mnemonic = Wallet.generateMnemonic();
    }
    const wallet = new Wallet({ mnemonic, network: "regtest" });

    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mnemonic,
        p2wpkh: wallet.p2wpkh(0).address,
        p2tr: wallet.p2tr(0).address,
      }),
    });

    fetchAccounts();
  };

  const removeAccount = async (mnemonic: string) => {
    await fetch("/api/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mnemonic,
      }),
    });

    fetchAccounts();
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      <Leftbar active="accounts" />

      <main className="flex-1 p-4 overflow-auto">
        <NetworkSection title="Accounts" />

        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => saveMnemonic()}
            className="py-2 px-4 bg-teal-500 rounded"
          >
            Generate Account
          </button>
          <button
            onClick={() => setIsImportAccountModalOpen(true)}
            className="py-2 px-4 bg-teal-500 rounded"
          >
            Import Account
          </button>
        </div>

        {accounts.map((account, i) => (
          <AccountCard
            index={i}
            account={account}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            removeAccount={removeAccount}
            copyToClipboard={copyToClipboard}
          />
        ))}
      </main>

      <ToastContainer hideProgressBar={true} theme="light" />

      <ImportAccountModal
        isOpen={isImportAccountModalOpen}
        onClose={() => setIsImportAccountModalOpen(false)}
        onSave={onImportAccount}
      />
    </div>
  );
};
export default Account;
