"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import InputModal from "../components/InputModal";
import Sidebar from "../components/Sidebar";
import { useKeyContext } from "../contexts/KeyContext";
import ImportWifModal from "../components/ImportWifModal";

import OutputModal from "../components/OutputModal";
import { KeyOptionEnum } from "../enums/KeyOptionEnum";
import {
  API,
  Address,
  AddressType,
  BElectrsAPI,
  BitcoinAPIAbstract,
  OrdAPI,
  P2pkhUtxo,
  P2shAutoUtxo,
  P2shUtxo,
  P2trUtxo,
  P2wpkhUtxo,
  PSBT,
  Script,
  StackScripts,
  Wallet,
  ecpair,
  getAddressType,
} from "@east-bitcoin-lib/sdk";
import { useNetworkContext } from "../contexts/NetworkContext";
import RegtestModal from "../components/RegtestModal";
import { NetworkEnum } from "../enums/NetworkEnum";
import { useInputContext } from "../contexts/InputContext";
import InputViewModal from "../components/InputViewModal";
import { InputContextType } from "../types/InputContextType";
import { BitcoinUTXO } from "@east-bitcoin-lib/sdk/dist/repositories/bitcoin/types";
import { useOutputContext } from "../contexts/OutputContext";
import { OutputContextType, PSBTOutput } from "../types/OutputContextType";
import OutputViewModal from "../components/OutputViewModal";
import { CoinSelect } from "@east-bitcoin-lib/sdk/dist/psbt/coin-select";
import { Input } from "@east-bitcoin-lib/sdk/dist/psbt/types";
import { parseOutput } from "../utils/parseOutput";
import { PrismEditor, createEditor } from "prism-code-editor";
import axios from "axios";
import IconMine from "../icons/IconMine";
import { useUnlockScriptContext } from "../contexts/UnlockScriptContext";
import { UnlockScriptContextType } from "../types/UnlockScriptContextType";
import { parseScript } from "../utils/parseOpcode";
import { useLockScriptContext } from "../contexts/LockScriptContext";
import { LockScriptContextType } from "../types/LockScriptContextType";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page(): JSX.Element {
  const { key, keyOption, setKey, setKeyOption } = useKeyContext() as any;
  const { network, networkOption, setNetwork, setNetworkOption } =
    useNetworkContext() as any;
  const { utxos, saveUtxos } = useInputContext() as InputContextType;
  const { outputs, saveOutputs } = useOutputContext() as OutputContextType;
  const { unlockScript, saveUnlockScript } =
    useUnlockScriptContext() as UnlockScriptContextType;
  const { lockScript, saveLockScript } =
    useLockScriptContext() as LockScriptContextType;

  const toastMine = () =>
    toast(
      <p>
        Successfully mined a new block.{" "}
        <a
          className="underline text-gray-300"
          target="_blank"
          href="http://localhost:3000"
        >
          View
        </a>
      </p>,
      { autoClose: 1000 }
    );
  const toastBroadcast = (txid: string) =>
    toast(
      <p>
        Tx Successfully broadcasted.
        <a
          className="underline text-gray-300"
          target="_blank"
          href={`http://localhost:3000/tx/${txid}`}
        >
          View
        </a>
      </p>,
      { autoClose: 2000 }
    );

  const [openInputModal, setOpenInputModal] = useState(false);
  const [openOutputModal, setOpenOutputModal] = useState(false);
  const [openImportWif, setOpenImportWif] = useState(false);
  const [openRegtestModal, setOpenRegtestModal] = useState(false);
  const [viewInput, setViewInput] = useState<BitcoinUTXO | null>(null);
  const [viewOutput, setViewOutput] = useState<PSBTOutput | null>(null);
  const [isMining, setIsMining] = useState(false);

  const mine = async () => {
    setIsMining(true);
    const result = await axios.post(`http://localhost:8080/generate`, {
      nblocks: 1,
    });
    toastMine();

    setIsMining(false);
    return;
  };

  const sign = async () => {
    // if (network === null) return;
    // if (key === null) return;

    const bitcoinApi = new BElectrsAPI({
      network: "regtest",
      apiUrl: {
        regtest: network,
      },
    });

    const wallet = new Wallet({
      mnemonic: key,
      network: networkOption,
    });

    const inputs: Input[] = [];
    for (const utxo of utxos) {
      const addressType: AddressType = getAddressType(utxo.address);
      switch (addressType) {
        case "p2pkh":
          const p2pkhUtxo = await P2pkhUtxo.fromBitcoinUTXO(bitcoinApi, utxo);
          inputs.push({ utxo: p2pkhUtxo, value: utxo.value });
          break;

        case "p2wpkh":
          const p2wpkhUtxo = await P2wpkhUtxo.fromBitcoinUTXO(utxo);
          inputs.push({ utxo: p2wpkhUtxo, value: utxo.value });
          break;

        case "p2sh":
          const p2shUtxo = await P2shUtxo.fromBitcoinUTXO({
            bitcoinAPI: bitcoinApi,
            bitcoinUTXO: utxo,
            redeemScript: wallet.p2sh(parseScript(utxo?.lockScript!))
              .redeemScript,
            unlockScript: Script.compile(parseScript(utxo.unlockScript!)),
          });
          inputs.push({ utxo: p2shUtxo, value: utxo.value });
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
    }

    const p = new PSBT({
      network: networkOption,
      inputs: inputs,
      outputs: parseOutput(outputs),
      feeRate: 1,
      changeOutput: Address.fromString(wallet.p2wpkh(0).address), // TODO dummy
    });
    await p.build();

    const psbt = p.toPSBT();

    for (const [index, psbtInput] of p.inputs.entries()) {
      switch (true) {
        case psbtInput.utxo instanceof P2pkhUtxo:
          psbt.signInput(index, wallet.p2pkh(0).keypair);
          psbt.finalizeInput(index);
          break;

        case psbtInput.utxo instanceof P2wpkhUtxo:
          psbt.signInput(index, wallet.p2wpkh(0).keypair);
          psbt.finalizeInput(index);
          break;

        case psbtInput.utxo instanceof P2shUtxo:
          psbt.finalizeInput(
            index,
            PSBT.finalScript(psbtInput.utxo.unlockScript as any)
          );
          break;

        case psbtInput.utxo instanceof P2trUtxo:
          psbt.signInput(index, wallet.p2tr(0).keypair);
          psbt.finalizeInput(index);
          break;

        default:
          break;
      }
    }

    const hex = psbt.extractTransaction().toHex();
    console.log({ hex });

    const result = await axios.post(
      `http://localhost:8080/sendrawtransaction`,
      {
        hex,
      }
    );
    toastBroadcast(result.data);
    console.log(result.data);

    return;
  };

  return (
    <>
      <div className="w-full relative flex justify-around items-center">
        <div className="w-full flex flex-row items-center justify-center my-4 pb-4 border-b border-b-gray-700">
          <p className="text-2xl font-bold text-white">EAST PSBT Builder</p>
        </div>
      </div>

      <Sidebar />
      <main className="pl-64 grid grid-flow-col">
        <div className="w-full grid grid-cols-3 relative justify-center items-start mx-20 mt-10">
          <div className="flex flex-cols gap-y-4">
            <p className="text-xl text-white">Preview</p>
          </div>

          <div className="flex flex-col col-span-2">
            {/* Network  */}
            <label className="block text-sm font-medium leading-6 text-gray-200">
              Choose Network{" "}
              {networkOption !== null &&
                `: ${networkOption} ${network !== null && `(${network})`}`}
            </label>
            <div className="flex flex-row gap-x-4 ">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-2">
                  <button
                    className={`rounded-sm shadow-sm bg-[#814142] opacity-30 cursor-not-allowed text-gray-200 text-sm py-2 px-4`}
                    disabled
                  >
                    Mainnet
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-2">
                  <button
                    className={`rounded-sm shadow-sm bg-[#814142] opacity-30 cursor-not-allowed text-gray-200 text-sm py-2 px-4`}
                    disabled
                  >
                    Testnet
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-900/10 pb-12">
                <div className="flex flex-row gap-x-2 mt-2">
                  <button
                    onClick={() => {
                      setOpenRegtestModal(true);
                    }}
                    className={`${networkOption === NetworkEnum.REGTEST && "border-2 border-gray-300"} rounded-sm shadow-sm bg-[#874642] hover:bg-[#873642] text-gray-200 text-sm py-2 px-4`}
                  >
                    Regtest
                  </button>
                </div>
              </div>
            </div>

            {/* Key  */}
            <label className="block text-sm font-medium leading-6 text-gray-200">
              Choose your key
            </label>
            <div
              className={`${network === null && "opacity-30"} flex flex-row gap-x-4 pb-6`}
            >
              <div className="border-b border-gray-900/10">
                {" "}
                <div className="mt-2">
                  <button
                    className={`${keyOption === KeyOptionEnum.ALICE && "border-2 border-gray-300"} rounded-sm shadow-sm bg-[#874642] hover:bg-[#873642] text-gray-200 text-sm py-2 px-4`}
                    onClick={() => {
                      setKey(
                        "left alcohol close proof inform total box outer front jealous cement lunch"
                      );
                      setKeyOption(KeyOptionEnum.ALICE);
                    }}
                    disabled={network === null}
                  >
                    Alice Key
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-900/10">
                <div className="mt-2">
                  <button
                    className={`${keyOption === KeyOptionEnum.BOB && "border-2 border-gray-300"} rounded-sm shadow-sm bg-[#874642] hover:bg-[#873642] text-gray-200 text-sm py-2 px-4`}
                    onClick={() => {
                      setKey(
                        "nephew wise journey menu brand close garlic solution timber message salad knife"
                      );
                      setKeyOption(KeyOptionEnum.BOB);
                    }}
                    disabled={network === null}
                  >
                    Bob Key
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-900/10">
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setOpenImportWif(true);
                    }}
                    className={`${keyOption === KeyOptionEnum.WIF && "border-2 border-gray-300"} rounded-sm shadow-sm bg-[#874642] hover:bg-[#873642] text-gray-200 text-sm py-2 px-4`}
                    disabled={network === null}
                  >
                    Import Mnemonic
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="border-b border-gray-900/10 pb-12">
                <label className="block text-sm font-medium leading-6 text-gray-200">
                  Input
                </label>
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setOpenInputModal(true);
                    }}
                    className={`${key === null && "cursor-not-allowed opacity-30"} rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-[170px]`}
                    disabled={key === null}
                  >
                    Add Input +
                  </button>
                </div>
                {utxos?.map((utxo: any, i: number) => (
                  <div className="mt-2 text-right">
                    <button
                      onClick={() => {
                        setViewInput(utxo);
                      }}
                      className="rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-20"
                    >
                      Input {i + 1}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="border-b border-gray-900/10 pb-12">
                <label className="block text-sm font-medium leading-6 text-gray-200">
                  Output
                </label>
                <div className="mt-2">
                  <button
                    className={`${key === null && "cursor-not-allowed opacity-30"} rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-[165px]`}
                    disabled={key === null}
                    onClick={() => {
                      setOpenOutputModal(true);
                    }}
                  >
                    Add Output +
                  </button>
                </div>
                {outputs?.map((output: any, i: number) => (
                  <div className="mt-2 text-right">
                    <button
                      onClick={() => {
                        setViewOutput(output);
                      }}
                      className="rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-20"
                    >
                      Output {i + 1}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="flex flex-row">
              <div className="border-b border-gray-900/10 pb-6">
                <label className="block text-sm font-medium leading-6 text-gray-200">
                  Locktime
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    className={`${key === null && "cursor-not-allowed opacity-30"} border border-gray-300 block flex-1 bg-transparent py-1.5 pl-1 text-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                    disabled={key === null}
                  />
                </div>
              </div>
            </div> */}

            <div className="flex flex-row">
              <div className="border-b border-gray-900/10 pb-4">
                <div className="mt-2">
                  <button
                    className={`${key === null && "cursor-not-allowed opacity-30"}  rounded-sm shadow-sm bg-[#224242] hover:bg-[#225242] text-gray-200 text-sm py-2 px-20 mr-4`}
                    // disabled={key === null}
                    onClick={sign}
                  >
                    Sign & Broadcast
                  </button>
                  <button
                    onClick={() => {
                      saveUtxos([]);
                      saveOutputs([]);
                    }}
                    className={`${key === null && "opacity-30"} rounded-sm shadow-sm bg-[#880642] hover:bg-[#881642] text-gray-200 text-sm font-bold py-2 px-4`}
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="border-b border-gray-900/10 pb-2">
                <div className="mt-2">
                  <button
                    className="w-full flex flex-cols gap-x-4 rounded-sm shadow-sm bg-[#504227] hover:bg-[#3d372b] text-gray-200 text-sm py-2 px-36"
                    onClick={mine}
                    disabled={isMining}
                  >
                    <IconMine size={20} color="#ffffff" className="" />
                    Mine Block
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ToastContainer hideProgressBar={true} theme="dark" />

      <ImportWifModal
        isOpen={openImportWif}
        setIsOpen={setOpenImportWif}
        setKey={setKey}
        setKeyOption={setKeyOption}
        title="Mnemonic"
      />
      <InputModal
        isOpen={openInputModal}
        setIsOpen={setOpenInputModal}
        title="Input Modal"
      />
      <OutputModal
        isOpen={openOutputModal}
        setIsOpen={setOpenOutputModal}
        title="Output Modal"
      />
      <RegtestModal
        isOpen={openRegtestModal}
        setIsOpen={setOpenRegtestModal}
        title="Regtest IP"
        setNetwork={setNetwork}
        setNetworkOption={setNetworkOption}
      />
      <InputViewModal
        isOpen={viewInput !== null}
        setIsOpen={setViewInput}
        title="Input View Modal"
        utxo={viewInput!}
      />
      <OutputViewModal
        isOpen={viewOutput !== null}
        setIsOpen={setViewOutput}
        title="Output View Modal"
        output={viewOutput!}
      />
    </>
  );
}
