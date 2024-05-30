"use client";

import { useState } from "react";
import InputModal from "../components/InputModal";
import Sidebar from "../components/Sidebar";
import { usePsbtContext } from "../contexts/PsbtContext";
import { useKeyContext } from "../contexts/KeyContext";
import ImportWifModal from "../components/ImportWifModal";

export default function Page(): JSX.Element {
  const [openInputModal, setOpenInputModal] = useState(false);
  const [openImportWif, setOpenImportWif] = useState(false);
  const { utxos, output, clear } = usePsbtContext() as any;
  const { key, setKey } = useKeyContext() as any;

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
            {/* Key  */}
            <label className="block text-sm font-medium leading-6 text-gray-200">
              Choose your key
            </label>
            <div className="flex flex-row gap-x-4 ">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-2">
                  <button className="rounded-sm shadow-sm bg-[#874642] hover:bg-[#873642] text-gray-200 text-sm py-2 px-4">
                    Alice Key
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-2">
                  <button className="rounded-sm shadow-sm bg-[#874642] hover:bg-[#873642] text-gray-200 text-sm py-2 px-4">
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
                    className="rounded-sm shadow-sm bg-[#874642] hover:bg-[#873642] text-gray-200 text-sm py-2 px-4"
                  >
                    Import WIF Text
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
                {utxos.map((utxo: any, i: number) => (
                  <div className="mt-2 text-right">
                    <button className="rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-20">
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
                  >
                    Add Output +
                  </button>
                </div>
                {output.map((utxo: any, i: number) => (
                  <div className="mt-2 text-right">
                    <button className="rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-20">
                      Output {i + 1}
                    </button>
                  </div>
                ))}
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
                    className={`${key === null && "cursor-not-allowed opacity-30"}  rounded-sm shadow-sm bg-[#224242] hover:bg-[#225242] text-gray-200 text-sm py-2 px-40`}
                    disabled={key === null}
                  >
                    Sign & Generate
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
        title="Import WIF"
      />
      <InputModal
        isOpen={openInputModal}
        setIsOpen={setOpenInputModal}
        title="Input Modal"
      />
    </>
  );
}
