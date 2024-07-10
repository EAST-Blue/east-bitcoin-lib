"use client";

import React, { useState } from "react";

const ImportAccountModal = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mnemonic: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Import Account</h2>
          <button
            className="text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Mnemonic Phrase</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="py-2 px-4 bg-teal-500 rounded text-white hover:bg-teal-600"
            onClick={() => {
              onSave(inputValue);
              onClose();
              setInputValue("");
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportAccountModal;
