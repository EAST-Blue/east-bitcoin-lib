"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useNetworkContext } from "../contexts/NetworkContext";
import { useKeyContext } from "../contexts/KeyContext";
import {
  BElectrsAPI,
  Script,
  StackScripts,
  Wallet,
} from "@east-bitcoin-lib/sdk";
import { useInputContext } from "../contexts/InputContext";
import { BitcoinUTXO } from "@east-bitcoin-lib/sdk/dist/repositories/bitcoin/types";
import { InputContextType } from "../types/InputContextType";
import { useLockScriptContext } from "../contexts/LockScriptContext";
import { LockScriptContextType } from "../types/LockScriptContextType";
import { parseScript } from "../utils/parseOpcode";
import { PrismEditor, createEditor } from "prism-code-editor";

const InputModal = ({
  isOpen,
  setIsOpen,
  title = "",
}: {
  isOpen: any;
  setIsOpen: any;
  title: string;
}) => {
  const { utxos, saveUtxos } = useInputContext() as InputContextType;
  const { key } = useKeyContext() as any;
  const { network, networkOption } = useNetworkContext() as any;
  const { lockScript } = useLockScriptContext() as LockScriptContextType;

  const unlockRef = useRef<HTMLDivElement>(null);
  const unlockEditorRef = useRef<PrismEditor>();
  const lockRef = useRef<HTMLDivElement>(null);
  const lockEditorRef = useRef<PrismEditor>();

  const [selectedInput, setSelectedInput] = useState<any | null>(null);
  const [inputs, setInputs] = useState<BitcoinUTXO[]>([]);
  const [addressType, setAddressType] = useState<string>("");

  useEffect(() => {
    const editor = (unlockEditorRef.current = createEditor(unlockRef.current!, {
      value: "",
      language: "nasm",
      tabSize: 2,
      insertSpaces: false,
      lineNumbers: false,
      wordWrap: true,
    }));
    import("../psbt/extension").then((module) => module.addExtensions(editor));

    return editor.remove;
  }, [addressType]);

  useEffect(() => {
    const editor = (lockEditorRef.current = createEditor(lockRef.current!, {
      value: "",
      language: "nasm",
      tabSize: 2,
      insertSpaces: false,
      lineNumbers: false,
      wordWrap: true,
    }));
    import("../psbt/extension").then((module) => module.addExtensions(editor));

    return editor.remove;
  }, [addressType]);

  const onSave = () => {
    if (!selectedInput) return;

    // hacky for p2sh
    if (unlockEditorRef.current?.value) {
      selectedInput["lockScript"] = lockEditorRef.current?.value;
      selectedInput["unlockScript"] = unlockEditorRef.current?.value;
    }
    saveUtxos([selectedInput]);

    setSelectedInput(null);
    setInputs([]);
    setIsOpen(false);
    setAddressType("");
  };

  const getInputsByAddress = async () => {
    if (addressType === "") return;
    if (!network) return;

    const wallet = new Wallet({
      network: networkOption,
      mnemonic: key,
    });
    const bitcoinApi = new BElectrsAPI({
      network: networkOption,
      apiUrl: {
        [networkOption]: network,
      },
    });

    let _inputs: any[] = [];
    switch (addressType) {
      case "p2pkh":
        const p2pkh = wallet.p2pkh(0);
        _inputs = await bitcoinApi.getUTXOs(p2pkh.address);
        break;

      case "p2wpkh":
        const p2wpkh = wallet.p2wpkh(0);
        _inputs = await bitcoinApi.getUTXOs(p2wpkh.address);
        break;

      case "p2tr":
        const p2tr = wallet.p2tr(0);
        _inputs = await bitcoinApi.getUTXOs(p2tr.address);
        break;

      default:
        break;
    }

    const filteredInputs =
      _inputs?.filter((i) => i?.status?.confirmed === true) || [];

    if (utxos.length > 0) {
      const unusedInputs = filteredInputs.filter((i) => {
        return !utxos.some((e) => e.txid === i.txid);
      });
      setInputs(unusedInputs);
    } else {
      setInputs(filteredInputs);
    }
  };

  useEffect(() => {
    getInputsByAddress();
  }, [addressType]);

  useEffect(() => {
    getInputsByAddress();
  }, []);

  const onSaveScript = async () => {
    const lockScript = lockEditorRef.current?.value;
    const unlockScript = unlockEditorRef.current?.value;

    if (!lockScript) return;
    if (!unlockScript) return;

    const wallet = new Wallet({
      network: networkOption,
      mnemonic: key,
    });
    const bitcoinApi = new BElectrsAPI({
      network: networkOption,
      apiUrl: {
        [networkOption]: network,
      },
    });

    const p2sh = wallet.p2sh(parseScript(lockScript!));
    const _inputs = await bitcoinApi.getUTXOs(p2sh.address);

    const filteredInputs =
      _inputs?.filter((i) => i?.status?.confirmed === true) || [];

    if (utxos.length > 0) {
      const unusedInputs = filteredInputs.filter((i) => {
        return !utxos.some((e) => e.txid === i.txid);
      });
      setInputs(unusedInputs);
    } else {
      setInputs(filteredInputs);
    }
  };

  return (
    <div
      onClick={() => setIsOpen(false)}
      className={`fixed inset-0 ${isOpen ? "z-50" : "delay-500 -z-10"}`}
    >
      <div
        className={`absolute inset-0 overflow-auto pb-16 bg-black bg-opacity-80 p-6 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex h-full items-center justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md mx-auto bg-[#0F111B] rounded-lg text-gray-200 overflow-hidden border border-gray-800"
          >
            <div className="w-full p-4 flex items-center justify-between gap-x-[300px] bg-[#0F111B]">
              <p className="text-title text-xl font-bold tracking-wide">
                {title}
              </p>
              <div
                className="w-5 cursor-pointer hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 66 66"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.99987 0.000111535C8.23224 0.000111535 7.46377 0.292518 6.87877 0.879018L0.878774 6.87902C-0.294227 8.05202 -0.294227 9.95121 0.878774 11.1212L22.7577 33.0001L0.878774 54.879C-0.294227 56.052 -0.294227 57.9512 0.878774 59.1212L6.87877 65.1212C8.05177 66.2942 9.95096 66.2942 11.121 65.1212L32.9999 43.2423L54.8788 65.1212C56.0488 66.2942 57.951 66.2942 59.121 65.1212L65.121 59.1212C66.294 57.9482 66.294 56.049 65.121 54.879L43.2421 33.0001L65.121 11.1212C66.294 9.95121 66.294 8.04902 65.121 6.87902L59.121 0.879018C57.948 -0.293982 56.0488 -0.293982 54.8788 0.879018L32.9999 22.7579L11.121 0.879018C10.5345 0.292518 9.76749 0.000111535 8.99987 0.000111535Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col p-4">
              <div className="flex flex-row">
                <div className="w-full  my-2">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    Address Type:
                  </label>
                  <select
                    value={addressType}
                    onChange={(e) => setAddressType(e.target.value)}
                    className="w-11/12 bg-[#0F111B] hover:bg-[#0F171B] rounded-md text-sm hover:cursor-pointer"
                  >
                    <option value={""} selected>
                      --- Choose address type ---
                    </option>
                    <option value={"p2pkh"}>
                      P2PKH (Pay to Public Key Hash)
                    </option>
                    <option value={"p2wpkh"}>
                      P2WPKH (Pay to Witness Public Key Hash)
                    </option>
                    <option value={"p2sh"}>P2SH (Pay to Script Hash)</option>
                    <option value={"p2tr"}>P2TR (Pay to Taproot)</option>
                  </select>
                </div>
              </div>

              {addressType === "p2sh" && (
                <div className="pb-6 mt-4">
                  <div className="flex flex-row gap-x-2">
                    <div className="w-full border-b border-gray-900/10">
                      <label className="block text-sm font-medium text-gray-200">
                        Lockscript
                      </label>
                      <div className="flex flex-cols gap-x-2 justify-around">
                        <div
                          ref={lockRef}
                          className="w-full rounded-sm border border-gray-700 overflow-auto break-words"
                        />
                      </div>
                    </div>
                    <div className="w-full border-b border-gray-900/10">
                      <label className="block text-sm font-medium text-gray-200">
                        Unlockscript
                      </label>
                      <div className="flex flex-cols gap-x-2 justify-around">
                        <div
                          ref={unlockRef}
                          className="w-full rounded-sm border border-gray-700 overflow-auto break-words"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onSaveScript}
                    className="text-center rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-10 mt-1 mx-auto"
                  >
                    Load P2SH UTXO
                  </button>
                </div>
              )}

              <div className="flex flex-row">
                <div className="w-full  my-2">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    Choose UTXO :
                  </label>
                  <select
                    className="w-11/12 bg-[#0F111B] hover:bg-[#0F171B] rounded-md text-sm hover:cursor-pointer"
                    onChange={(e) =>
                      setSelectedInput(JSON.parse(e.target.value))
                    }
                  >
                    <option selected>--- Choose your UTXO ---</option>
                    {inputs.map((i) => (
                      <option value={JSON.stringify(i)}>
                        {i.txid} - {i.value} sats
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {selectedInput && (
                <div className="flex flex-row">
                  <div className="w-full my-2">
                    <label className="block text-sm font-medium leading-6 text-gray-200">
                      vout:
                    </label>
                    <input
                      disabled
                      className="bg-transparent rounded-md text-sm hover:cursor-not-allowed border-gray-700"
                      value={selectedInput.vout}
                    />
                  </div>
                </div>
              )}
              {selectedInput && (
                <div className="flex flex-row">
                  <div className="w-full my-2">
                    <label className="block text-sm font-medium leading-6 text-gray-200">
                      value (sats):
                    </label>
                    <input
                      disabled
                      className="bg-transparent rounded-md text-sm hover:cursor-not-allowed border-gray-700"
                      value={selectedInput.value}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-row my-2">
                <button
                  className="w-full rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-40"
                  disabled={inputs.length === 0}
                  onClick={onSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
