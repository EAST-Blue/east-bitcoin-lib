"use client";

import { useEffect, useRef, useState } from "react";
import Leftbar from "./components/Leftbar";
import NetworkSection from "./components/Network";
import { useAccountContext } from "./contexts/AccountContext";
import { AccountContextType } from "./types/Account";
import { useConfigContext } from "./contexts/ConfigContext";
import { NetworkConfigType } from "./types/ConfigType";
import {
  Address,
  AddressType,
  BElectrsAPI,
  Network,
  P2trUtxo,
  P2wpkhUtxo,
  PSBT,
  Script,
  Wallet,
  getAddressType,
} from "@east-bitcoin-lib/sdk";
import Select from "react-select";
import { BitcoinUTXO } from "@east-bitcoin-lib/sdk/dist/repositories/bitcoin/types";
import { PSBTOutput } from "./types/OutputContextType";
import { PrismEditor, createEditor } from "prism-code-editor";
import "prism-code-editor/prism/languages/nasm";
import "prism-code-editor/prism/languages/nasm";
import "prism-code-editor/layout.css";
import "prism-code-editor/scrollbar.css";
import "./prism-style.css";
import "prism-code-editor/languages/asm";
import { Input, Output } from "@east-bitcoin-lib/sdk/dist/psbt/types";
import { parseScript } from "./utils/parseOpcode";
import { OpReturn } from "@east-bitcoin-lib/sdk/dist/addresses/opReturn";
import HistorySidebar from "./components/HitsorySidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconSign from "./icons/iconSign";
import IconBroadcast from "./icons/IconBroadcast";

export default function Page(): JSX.Element {
  const { accounts } = useAccountContext() as AccountContextType;
  const { network, uri } = useConfigContext() as NetworkConfigType;

  const [mnemonic, setMnemonic] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [inputs, setInputs] = useState<BitcoinUTXO[]>([]);
  const [utxo, setUtxo] = useState<BitcoinUTXO | null>(null);
  const [outputType, setOutputType] = useState<string>("");
  const [addressOutput, setAddressOutput] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [hex, setHex] = useState<string>("");
  const [transactions, setTransactions] = useState([]);

  const toastSignedTransaction = () => {
    toast.info(<p>Transaction Signed. Please broadcast the transaction.</p>);
  };

  const toastBroadcastedTransaction = () => {
    toast.success(<p>Transaction broadcasted successfully.</p>);
  };

  const scriptRef = useRef<HTMLDivElement>(null);
  const scriptEditorRef = useRef<PrismEditor>();
  useEffect(() => {
    const editor = (scriptEditorRef.current = createEditor(scriptRef.current!, {
      value: "",
      language: "nasm",
      tabSize: 2,
      insertSpaces: false,
      lineNumbers: false,
      wordWrap: true,
    }));
    import("./extension").then((module) => module.addExtensions(editor));

    return editor.remove;
  }, [outputType]);

  const getUtxoByAddress = async () => {
    if (mnemonic === "") return;
    if (address === "") return;
    if (!uri) return;
    if (!network) return;

    const bitcoinApi = new BElectrsAPI({
      network: network as Network,
      apiUrl: {
        [network]: uri,
      },
    });

    const utxos = await bitcoinApi.getUTXOs(address);
    const confirmedUtxos =
      utxos.filter((utxo) => utxo.status.confirmed === true) || [];

    setInputs(confirmedUtxos);
  };

  const onSignTransaction = async () => {
    if (!utxo) return;
    if (outputType === "address" && amount <= 0) return;
    if (outputType === "address" && addressOutput === "") return;
    if (outputType === "script" && !scriptEditorRef.current?.value) return;

    // Load Wallet
    const wallet = new Wallet({
      mnemonic,
      network: network as Network,
    });

    // Prepare inputs
    const inputs: Input[] = [];
    const addressType: AddressType = getAddressType(utxo.address);
    switch (addressType) {
      case "p2wpkh":
        const p2wpkhUtxo = await P2wpkhUtxo.fromBitcoinUTXO(utxo);
        inputs.push({ utxo: p2wpkhUtxo, value: utxo.value });
        break;

      case "p2tr":
        const p2tr = wallet.p2tr(0);
        const p2trUtxo = await P2trUtxo.fromBitcoinUTXO(
          utxo,
          p2tr.tapInternalKey
        );
        inputs.push({ utxo: p2trUtxo, value: utxo.value });
        break;

      default:
        break;
    }

    // Prepare outputs
    const outputs: Output[] = [];
    if (outputType === "address") {
      outputs.push({
        output: Address.fromString(addressOutput!),
        value: amount,
      });
    } else if (outputType === "script") {
      const bufferScript = parseScript(scriptEditorRef.current?.value!);
      outputs.push({
        output: new OpReturn({ script: Script.compile(bufferScript) }),
        value: 546, // hardcoded value
      });
    }

    // Build PSBT
    const p = new PSBT({
      network: network as Network,
      inputs: inputs,
      outputs: outputs,
      feeRate: 1,
      changeOutput: Address.fromString(address),
    });
    await p.build();
    const psbt = p.toPSBT();

    // Sign Inputs
    for (const [index, psbtInput] of p.inputs.entries()) {
      switch (true) {
        case psbtInput.utxo instanceof P2wpkhUtxo:
          psbt.signInput(index, wallet.p2wpkh(0).keypair);
          psbt.finalizeInput(index);
          break;

        case psbtInput.utxo instanceof P2trUtxo:
          psbt.signInput(index, wallet.p2tr(0).keypair);
          psbt.finalizeInput(index);
          break;

        default:
          break;
      }
    }

    // Finalize Tx
    const _hex = psbt.extractTransaction().toHex();
    setHex(_hex);

    toastSignedTransaction();
  };

  const onBroadcast = async () => {
    if (!uri) return;
    if (!network) return;

    try {
      const response = await fetch("api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uri, hex }),
      });
      if (!response.ok) {
        throw new Error(`error broadcast`);
      }
      const result = await response.json();

      // Save to db
      const responseSaveDb = await fetch("api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, network, hex, amount, txid: result }),
      });
      if (!responseSaveDb.ok) {
        throw new Error(`error broadcast`);
      }
      const resultSaveDb = await responseSaveDb.json();
      console.log(resultSaveDb);

      getTransactionHistory();
      resetState();

      toastBroadcastedTransaction();
    } catch (error) {
      console.error(error);
    }
  };

  const getTransactionHistory = async () => {
    if (!network) return;

    try {
      const response = await fetch("api/transaction", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Error fetching transaction data`);
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetState = () => {
    setMnemonic("");
    setAddress("");
    setInputs([]);
    setUtxo(null);
    setOutputType("");
    setAddressOutput("");
    setAmount(0);
    setHex("");
  };

  useEffect(() => {
    getUtxoByAddress();
  }, [address]);

  useEffect(() => {
    getTransactionHistory();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white overflow-hidden">
      <Leftbar active="transaction" />

      <main className="flex-1 flex-row p-4">
        <NetworkSection />

        <div className="flex w-full">
          <div className="w-2/3 pr-4">
            <div className="bg-white-1 p-3 rounded-lg">
              <h2 className="text-xl font-bold">Transaction Builder</h2>
            </div>
            <form className="mt-2">
              <div className="bg-white-1 p-3 rounded-lg space-y-4">
                <div>
                  <label className="block mb-2 text-white-7 font-semibold text-sm tracking-wide">
                    Signer
                  </label>
                  <Select
                    onChange={(e: any) => {
                      const [mnemonic, address] = e.value?.split(":");
                      setMnemonic(mnemonic);
                      setAddress(address);
                    }}
                    className="cursor-pointer"
                    placeholder="Select Address"
                    styles={{
                      placeholder: (provided: any) => ({
                        ...provided,
                        color: "rgba(255,255,255,0.6)",
                      }),
                      input: (provided: any) => ({
                        ...provided,
                        color: "rgba(255,255,255,0.8)",
                      }),
                      control: (provided: any, state: any) => ({
                        ...provided,
                        cursor: "pointer",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                        boxShadow: "none !important",
                        "*": {
                          boxShadow: "none !important",
                          fontWeight: "semibold",
                        },
                        "&:hover": {
                          borderColor: "rgba(255,255,255,0.4)",
                        },
                      }),
                      singleValue: (provided: any) => ({
                        ...provided,
                        color: "#e5e7eb",
                      }),
                      menu: (provided: any) => ({
                        ...provided,
                        backgroundColor: "var(--black-2)",
                        color: "#e5e7eb",
                      }),
                      option: (provided: any, state: any) => ({
                        ...provided,
                        fontWeight: "semibold",
                        backgroundColor: state.isSelected
                          ? "var(--black-3)"
                          : "",
                        color: state.isSelected
                          ? "rgba(255,255,255,1)"
                          : "rgba(255,255,255,0.7)",
                        "&:hover": {
                          backgroundColor: "var(--black-3)",
                          color: "rgba(255,255,255,1)",
                        },
                      }),
                    }}
                    options={accounts.map((account, i) => ({
                      label: `Account ${i + 1}`,
                      options: [
                        {
                          value: `${account.mnemonic}:${account.p2wpkh}`,
                          label: `${account.p2wpkh} (P2WPKH)`,
                        },
                        {
                          value: `${account.mnemonic}:${account.p2tr}`,
                          label: `${account.p2tr} (P2TR)`,
                        },
                      ],
                    }))}
                  />
                </div>

                <div>
                  <label className="block mb-2">Input</label>
                  <select
                    disabled={address === ""}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    onChange={(e) => setUtxo(JSON.parse(e.target.value))}
                  >
                    <option disabled selected={true}>
                      -- Select Input --
                    </option>
                    {inputs.map((_utxo, i) => (
                      <option key={i} value={JSON.stringify(_utxo)}>
                        {_utxo.txid} - {_utxo.value} sats
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Output</label>
                  <select
                    disabled={!utxo}
                    onChange={(e) => setOutputType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                  >
                    <option disabled selected={true}>
                      -- Address/Script --
                    </option>
                    <option value={"address"}>Address</option>
                    <option value={"script"}>Script</option>
                  </select>
                </div>
                {outputType === "address" && (
                  <div>
                    <label className="block mb-2">Input Address</label>
                    <input
                      value={addressOutput}
                      onChange={(e) => setAddressOutput(e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 rounded"
                    />
                  </div>
                )}
                {outputType === "script" && (
                  <div>
                    <label className="block mb-2">Custom Script</label>
                    <div
                      ref={scriptRef}
                      className="w-full rounded-sm border border-gray-700 overflow-auto break-words"
                    />
                  </div>
                )}

                <div>
                  <label className="block mb-2">Amount</label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    type="number"
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                  />
                </div>
              </div>

              <div className="mt-2 flex items-center bg-white-1 p-3 rounded-lg space-x-2">
                <div className="w-1/3 flex font-semibold text-white-7">
                  <div className="w-[120px]">
                    <p>Rate</p>
                    <p>Gas Fee</p>
                  </div>
                  <div>
                    <p>
                      <span className="text-white-9">100</span> Sats/vByte
                    </p>
                    <p>
                      <span className="text-white-9">100,000</span> Sats
                    </p>
                  </div>
                </div>
                <div className="w-2/3 flex justify-end space-x-4">
                  <button
                    disabled={!outputType}
                    onClick={onSignTransaction}
                    type="button"
                    className="flex px-4 items-center py-2 disabled:cursor-not-allowed rounded-lg bg-gradient-to-b from-white-2 to-white-1 disabled:opacity-50"
                  >
                    <div>
                      <IconSign size={20} color="rgba(255,255,255,0.7)" />
                    </div>
                    <p className="pl-1 whitespace-nowrap font-semibold">
                      Sign Transaction
                    </p>
                  </button>
                  <button
                    disabled={hex === ""}
                    onClick={onBroadcast}
                    type="button"
                    className="flex px-4 items-center py-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg bg-gradient-to-b from-white-2 to-white-1"
                  >
                    <div>
                      <IconBroadcast size={24} color="rgba(255,255,255,0.7)" />
                    </div>
                    <p className="pl-1 whitespace-nowrap font-semibold">
                      Broadcast
                    </p>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <HistorySidebar transactions={transactions} />
        </div>
      </main>

      <ToastContainer hideProgressBar={true} theme="light" />
    </div>
  );
}
