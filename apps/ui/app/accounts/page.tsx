"use client";

import { useEffect, useState } from "react";
import Leftbar from "../components/Leftbar";
import { Network, RegboxAPI, Wallet } from "@east-bitcoin-lib/sdk";
import ImportAccountModal from "../components/ImportAccount";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccountContext } from "../contexts/AccountContext";
import { AccountContextType, AccountType } from "../types/Account";
import NetworkSection from "../components/Network";
import { useConfigContext } from "../contexts/ConfigContext";
import { NetworkConfigType } from "../types/ConfigType";
import AccountCard from "../components/AccountCard";
import IconPlus from "../icons/IconPlus";
import IconImport from "../icons/IconImport";
import { copyToClipboard } from "../utils/copyToClipboard";
import ImportPrivateKeyModal from "../components/ImportPrivateKeyModal";
import { SecretEnum } from "../enums/SecretEnum";
import ImportWifTextModal from "../components/ImportWifTextModal";
import { generateWalletBySecretType } from "../utils/generateWalletBySecretType";

const Account = () => {
  const { accounts, fetchAccounts } = useAccountContext() as AccountContextType;
  const { regbox, network } = useConfigContext() as NetworkConfigType;

  const [isShowImportOption, setIsShowImportOptions] = useState(false);
  const [showOptions, setShowOptions] = useState<AccountType | null>(null);
  const [showImportOptions, setShowImportOptions] = useState<SecretEnum | null>(
    null
  );

  const toastOnFaucet = () => {
    toast.success(<p>Sending coin. Wait for automatic confirmation</p>, {
      autoClose: 1500,
    });
  };

  const toastOnAccountExist = (accountNumber: number) => {
    toast.error(
      <p>Secret and path already exist on Account {accountNumber}</p>,
      {
        autoClose: 1500,
      }
    );
  };

  const onImportAccount = async (index: number, secret: string) => {
    const isExist = accounts.findIndex(
      (account) => account.secret === secret && account.path === index
    );
    if (isExist !== -1) {
      toastOnAccountExist(isExist + 1);
      return;
    }

    // TODO : check if secret exist on another form e.g. if input is WIF, check is equivalent in HEX is exist in db

    await saveSecret(index, secret);
    fetchAccounts();
  };

  const saveSecret = async (index: number, secret?: string | undefined) => {
    if (!secret) {
      secret = Wallet.generateMnemonic();
    }

    let wallet = generateWalletBySecretType(secret, network);
    if (!wallet) {
      console.error("Error secret");
      return;
    }

    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        p2wpkh: wallet.p2wpkh(index).address,
        p2tr: wallet.p2tr(index).address,
        path: index,
      }),
    });

    fetchAccounts();
  };

  const removeAccount = async (secret: string) => {
    await fetch("/api/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
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
              onClick={() => saveSecret(0)}
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
              onClick={() => setIsShowImportOptions(!isShowImportOption)}
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

            {isShowImportOption && (
              <div className="absolute z-10 right-7 top-[120px]  mt-2 w-48 bg-[#262626] border border-gray-500 rounded shadow-lg">
                <button
                  onClick={() => {
                    setShowImportOptions(SecretEnum.MNEMONIC);
                    setIsShowImportOptions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-500"
                >
                  Mnemonic Phrase
                </button>

                <button
                  onClick={() => {
                    setShowImportOptions(SecretEnum.WIF);
                    setIsShowImportOptions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-500"
                >
                  WIF Text
                </button>
                <button
                  onClick={() => {
                    setShowImportOptions(SecretEnum.PRIVATEKEY);
                    setIsShowImportOptions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-500"
                >
                  Private Key (hex)
                </button>
              </div>
            )}
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
        isOpen={showImportOptions === SecretEnum.MNEMONIC}
        onClose={() => setShowImportOptions(null)}
        onSave={onImportAccount}
      />
      <ImportPrivateKeyModal
        isOpen={showImportOptions === SecretEnum.PRIVATEKEY}
        onClose={() => setShowImportOptions(null)}
        onSave={onImportAccount}
      />
      <ImportWifTextModal
        isOpen={showImportOptions === SecretEnum.WIF}
        onClose={() => setShowImportOptions(null)}
        onSave={onImportAccount}
      />
    </div>
  );
};
export default Account;
