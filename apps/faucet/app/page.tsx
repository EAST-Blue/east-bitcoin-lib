"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Remind from "@/components/Remind";
import IconBroadcast from "@/icons/IconBroadcast";
import IconLighting from "@/icons/IconLighting";
import IconWallet from "@/icons/IconWallet";
import { prettyTruncate } from "@/utils/prettyTruncate";
import { RegboxAPI } from "@east-bitcoin-lib/sdk";
import { useEffect, useState } from "react";
import { format, render, cancel, register } from "timeago.js";

export const openTwitterShare = () => {
  var shareURL = `http://twitter.com/intent/tweet?text=Requesting 0.1 rBTC from RegNet Faucet by Eastlayer&url=https://faucet.regnet.eastlayer.io`;

  const width = 600;
  const height = 400;

  var top = window.screen.height - height;
  top = top > 0 ? top / 2 : 0;

  var left = window.screen.width - width;
  left = left > 0 ? left / 2 : 0;

  window.open(
    shareURL,
    "",
    `left=${left},top=${top},width=${width},height=${height},personalbar=0,toolbar=0,scrollbars=0,resizable=0`
  );
};

const latestHistory = [0, 0, 0, 0, 0, 0, 0, 0, 0];

export default function Home() {
  const [histories, setHistories] = useState([]);
  const [address, setAddress] = useState("");
  const [hasTweet, setHasTweet] = useState(false);

  const fetchHistories = async () => {
    const response = await fetch("/api/history", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Error fetching histories data`);
    }

    const _histories = await response.json();
    setHistories(_histories);
  };

  const onFaucet = async () => {
    const regboxApi = new RegboxAPI({
      url: "https://regbox.regnet.btc.eastlayer.io",
    });

    regboxApi.getFaucet(address, 0.01);

    await regboxApi.generateBlock(1);
    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    setAddress("");
    setHasTweet(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      fetchHistories();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <main className="max-w-6xl mx-auto">
      <Navbar />
      <div className="py-16 bg-main-1 m-4 rounded-xl">
        <div className="lg:p-4 flex flex-wrap">
          <div className="w-full p-4 lg:w-3/5">
            <h2 className="text-6xl max-w-xl">
              Request rBTC for Bitcoin RegNet
            </h2>
            <p className="mt-4 text-xl">
              The fastest Bitcoin public testnet by Eastlayer
            </p>
            <p className="mt-2 text-xl">
              Enter your wallet address and tweet about it to get started
            </p>
            <div className="flex items-center mt-4">
              <div className="relative py-4">
                <div className="text-main-7 p-1 rounded-full border-2 relative z-10 bg-main-1">
                  <IconWallet size={24} />
                </div>
                <div className="absolute top-1/2 bottom-0 left-0 right-0 flex justify-center">
                  <div className="w-1 h-full bg-main-7"></div>
                </div>
              </div>
              <div className="flex flex-col grow pl-4">
                <div className="w-full flex flex-wrap">
                  <input
                    placeholder="Enter Bitcoin Address"
                    type="text"
                    className="w-full bg-main-2 py-2 px-3 outline-none rounded-xl"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div
              className={`flex items-center ${address == "" && "opacity-50 pointer-events-none"}`}
            >
              <div className="relative py-4">
                <div className="text-main-7 p-1 rounded-full border-2 relative z-10 bg-main-1">
                  <IconBroadcast size={24} />
                </div>
                <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center">
                  <div className="w-1 h-full bg-main-7"></div>
                </div>
              </div>
              <div className="flex flex-col grow pl-4">
                <div className="w-full flex items-center flex-wrap">
                  <p className="text-lg w-1/2">Share your tweet</p>
                  <button
                    onClick={() => {
                      openTwitterShare();
                      setHasTweet(true);
                    }}
                    className="w-1/2 bg-gradient-to-b from-main-3 to-main-1 hover:from-main-2 hover:to-main-1 hover:text-main-9 px-6 py-2 rounded-xl font-bold font-title text-main-8 tracking-wide transition-all"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`flex items-center ${(hasTweet == false || address == "") && "opacity-50  pointer-events-none"}`}
            >
              <div className="relative py-4">
                <div className="text-main-7 p-1 rounded-full border-2 relative z-10 bg-main-1">
                  <IconLighting size={24} />
                </div>
                <div className="absolute top-0 bottom-1/2 left-0 right-0 flex justify-center">
                  <div className="w-1 h-full bg-main-7"></div>
                </div>
              </div>
              <div className="flex flex-col grow pl-4">
                <div className="w-full flex items-center flex-wrap">
                  <p className="text-lg w-1/2">Submit request</p>
                  <button
                    onClick={() => onFaucet()}
                    className="w-1/2 bg-gradient-to-b from-main-3 to-main-1 hover:from-main-2 hover:to-main-1 hover:text-main-9 px-6 py-2 rounded-xl font-bold font-title text-main-8 tracking-wide transition-all"
                  >
                    Request rBTC
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 w-full lg:w-2/5 space-y-4">
            <h4 className="text-2xl">History</h4>
            {histories.map((x: any) => {
              return (
                <div className="flex justify-between">
                  <p>
                    <a
                      href={`https://explorer.regnet.btc.eastlayer.io/address/${x.address}`}
                      target="_blank"
                      className="font-code font-bold text-main-8 hover:underline"
                    >
                      {prettyTruncate(x.address, 10, "address")}
                    </a>{" "}
                    received{" "}
                    <span className="font-code font-bold text-main-8">
                      0.01 rBTC
                    </span>
                  </p>
                  <p className="text-sm">{format(x.createdAt)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Remind />
      <Footer />
    </main>
  );
}
