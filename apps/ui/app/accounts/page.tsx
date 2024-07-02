"use client";

import { useState } from "react";
import Leftbar from "../components/Leftbar";
import Network from "../components/Network";

export default function Accounts(): JSX.Element {
  const [showOptions, setShowOptions] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex overflow-hidden">
      <Leftbar active="accounts" />

      <main className="flex-1 p-4 overflow-auto">
        <Network title="Accounts" />

        <div className="flex space-x-4 mb-4">
          <button className="py-2 px-4 bg-teal-500 rounded">
            Generate Account
          </button>
          <button className="py-2 px-4 bg-teal-500 rounded">
            Import Account
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-lg font-bold mb-2">Account 1</h2>
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="py-1 px-2 bg-gray-700 rounded focus:outline-none"
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>
                {showOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-500 rounded shadow-lg">
                    <button className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-500">
                      Export Private Key
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-500">
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
                  <span>36h7rTXAxTDRfN8Kos5aEpVB3NvyBGqmbt</span>
                  <button className="text-gray-500">
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>

              <div>
                <span className="font-bold">P2WPKH</span>
              </div>

              <div className="flex flex-row gap-x-4">
                <span>
                  10 BTC{" "}
                  <span className="italic text-sm">(10,000,000 sats)</span>
                </span>
              </div>
            </div>
            <div className="grid grid-cols-5 my-2">
              <div className="col-span-3">
                <div className="flex items-center space-x-2">
                  <span>bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297</span>
                  <button className="text-gray-500">
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>

              <div>
                <span className="font-bold">P2TR</span>
              </div>

              <div className="flex flex-row gap-x-4">
                <span>
                  10 BTC{" "}
                  <span className="italic text-sm">(10,000,000 sats)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
