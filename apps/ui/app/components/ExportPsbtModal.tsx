"use client";

import React from "react";
import ButtonCopy from "./ButtonCopy";
import { copyToClipboard } from "../utils/copyToClipboard";

const ExportPsbtModal = ({
  isOpen,
  onClose,
  base64,
}: {
  isOpen: boolean;
  onClose: () => void;
  base64: string;
}) => {
  if (!isOpen) return null;
  if (base64 === "") return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#262626] p-6 rounded-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Export PSBT</h2>
          <button
            className="text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">PSBT Base64</label>
          <textarea
            rows={4}
            className="w-full px-3 border-white-1 font-medium bg-[rgba(255,255,255,0.05)] rounded-lg outline-none text-white-8 focus:outline-none focus:border-white-4 focus:ring-0 focus:ring-offset-0"
            value={base64}
          />
        </div>
        <div className="flex justify-end gap-x-2">
          <ButtonCopy onClick={() => copyToClipboard(base64)} />
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
};

export default ExportPsbtModal;
