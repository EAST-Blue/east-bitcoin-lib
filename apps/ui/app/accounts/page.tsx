"use client";

import { useEffect, useState } from "react";
import Leftbar from "../components/Leftbar";
import { RegboxAPI, Wallet } from "@east-bitcoin-lib/sdk";
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
import IconSign from "../icons/iconSign";
import IconPlus from "../icons/IconPlus";
import IconImport from "../icons/IconImport";
import { copyToClipboard } from "../utils/copyToClipboard";

const Account = () => {
  const { accounts, fetchAccounts } = useAccountContext() as AccountContextType;
  const { uri, regbox } = useConfigContext() as NetworkConfigType;

  const [isImportAccountModalOpen, setIsImportAccountModalOpen] =
    useState(false);
  const [showOptions, setShowOptions] = useState<AccountType | null>(null);

  const toastInvalidMnemonic = () => {
    toast.error(<p>Mnemonic Invalid</p>, { autoClose: 1500 });
  };
  const toastOnFaucet = () => {
    toast.success(<p>Faucet sent. Wait for automatic confirmation</p>, {
      autoClose: 1500,
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

  const onFaucet = async (addresses: string[]) => {
    const regboxApi = new RegboxAPI({ url: regbox! });
    if (addresses.length < 1) return;

    for (const address of addresses) {
      regboxApi.getFaucet(address, 0.01);
    }

    await regboxApi.generateBlock(1);
    fetchAccounts();
    toastOnFaucet();
    setShowOptions(null);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      <Leftbar active="accounts" />

      <main className="flex-1 p-4 overflow-auto">
        <NetworkSection />

        <div className="mt-2 bg-black-1 px-3 py-2 rounded-lg w-full flex items-center justify-between">
          <h2 className="text-xl font-bold">Accounts</h2>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => saveMnemonic()}
              type="button"
              className="flex px-4 items-center py-2 rounded-lg bg-gradient-to-b hover:from-white-1  from-white-2 to-white-1"
            >
              <div>
                <IconPlus size={20} color="rgba(255,255,255,0.7)" />
              </div>
              <p className="pl-1 whitespace-nowrap font-semibold text-sm">
                Generate Account
              </p>
            </button>
            <button
              onClick={() => setIsImportAccountModalOpen(true)}
              type="button"
              className="flex px-4 items-center py-2 rounded-lg bg-gradient-to-b hover:from-white-1 from-white-2 to-white-1"
            >
              <div>
                <IconImport size={20} color="rgba(255,255,255,0.7)" />
              </div>
              <p className="pl-1 whitespace-nowrap font-semibold text-sm">
                Import Account
              </p>
            </button>
          </div>
        </div>

        {accounts.map((account, i) => (
          <AccountCard
            index={i}
            account={account}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            removeAccount={removeAccount}
            copyToClipboard={copyToClipboard}
            onFaucet={onFaucet}
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
