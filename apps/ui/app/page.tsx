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
  RegboxAPI,
  Script,
  Wallet,
  getAddressType,
} from "@east-bitcoin-lib/sdk";
import Select, { MultiValue, NonceProvider } from "react-select";
import { BitcoinUTXO } from "@east-bitcoin-lib/sdk/dist/repositories/bitcoin/types";
import { PSBTOutput } from "./types/OutputContextType";
import { PrismEditor, createEditor } from "prism-code-editor";
import "prism-code-editor/prism/languages/nasm";
import "prism-code-editor/layout.css";
import "prism-code-editor/scrollbar.css";
import "./prism-style.css";
import { Input, Output } from "@east-bitcoin-lib/sdk/dist/psbt/types";
import { OpReturn } from "@east-bitcoin-lib/sdk/dist/addresses/opReturn";
import HistorySidebar from "./components/HitsorySidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconSign from "./icons/iconSign";
import IconBroadcast from "./icons/IconBroadcast";
import { SelectStyles, TX_OUTPUT_OPTIONS } from "./utils/constant";
import { prettyTruncate } from "./utils/prettyTruncate";
import IconPlus from "./icons/IconPlus";
import SignedTxModal from "./components/SignedTxModal";
import GenerateCodeModal from "./components/GenerateCodeModal";

const formatBuffer = (buffer: any[]) => {
  console.log(buffer);
  return `Buffer.from([${buffer.join(", ")}])`;
};

const formatInputs = (inputs: any[]) => {
  return inputs.map((input) => {
    if (input.utxo && input.utxo.witness && input.utxo.witness.script) {
      input.utxo.witness.script = formatBuffer(input.utxo.witness.script.data);
    }
    return input;
  });
};

const formatOutputs = (outputs: any[]) => {
  return outputs.map((output) => {
    if (output.output && output.output.script) {
      output.output.script = formatBuffer(output.output.script.data);
    }
    return output;
  });
};

export default function Page(): JSX.Element {
  const { accounts } = useAccountContext() as AccountContextType;
  const { network, uri } = useConfigContext() as NetworkConfigType;

  const [mnemonic, setMnemonic] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [inputs, setInputs] = useState<BitcoinUTXO[]>([]);
  const [utxos, setUtxos] = useState<BitcoinUTXO[]>([]);
  const [outputType, setOutputType] = useState<string>("");
  const [addressOutput, setAddressOutput] = useState<string>("");
  const [outputs, setOutputs] = useState<PSBTOutput[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [hex, setHex] = useState<string>("");
  const [transactions, setTransactions] = useState([]);
  const [isBroadcastDropdown, setIsBroadcastDropdown] = useState(false);
  const [isSignedTxModalOpen, setIsSignedTxModalOpen] = useState(false);
  const [isGenerateCodeModalOpen, setIsGenerateCodeModalOpen] = useState(false);
  const [psbtInputs, setPsbtInputs] = useState<any[]>([]); // only used for generate client code
  const [psbtOutputs, setPsbtOutputs] = useState<any[]>([]); // only used for generate client code

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
    if (utxos.length < 1) return;
    if (outputType === "address" && amount <= 0) return;
    if (outputType === "address" && addressOutput === "") return;
    if (outputType === "script" && !scriptEditorRef.current?.value) return;

    // Load Wallet
    const wallet = new Wallet({
      mnemonic,
      network: network as Network,
    });

    // Prepare inputs
    const _psbtInputs: Input[] = [];
    for (const utxo of utxos) {
      const addressType: AddressType = getAddressType(utxo.address);
      switch (addressType) {
        case "p2wpkh":
          const p2wpkhUtxo = await P2wpkhUtxo.fromBitcoinUTXO(utxo);
          _psbtInputs.push({ utxo: p2wpkhUtxo, value: utxo.value });
          break;

        case "p2tr":
          const p2tr = wallet.p2tr(0);
          const p2trUtxo = await P2trUtxo.fromBitcoinUTXO(
            utxo,
            p2tr.tapInternalKey
          );
          _psbtInputs.push({ utxo: p2trUtxo, value: utxo.value });
          break;

        default:
          break;
      }
    }

    // Prepare outputs
    const _pbstOutputs: Output[] = [];
    for (const output of outputs) {
      if (output.address) {
        _pbstOutputs.push({
          output: Address.fromString(output.address!),
          value: output.value,
        });
      } else if (output.script) {
        const bufferScript = output.script.split("OP_RETURN ");
        _pbstOutputs.push({
          output: new OpReturn({
            dataScripts: [Script.encodeUTF8(bufferScript[1]!)],
          }),
          value: 546, // hardcoded value
        });
      }
    }

    // Build PSBT
    const p = new PSBT({
      network: network as Network,
      inputs: _psbtInputs,
      outputs: _pbstOutputs,
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

    // This is for code generator
    setPsbtInputs(utxos);
    setPsbtOutputs(outputs);

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
    setUtxos([]);
    setOutputType("");
    setAddressOutput("");
    setAmount(0);
    setHex("");
    setOutputs([]);
  };

  useEffect(() => {
    getUtxoByAddress();
  }, [address]);

  useEffect(() => {
    getTransactionHistory();
  }, []);

  const handleChange = (
    selectedOptions: MultiValue<{
      label: string;
      value: string;
    }>
  ) => {
    const selectedUtxo = selectedOptions
      ? selectedOptions.map((option) => JSON.parse(option.value))
      : [];
    setUtxos(selectedUtxo);
  };

  const onSaveOutput = () => {
    if (outputType === "address" && addressOutput === "") return;
    if (outputType === "script" && !scriptEditorRef.current?.value) return;

    if (outputType === "address") {
      setOutputs([...outputs, ...[{ address: addressOutput, value: amount }]]);
      setAddressOutput("");
      setAmount(0);
    } else if (outputType === "script") {
      setOutputs([
        ...outputs,
        ...[{ script: scriptEditorRef.current?.value, value: 564 }],
      ]);
    }

    setOutputType("");
  };

  const onRemoveOutput = (index: number) => {
    setOutputs((output) => output.filter((_, i) => i !== index));
  };

  const onGenerateCode = () => {
    console.log(inputs, outputs);
  };

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
                  <label className="block mb-1 text-white-7 font-semibold text-sm tracking-wide">
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
                  <label className="block mb-1 text-white-7 font-semibold text-sm tracking-wide">
                    Input
                  </label>
                  <Select
                    isMulti
                    isDisabled={false}
                    isSearchable={false}
                    onChange={handleChange}
                    className="cursor-pointer"
                    placeholder="-- Select Input --"
                    styles={SelectStyles}
                    options={inputs.map((_utxo) => ({
                      label: `${_utxo.txid} - ${_utxo.value} sats`,
                      value: JSON.stringify(_utxo),
                    }))}
                    value={utxos.map((_utxo) => ({
                      label: `${prettyTruncate(_utxo.txid, 32, "address")} - ${_utxo.value} sats`,
                      value: JSON.stringify(_utxo),
                    }))}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-white-7 font-semibold text-sm tracking-wide">
                    Output
                  </label>
                  <Select
                    isDisabled={!utxos}
                    onChange={(e: any) => setOutputType(e.value)}
                    className="cursor-pointer"
                    placeholder="-- Address/Script --"
                    isSearchable={false}
                    styles={SelectStyles}
                    options={TX_OUTPUT_OPTIONS}
                  />
                </div>

                {outputType !== "" && (
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-md p-2">
                    {outputType === "address" && (
                      <>
                        <div>
                          <label className="block mb-1 text-white-7 font-semibold text-sm tracking-wide">
                            Input Address
                          </label>
                          <input
                            value={addressOutput}
                            onChange={(e) => setAddressOutput(e.target.value)}
                            type="text"
                            className="w-full px-3 h-[38px] border-white-1 font-medium bg-[rgba(255,255,255,0.05)] rounded-lg outline-none text-white-8 focus:outline-none focus:border-white-4 focus:ring-0 focus:ring-offset-0"
                          />
                        </div>
                        <div className="mt-1">
                          <label className="block mb-1 text-white-7 font-semibold text-sm tracking-wide">
                            Amount
                          </label>
                          <input
                            value={amount}
                            onChange={(e) =>
                              setAmount(parseInt(e.target.value))
                            }
                            type="number"
                            className="w-full px-3 h-[38px] border-white-1 font-medium bg-[rgba(255,255,255,0.05)] rounded-lg outline-none text-white-8 focus:outline-none focus:border-white-4 focus:ring-0 focus:ring-offset-0"
                          />
                        </div>
                      </>
                    )}
                    {outputType === "script" && (
                      <div>
                        <label className="block mb-1 text-white-7 font-semibold text-sm tracking-wide">
                          Custom Script
                        </label>
                        <div
                          ref={scriptRef}
                          className="w-full px-3 h-[38px] border-white-1 font-medium bg-[rgba(255,255,255,0.05)] rounded-lg outline-none text-white-8 focus:outline-none focus:border-white-4 focus:ring-0 focus:ring-offset-0"
                        />
                      </div>
                    )}
                    <div className="mt-1">
                      <button
                        onClick={onSaveOutput}
                        type="button"
                        className="flex px-2 mt-2 items-center py-1 disabled:cursor-not-allowed rounded-lg bg-gradient-to-b from-white-2 to-white-1 hover:from-white-1 disabled:opacity-50"
                      >
                        <IconPlus size={15} color="rgba(255,255,255,0.7)" />
                        <p className="pl-1 text-sm whitespace-nowrap font-semibold">
                          Save
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {outputs.map((_output, i) => (
                  <div className="flex items-center justify-end ml-auto gap-x-2">
                    <p className="text-sm mt-2 text-[rgba(255,255,255,0.5)]">
                      Output {i + 1}
                    </p>
                    <button
                      onClick={() => onRemoveOutput(i)}
                      type="button"
                      className=" flex gap-x-2 px-2 mt-2 items-center py-1 disabled:cursor-not-allowed rounded-lg bg-gradient-to-b from-white-2 to-white-1 hover:from-white-1 disabled:opacity-50"
                    >
                      {_output.address && (
                        <>
                          <p className="text-sm italic whitespace-nowrap">
                            {_output.value} sats
                          </p>
                          <p className="text-sm whitespace-nowrap">to </p>
                          <p className="text-sm font-bold whitespace-nowrap">
                            {prettyTruncate(_output.address, 12, "address")}
                          </p>
                          <i className="fa-solid fa-trash ml-2 text-sm whitespace-nowrap font-semibold"></i>
                        </>
                      )}

                      {_output.script && (
                        <>
                          <p className="text-sm whitespace-nowrap">
                            Custom Script
                          </p>
                          <p className="text-sm font-bold whitespace-nowrap">
                            {prettyTruncate(_output.script, 32)}
                          </p>
                          <i className="fa-solid fa-trash ml-2 text-sm whitespace-nowrap font-semibold"></i>
                        </>
                      )}
                    </button>
                  </div>
                ))}
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
                    disabled={outputs.length < 1}
                    onClick={onSignTransaction}
                    type="button"
                    className="flex px-4 items-center py-2 disabled:cursor-not-allowed rounded-lg bg-gradient-to-b from-white-2 to-white-1 hover:from-white-1 disabled:opacity-50"
                  >
                    <div>
                      <IconSign size={20} color="rgba(255,255,255,0.7)" />
                    </div>
                    <p className="pl-1 whitespace-nowrap font-semibold">
                      Sign Transaction
                    </p>
                  </button>

                  <div className="relative inline-block text-left">
                    <div className="flex">
                      <button
                        disabled={hex === ""}
                        onClick={onBroadcast}
                        type="button"
                        className="flex px-4 rounded-r-none items-center py-2 disabled:select-none disabled:cursor-not-allowed disabled:opacity-50 rounded-lg bg-gradient-to-b from-white-2 to-white-1 hover:from-white-1"
                      >
                        <IconBroadcast
                          size={24}
                          color="rgba(255,255,255,0.7)"
                        />
                        <p className="pl-1 whitespace-nowrap font-semibold">
                          Broadcast
                        </p>
                      </button>
                      <button
                        disabled={hex === ""}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsBroadcastDropdown(!isBroadcastDropdown);
                        }}
                        className="flex px-4 rounded-l-none items-center py-2 disabled:select-nlne cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded-lg bg-gradient-to-b from-white-2 to-white-1 hover:from-white-2"
                      >
                        ▾
                      </button>
                    </div>
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#262626] ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div
                        className={`py-1 ${isBroadcastDropdown ? "" : "hidden"}`}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsSignedTxModalOpen(true);
                          }}
                          className="flex items-center px-4 py-2 w-full text-white hover:bg-gray-700 focus:outline-none hover:rounded-t-md"
                        >
                          <i className="fa fa-key px-2"></i>
                          Get Signed Tx
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsGenerateCodeModalOpen(true);
                          }}
                          className="flex items-center px-4 py-2 w-full text-white hover:bg-gray-700 focus:outline-none hover:rounded-b-md"
                        >
                          <i className="fa fa-code px-2"></i>
                          Generate Code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <HistorySidebar transactions={transactions} />
        </div>
      </main>

      <ToastContainer hideProgressBar={true} theme="light" />
      <SignedTxModal
        isOpen={isSignedTxModalOpen}
        onClose={() => {
          setIsSignedTxModalOpen(false);
        }}
        hex={hex}
      />
      <GenerateCodeModal
        isOpen={isGenerateCodeModalOpen}
        onClose={() => setIsGenerateCodeModalOpen(false)}
        code={`
import { Address, AddressType, Script, Wallet, P2wpkhUtxo, P2trUtxo, PSBT, getAddressType } from "@east-bitcoin-lib/sdk";
import { Input, Output } from "@east-bitcoin-lib/sdk/dist/psbt/types";
import { OpReturn } from "@east-bitcoin-lib/sdk/dist/addresses/opReturn";

async function buildPSBT() {
  const wallet = new Wallet({
    mnemonic: "${mnemonic}",
    network: "${network}"
  });

  const inputs = ${JSON.stringify(psbtInputs)}
  const outputs = ${JSON.stringify(psbtOutputs)} as any[]

  // Prepare inputs
  const psbtInputs: Input[] = [];
  for (const utxo of inputs) {
    const addressType: AddressType = getAddressType(utxo.address);
    switch (addressType) {
      case "p2wpkh":
        const p2wpkhUtxo = await P2wpkhUtxo.fromBitcoinUTXO(utxo);
        psbtInputs.push({ utxo: p2wpkhUtxo, value: utxo.value });
        break;

      case "p2tr":
        const p2tr = wallet.p2tr(0);
        const p2trUtxo = await P2trUtxo.fromBitcoinUTXO(
          utxo,
          p2tr.tapInternalKey
        );
        psbtInputs.push({ utxo: p2trUtxo, value: utxo.value });
        break;

      default:
        break;
    }
  }

  // Prepare outputs
  const psbtOutputs: Output[] = [];
  for (const output of outputs) {
    if (output.address) {
      psbtOutputs.push({
        output: Address.fromString(output.address!),
        value: output.value,
      });
    } else if (output.script) {
      const bufferScript = output.script.split("OP_RETURN ");
      psbtOutputs.push({
        output: new OpReturn({
          dataScripts: [Script.encodeUTF8(bufferScript[1]!)],
        }),
        value: 546, // hardcoded value
      });
    }
  }

  const p = new PSBT({
    network: "${network}",
    inputs: psbtInputs,
    outputs: psbtOutputs,
    feeRate: 1,
    changeOutput: ${address !== "" ? `Address.fromString("${address}")` : ""}
  })

  await p.build()
  const psbt = p.toPSBT()

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
  
  // Generate Tx Hex
  const hex = psbt.extractTransaction().toHex();
  console.log(hex)
}

buildPSBT()`}
      />
    </div>
  );
}
