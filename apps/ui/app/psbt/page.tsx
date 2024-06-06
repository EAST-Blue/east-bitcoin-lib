"use client";

import { useEffect, useRef, useState } from "react";
import InputModal from "../components/InputModal";
import Sidebar from "../components/Sidebar";
import { usePsbtContext } from "../contexts/PsbtContext";
import { useKeyContext } from "../contexts/KeyContext";
import ImportWifModal from "../components/ImportWifModal";

import OutputModal from "../components/OutputModal";
import { KeyOptionEnum } from "../enums/KeyOptionEnum";
import {
  API,
  Address,
  BElectrsAPI,
  OrdAPI,
  PSBT,
  Wallet,
} from "@east-bitcoin-lib/sdk";
import { useNetworkContext } from "../contexts/NetworkContext";
import RegtestModal from "../components/RegtestModal";
import { NetworkEnum } from "../enums/NetworkEnum";
import { useInputContext } from "../contexts/InputContext";
import InputViewModal from "../components/InputViewModal";

export default function Page(): JSX.Element {
  // const { utxos, output, clear } = usePsbtContext() as any;
  const { key, keyOption, setKey, setKeyOption } = useKeyContext() as any;
  const { network, networkOption, setNetwork, setNetworkOption } =
    useNetworkContext() as any;
  const { utxos, setUtxos } = useInputContext() as any;

  const [openInputModal, setOpenInputModal] = useState(false);
  const [openOutputModal, setOpenOutputModal] = useState(false);
  const [openImportWif, setOpenImportWif] = useState(false);
  const [openRegtestModal, setOpenRegtestModal] = useState(false);
  const [openInputViewModal, setOpenInputViewModal] = useState(null);

  const sign = async () => {
    if (network === null) return;
    if (key === null) return;

    const bitcoinApi = new BElectrsAPI({
      network: "regtest",
      apiUrl: {
        regtest: network,
      },
    });
    const api = new API({
      network: "regtest",
      bitcoin: bitcoinApi,
      ord: new OrdAPI({ network: "regtest" }),
    });

    const wallet = new Wallet({
      network: networkOption,
      mnemonic: key,
    });
    const index = 0;

    const p2pkh = wallet.p2pkh(index);
    const p2wpkh = wallet.p2wpkh(index);
    const p2tr = wallet.p2tr(index);

    const p = new PSBT({
      network: "regtest",
      inputs: [],
      outputs: [
        {
          output: Address.fromString(p2tr.address),
          value: 0.5 * 10 ** 8,
        },
      ],
      feeRate: 1,
      changeOutput: Address.fromString(p2pkh.address),
      utxoSelect: {
        api,
        address: Address.fromString(p2tr.address),
        pubkey: p2tr.keypair.publicKey,
      },
    });

    await p.build();
    const psbt = p.toPSBT();
    psbt.signAllInputs(p2tr.keypair);
    const hex = psbt.finalizeAllInputs().extractTransaction().toHex();
    console.log({ hex });
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
              className={`${network === null && "opacity-30"} flex flex-row gap-x-4`}
            >
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-2">
                  <button
                    className={`${keyOption === KeyOptionEnum.ALICE && "border-2 border-gray-300"} rounded-sm shadow-sm bg-[#874642] hover:bg-[#873642] text-gray-200 text-sm py-2 px-4`}
                    onClick={() => {
                      setKey(
                        "final chat okay post increase install picnic library modify legend soap cube"
                      );
                      setKeyOption(KeyOptionEnum.ALICE);
                    }}
                    disabled={network === null}
                  >
                    Alice Key
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-2">
                  <button
                    className={`${keyOption === KeyOptionEnum.BOB && "border-2 border-gray-300"} rounded-sm shadow-sm bg-[#874642] hover:bg-[#873642] text-gray-200 text-sm py-2 px-4`}
                    onClick={() => {
                      setKey(
                        "argue liar sauce arrange worry bulb festival alien concert target pen speak"
                      );
                      setKeyOption(KeyOptionEnum.BOB);
                    }}
                    disabled={network === null}
                  >
                    Bob Key
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-900/10 pb-12">
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
                    className={`${key === null && "cursor-not-allowed opacity-30"} rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-40`}
                    disabled={key === null}
                  >
                    Add Input +
                  </button>
                </div>
                {utxos?.map((utxo: any, i: number) => (
                  <div className="mt-2 text-right">
                    <button
                      onClick={() => {
                        setOpenInputViewModal(utxo);
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
                    className={`${key === null && "cursor-not-allowed opacity-30"} rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-40`}
                    disabled={key === null}
                    onClick={() => {
                      setOpenOutputModal(true);
                    }}
                  >
                    Add Output +
                  </button>
                </div>
                {/* {output.map((utxo: any, i: number) => (
                  <div className="mt-2 text-right">
                    <button className="rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-20">
                      Output {i + 1}
                    </button>
                  </div>
                ))} */}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="border-b border-gray-900/10 pb-12">
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
            </div>
            <div className="flex flex-row">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-2">
                  <button
                    className={`${key === null && "cursor-not-allowed opacity-30"}  rounded-sm shadow-sm bg-[#224242] hover:bg-[#225242] text-gray-200 text-sm py-2 px-20 mr-4`}
                    disabled={key === null}
                    onClick={sign}
                  >
                    Sign & Generate
                  </button>
                  <button
                    onClick={() => {
                      setKey(null);
                      setKeyOption(null);
                    }}
                    className={`${key === null && "opacity-30"} rounded-sm shadow-sm bg-[#880642] hover:bg-[#881642] text-gray-200 text-sm font-bold py-2 px-4`}
                    disabled={key === null}
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
        utxos={utxos}
        setUtxos={setUtxos}
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
        isOpen={openInputModal !== null}
        setIsOpen={setOpenInputViewModal}
        title="Input View Modal"
        utxo={openInputViewModal}
      />
    </>
  );
}