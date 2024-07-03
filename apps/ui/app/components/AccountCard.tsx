"use client";

import { useEffect, useState } from "react";
import { AccountType } from "../types/Account";
import { useConfigContext } from "../contexts/ConfigContext";
import { NetworkConfigType } from "../types/ConfigType";

const AccountCard = ({
  index,
  account,
  showOptions,
  setShowOptions,
  removeAccount,
  copyToClipboard,
}: {
  index: number;
  account: AccountType;
  showOptions: AccountType | null;
  setShowOptions: (args: any) => void;
  removeAccount: (mnemonic: string) => void;
  copyToClipboard: (address: string) => void;
}) => {
  const { uri } = useConfigContext() as NetworkConfigType;
  const [p2wpkhBalance, setP2wpkhBalance] = useState<number>(0);
  const [p2trBalance, setP2trBalance] = useState<number>(0);

  const getBalanceByAddress = async () => {
    if (!uri) return;

    const [p2wpkh, p2tr] = await Promise.all([
      fetch(`api/address?uri=${uri}&address=${account.p2wpkh}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      fetch(`api/address?uri=${uri}&address=${account.p2tr}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    ]);

    const dataP2wpkh = await p2wpkh.json();
    const dataP2tr = await p2tr.json();

    setP2wpkhBalance(dataP2wpkh?.chain_stats?.funded_txo_sum);
    setP2trBalance(dataP2tr?.chain_stats?.funded_txo_sum);
  };

  const satsToBitcoin = (sats: number) => {
    const SATOSHIS_IN_BITCOIN = 100000000;
    return sats / SATOSHIS_IN_BITCOIN;
  };

  useEffect(() => {
    getBalanceByAddress();
  }, [account]);

  return (
    <div className="space-y-4 my-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold mb-2">Account {index + 1}</h2>
          <div className="relative">
            <button
              onClick={() =>
                showOptions ? setShowOptions(null) : setShowOptions(account)
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
                <button className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-500">
                  Faucet
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
              {satsToBitcoin(p2wpkhBalance)} BTC
              <span className="italic text-sm mx-2">
                ({p2wpkhBalance}) sats
              </span>
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
              {satsToBitcoin(p2trBalance)} BTC
              <span className="italic text-sm mx-2">({p2trBalance}) sats</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
