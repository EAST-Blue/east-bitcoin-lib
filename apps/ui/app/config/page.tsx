"use client";

import Leftbar from "../components/Leftbar";
import Network from "../components/Network";

export default function Page(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex overflow-hidden">
      <Leftbar active="config" />

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        <Network title="Config"/>

        {/* Transaction Builder */}
        <div className="w-2/3 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Configuration</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-2">Mode</label>
              <select className="w-full px-3 py-2 bg-gray-700 rounded">
                <option>-- Select Network Mode --</option>
                <option>Regtest</option>
                <option>Testnet</option>
                <option>Mainnet</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">URI</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Explorer</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
            </div>
            <div className="flex space-x-2">
              <button type="button" className="w-1/4 py-2 bg-teal-500 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
