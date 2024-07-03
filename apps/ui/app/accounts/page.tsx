"use client";

import { useEffect, useState } from "react";
import Leftbar from "../components/Leftbar";
import { Wallet } from "@east-bitcoin-lib/sdk";
import ImportAccountModal from "../components/ImportAccount";
import * as bip39 from "bip39";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccountContext } from "../contexts/AccountContext";
import { AccountContextType } from "../types/Account";
import NetworkSection from "../components/Network";

type AccountType = {
  mnemonic: string;
  p2wpkh: string;
  p2tr: string;
};

const Account = () => {
  const { accounts, fetchAccounts } = useAccountContext() as AccountContextType;

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
    <div className="min-h-screen bg-gray-900 text-white flex overflow-hidden">
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
          <div key={i} className="space-y-4 my-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-lg font-bold mb-2">Account {i + 1}</h2>
                <div className="relative">
                  <button
                    onClick={() =>
                      showOptions
                        ? setShowOptions(null)
                        : setShowOptions(account)
                    }
                    className="py-1 px-2 bg-gray-700 rounded focus:outline-none"
                  >
                    <i className="fa-solid fa-ellipsis"></i>
                  </button>
                  {account.mnemonic === showOptions?.mnemonic && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-500 rounded shadow-lg">
                      <button className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-500">
                        Export Private Key
                      </button>
                      <button
                        onClick={() => removeAccount(account.mnemonic)}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-500"
                      >
                        Remove Account
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <br />

              <div className="grid grid-cols-5 my-2">
                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <span>{account.p2wpkh}</span>
                    <button
                      onClick={() => copyToClipboard(account.p2wpkh)}
                      className="text-gray-500"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <span className="font-bold">P2WPKH</span>
                </div>
                <div className="flex flex-row gap-x-4">
                  <span>
                    10 BTC{" "}
                    <span className="italic text-sm">(10,000,000 sats)</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-5 my-2">
                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <span>{account.p2tr}</span>
                    <button
                      onClick={() => copyToClipboard(account.p2tr)}
                      className="text-gray-500"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <span className="font-bold">P2TR</span>
                </div>
                <div className="flex flex-row gap-x-4">
                  <span>
                    10 BTC{" "}
                    <span className="italic text-sm">(10,000,000 sats)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
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
