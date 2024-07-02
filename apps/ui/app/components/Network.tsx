import Link from "next/link";
import { useConfigContext } from "../contexts/ConfigContext";
import { NetworkConfigType } from "../types/ConfigType";

const Network = ({ title }: { title: string }) => {
  const { network, uri } = useConfigContext() as NetworkConfigType;

  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4 bg-gray-800 py-2 px-6">
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
          <Link href={"/config"} className="text-gray-500">
            <i className="fas fa-cog"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Network;
