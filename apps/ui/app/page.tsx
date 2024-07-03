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
    const hex = psbt.extractTransaction().toHex();
    console.log({ hex });
  };

  const onBroadcast = async () => {};

  useEffect(() => {
    getUtxoByAddress();
  }, [mnemonic]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex overflow-hidden">
      <Leftbar active="transaction" />

      <main className="flex-1 p-4 overflow-auto">
        <NetworkSection title="Transactions" />

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Transaction Builder</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-2">Signer</label>
              {/* <select
                onChange={(e) => setMnemonic(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              >
                <option disabled selected={true} value={""}>
                  {" "}
                  -- Select Signer --{" "}
                </option>
                {accounts.map((account, i) => (
                  <option key={i} value={account.mnemonic}>
                    Account {i + 1}
                  </option>
                ))}
              </select> */}
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
                    color: "#bdbfc3",
                  }),
                  control: (provided: any, state: any) => ({
                    ...provided,
                    cursor: "pointer",
                    backgroundColor: "#303a49",
                    borderColor: "#6b7280",
                    color: "#e5e7eb",
                    "&:hover": {
                      borderColor: "#305a49",
                    },
                  }),
                  singleValue: (provided: any) => ({
                    ...provided,
                    color: "#e5e7eb",
                  }),
                  menu: (provided: any) => ({
                    ...provided,
                    backgroundColor: "#111827",
                    color: "#e5e7eb",
                  }),
                  option: (provided: any, state: any) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "bg-gray-600"
                      : "bg-gray-800",
                    "&:hover": {
                      backgroundColor: "#14b8a6",
                    },
                    color: "#e5e7eb",
                  }),
                }}
                options={[
                  {
                    label: "p2wpkh",
                    options: accounts.map((item) => ({
                      value: `${item.mnemonic}:${item.p2wpkh}`,
                      label: `${item.p2wpkh} (P2WPKH)`,
                    })),
                  },
                  {
                    label: "p2tr",
                    options: accounts.map((item) => ({
                      value: `${item.mnemonic}:${item.p2tr}`,
                      label: `${item.p2tr} (P2TR)`,
                    })),
                  },
                ]}
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
                <option disabled selected={true} value={""}>
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
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                type="text"
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
            </div>
            <div className="flex space-x-2">
              <button
                disabled={!outputType}
                type="button"
                className="w-full py-2 bg-teal-500 rounded"
              >
                Sign Transaction
              </button>
              <button
                disabled={hex === ""}
                type="button"
                className="w-full py-2 bg-teal-500 rounded"
              >
                Broadcast
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* History Sidebar */}
      <aside className="w-1/4 bg-gray-800 p-4 overflow-y-auto h-screen">
        <h2 className="text-lg font-bold mb-4">History</h2>
        <ul className="space-y-2">
          {Array(20)
            .fill("")
            .map((_, index) => (
              <div
                key={index}
                className="flex space-x-4 justify-between items-center bg-gray-700 px-4 py-2 rounded"
              >
                <span>1Ub12...i12nmab</span>
                <span>2024-07-01 09:51:42.235</span>
                <button className="text-blue-400">
                  <i className="fas fa-sync-alt"></i>
                </button>
                <button className="text-blue-400">
                  <i className="fa-regular fa-share-from-square"></i>
                </button>
              </div>
            ))}
        </ul>
      </aside>
    </div>
  );
}
