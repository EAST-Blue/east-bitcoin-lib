"use client";

import { useState } from "react";
import InputModal from "./components/InputModal";
import Sidebar from "./components/Sidebar";
import Leftbar from "./components/Leftbar";
import Network from "./components/Network";

export default function Page(): JSX.Element {
  const [openInputModal, setOpenInputModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex overflow-hidden">
      <Leftbar active="transaction" />

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        <Network title="Transactions" />

        {/* Transaction Builder */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Transaction Builder</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-2">Signer</label>
              <select className="w-full px-3 py-2 bg-gray-700 rounded">
                <option>Select Account</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Input</label>
              <select className="w-full px-3 py-2 bg-gray-700 rounded">
                <option>Select Input</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Output</label>
              <select className="w-full px-3 py-2 bg-gray-700 rounded">
                <option>Address/Script</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Input Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Amount</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
            </div>
            <div className="flex space-x-2">
              <button type="button" className="w-full py-2 bg-teal-500 rounded">
                Sign Transaction
              </button>
              <button type="button" className="w-full py-2 bg-teal-500 rounded">
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
