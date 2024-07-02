"use client";

import { useEffect, useState } from "react";
import Leftbar from "../components/Leftbar";
import Network from "../components/Network";
import { useConfigContext } from "../contexts/ConfigContext";
import { NetworkConfigType } from "../types/ConfigType";
import { isValidHttpUrl } from "../utils/isValidHttpUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page(): JSX.Element {
  const { network, uri, explorer, fetchConfig } =
    useConfigContext() as NetworkConfigType;

  const [_network, setNetwork] = useState<string>(network);
  const [_uri, setUri] = useState<string | null>(uri);
  const [_explorer, setExplorer] = useState<string | null>(explorer);

  const toastInvalidHttp = () => {
    toast.error(<p>Invalid HTTP format</p>, { autoClose: 1500 });
  };

  const toastSaveConfig = () => {
    toast.success(<p>Config successfully saved</p>, { autoClose: 1500 });
  };

  const saveConfig = async () => {
    if (!isValidHttpUrl(_uri!)) {
      toastInvalidHttp();
      return;
    }
    if (!isValidHttpUrl(_explorer!)) {
      toastInvalidHttp();
      return;
    }

    try {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: _network,
          uri: _uri,
          explorer: _explorer,
        }),
      });

      fetchConfig();
      toastSaveConfig();
    } catch (error) {
      console.error("Error saving config : ", error);
      alert(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex overflow-hidden">
      <Leftbar active="config" />

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        <Network title="Config" />

        {/* Transaction Builder */}
        <div className="w-2/3 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Configuration</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-2">Mode</label>
              <select
                value={_network || network}
                className="w-full px-3 py-2 bg-gray-700 rounded"
                onChange={(e) => {
                  setNetwork(e.target.value);
                }}
              >
                <option defaultValue={"regtest"} value={"regtest"}>
                  Regtest
                </option>
                <option value={"testnet"}>Testnet</option>
                <option value={"mainnet"}>Mainnet</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">URI</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 rounded"
                placeholder="https://regtest.btc.eastlayer.io"
                value={_uri || uri || ""}
                onChange={(e) => {
                  setUri(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="block mb-2">Explorer</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 rounded"
                placeholder="https://regtest.explorer.eastlayer.io"
                value={_explorer || explorer || ""}
                onChange={(e) => {
                  setExplorer(e.target.value);
                }}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={saveConfig}
                type="button"
                className="w-1/4 py-2 bg-teal-500 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </main>

      <ToastContainer hideProgressBar={true} theme="colored" />
    </div>
  );
}
