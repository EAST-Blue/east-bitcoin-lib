"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed xl:rounded-r justify-start items-start h-full w-full sm:w-64 flex-col border-r border-white/10">
      <div className="pt-4 py-6 px-5 h-full w-full grid content-start">
        <div className="flex flex-col justify-start items-start gap-y-4">
          <button
            className={`${pathname.includes("psbt") && "font-bold bg-gray-700"} flex justify-between items-start w-full text-white p-3 cursor-default rounded-md hover:cursor-pointer hover:bg-gray-800`}
          >
            <div className="flex items-start gap-x-4">
              <p className="text-base leading-4">PSBT Builder</p>
            </div>
          </button>
          <button
            className={`${pathname.includes("webhook") && "font-bold bg-gray-700"} flex justify-between items-start w-full text-white p-3 cursor-default rounded-md hover:cursor-pointer hover:bg-gray-800`}
          >
            <div className="flex items-start gap-x-4">
              <p className="text-base leading-4">Webhook Setting</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
