"use client";

import { useState } from "react";
import InputModal from "./components/InputModal";

export default function Page(): JSX.Element {
  const [openInputModal, setOpenInputModal] = useState(false);

  return (
    <>
      <main>
        <div className="w-full relative flex justify-around items-center">
          <div className="w-full flex flex-row items-center justify-center my-4 pb-4 border-b border-b-gray-700">
            <p className="text-2xl font-bold text-white">EAST PSBT Builder</p>
          </div>
        </div>

        <div className="w-full relative grid grid-cols-2 justify-center items-start mx-20">
          <div className="flex flex-cols gap-y-4">
            <p className="text-xl text-white">Preview</p>
          </div>

          <div className="flex flex-col mt-10">
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
                    className="rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-40"
                  >
                    Add Input +
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <button className="rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-20">
                    Input 1
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="border-b border-gray-900/10 pb-12">
                <label className="block text-sm font-medium leading-6 text-gray-200">
                  Output
                </label>
                <div className="mt-2">
                  <button className="rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-40">
                    Add Output +
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <button className="rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-20">
                    Output 1
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="border-b border-gray-900/10 pb-12">
                <label className="block text-sm font-medium leading-6 text-gray-200">
                  Locktime
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 ">
                  <input
                    type="number"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-2">
                  <button className="rounded-sm shadow-sm bg-[#224242] hover:bg-[#225242] text-gray-200 text-sm py-2 px-40">
                    Sign & Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <InputModal
        isOpen={openInputModal}
        setIsOpen={setOpenInputModal}
        title="Input Modal"
      />
    </>
  );
}
