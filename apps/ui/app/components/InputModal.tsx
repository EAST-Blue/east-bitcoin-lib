"use client";

import { useState } from "react";

const InputModal = ({
  isOpen,
  setIsOpen,
  title = "",
}: {
  isOpen: any;
  setIsOpen: any;
  title: string;
}) => {
  const [isShowUtxo, setIsShowUtxo] = useState(false);

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
            <div className="p-4 flex items-center justify-between gap-x-52 bg-[#0F111B]">
              <div>
                <p className="text-title text-xl font-bold tracking-wide">
                  {title}
                </p>
              </div>
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
                <div className="w-full border-b border-gray-900/10 pb-12">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    Choose UTXO :
                  </label>

                  <button className="w-full flex flex-row justify-end items-end rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm p-2">
                    <svg
                      className="-mr-1 h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="absolute bottom-50 z-10 mt-2 w-5/6 origin-top-right rounded-md bg-[#222842] shadow-lg border border-gray-700">
                <div className="py-1" role="none">
                  <p className="text-gray-200 block px-4 py-2 text-sm">
                    Account settings
                  </p>
                </div>
                <div className="py-1" role="none">
                  <p className="text-gray-200 block px-4 py-2 text-sm">
                    Account settings
                  </p>
                </div>
                <div className="py-1" role="none">
                  <p className="text-gray-200 block px-4 py-2 text-sm">
                    Account settings
                  </p>
                </div>
                <div className="py-1" role="none">
                  <p className="text-gray-200 block px-4 py-2 text-sm">
                    Account settings
                  </p>
                </div>
                <div className="py-1" role="none">
                  <p className="text-gray-200 block px-4 py-2 text-sm">
                    Account settings
                  </p>
                </div>
                <div className="py-1" role="none">
                  <p className="text-gray-200 block px-4 py-2 text-sm">
                    Account settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
