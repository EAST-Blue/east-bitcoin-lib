"use client";

import Link from "next/link";
import { useConfigContext } from "../contexts/ConfigContext";
import { NetworkConfigType } from "../types/ConfigType";

const NetworkSection = () => {
  const { network, uri } = useConfigContext() as NetworkConfigType;

  return (
    <div className="flex justify-end mb-4">
      <div className="flex items-center space-x-4 bg-white-1 py-2 px-6 rounded-lg">
        <div className="flex flex-row gap-x-1">
          <span>Network</span>
          <span className="font-bold">
            {network?.charAt(0).toUpperCase() + network?.slice(1)}
          </span>
        </div>
        <div className="flex flex-row gap-x-1">
          <span>URI</span>
          <a href={uri ?? "/"} target="_blank" className="text-blue-400">
            {uri ?? "Unconfigured"}
          </a>
        </div>
        <Link href={"/config"} className="text-gray-500">
          <i className="fas fa-cog"></i>
        </Link>
      </div>
    </div>
  );
};

export default NetworkSection;
