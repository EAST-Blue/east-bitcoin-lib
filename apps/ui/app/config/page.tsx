"use client";

import { useEffect, useState } from "react";
import Leftbar from "../components/Leftbar";
import { useConfigContext } from "../contexts/ConfigContext";
import { NetworkConfigType } from "../types/ConfigType";
import { isValidHttpUrl } from "../utils/isValidHttpUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NetworkSection from "../components/Network";
import Select from "react-select";
import { NETWORK_MODE_OPTIONS, SelectStyles } from "../utils/constant";
import IconSave from "../icons/IconSave";

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
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      <Leftbar active="config" />

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        <NetworkSection />

        <div className="w-2/3 pr-4">
          <div className="bg-white-1 p-3 rounded-lg">
            <h2 className="text-xl font-bold">Config</h2>
          </div>
          <div className="mt-2 bg-white-1 p-3 rounded-lg">
            <form>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-white-7 font-semibold text-sm tracking-wide">
                    Mode
                  </label>
                  <Select
                    onChange={(e: any) => {
                      setNetwork(e.value);
                    }}
                    defaultValue={NETWORK_MODE_OPTIONS.find(
                      (v) => v.value === network
                    )}
                    className="cursor-pointer"
                    placeholder="Network Mode"
                    isSearchable={false}
                    styles={SelectStyles}
                    options={NETWORK_MODE_OPTIONS}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-white-7 font-semibold text-sm tracking-wide">
                    URI
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 h-[38px] border-white-1 font-medium bg-[rgba(255,255,255,0.05)] rounded-lg outline-none text-white-8 focus:outline-none focus:border-white-4 focus:ring-0 focus:ring-offset-0"
                    placeholder="https://regtest.btc.eastlayer.io"
                    value={_uri || uri || ""}
                    onChange={(e) => {
                      setUri(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-white-7 font-semibold text-sm tracking-wide">
                    Explorer
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 h-[38px] border-white-1 font-medium bg-[rgba(255,255,255,0.05)] rounded-lg outline-none text-white-8 focus:outline-none focus:border-white-4 focus:ring-0 focus:ring-offset-0"
                    placeholder="https://regtest.explorer.eastlayer.io"
                    value={_explorer || explorer || ""}
                    onChange={(e) => {
                      setExplorer(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveConfig}
                  type="button"
                  className="flex px-4 items-center py-2 disabled:cursor-not-allowed rounded-lg bg-gradient-to-b from-white-2 to-white-1 hover:from-white-1 disabled:opacity-50"
                >
                  <div>
                    <IconSave size={20} color="rgba(255,255,255,0.7)" />
                  </div>
                  <p className="pl-1 whitespace-nowrap font-semibold">Save</p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <ToastContainer hideProgressBar={true} theme="colored" />
    </div>
  );
}
