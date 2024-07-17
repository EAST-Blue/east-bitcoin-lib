"use client";

import React, { useEffect, useRef } from "react";
import ButtonCopy from "./ButtonCopy";
import { copyToClipboard } from "../utils/copyToClipboard";

export default function ExportPrivateKeyModal({
  isOpen,
  onClose,
  privateKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  privateKey: string;
}): JSX.Element {
  if (!isOpen) return <></>;
  console.log(privateKey);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#262626] p-6 rounded-lg w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Export Private Key</h2>
          <button
            className="text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">
            WIF Text (Private key)
          </label>
          <textarea
            readOnly
            value={privateKey}
            className="w-full h-[150px] border border-gray-700 font-medium bg-[rgba(255,255,255,0.05)] rounded-lg outline-none text-white p-2 overflow-auto"
          />
        </div>

        <div className="flex justify-end gap-x-2">
          <ButtonCopy onClick={() => copyToClipboard(privateKey)} />
          <button
            className="flex px-4 items-center py-2 disabled:cursor-not-allowed rounded-lg bg-gradient-to-b from-white-2 to-white-1 hover:from-white-1 disabled:opacity-50"
            onClick={() => {
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
