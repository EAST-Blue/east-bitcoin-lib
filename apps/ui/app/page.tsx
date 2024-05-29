"use client";

import { useState } from "react";
import InputModal from "./components/InputModal";
import Sidebar from "./components/Sidebar";

export default function Page(): JSX.Element {
  const [openInputModal, setOpenInputModal] = useState(false);

  return (
    <>
      <div className="w-full relative flex justify-around items-center">
        <div className="w-full flex flex-row items-center justify-center my-4 pb-4 border-b border-b-gray-700">
          <p className="text-2xl font-bold text-white">EAST PSBT Builder</p>
        </div>
      </div>

      <Sidebar />
      <main className="pl-64 grid grid-flow-col"></main>

      <InputModal
        isOpen={openInputModal}
        setIsOpen={setOpenInputModal}
        title="Input Modal"
      />
    </>
  );
}
