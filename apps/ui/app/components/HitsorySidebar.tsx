import Link from "next/link";
import { prettyTruncate } from "../utils/prettyTruncate";
import { format } from "timeago.js";
import { useConfigContext } from "../contexts/ConfigContext";
import { NetworkConfigType } from "../types/ConfigType";

const HistorySidebar = ({ transactions }: { transactions: any }) => {
  const { explorer } = useConfigContext() as NetworkConfigType;

  return (
    <aside className="w-1/4 bg-gray-800 p-4 overflow-y-auto h-screen">
      <h2 className="text-lg font-bold mb-4">History</h2>
      <ul className="space-y-2">
        {transactions.map((transaction: any, i: number) => (
          <div
            key={i}
            className="flex space-x-4 justify-between items-center bg-gray-700 px-4 py-2 rounded"
          >
            <span>{prettyTruncate(transaction.txid, 12, "address")}</span>
            <span className="text-sm text-gray-400">
              {format(transaction.createdAt)}
            </span>
            {/* <button className="text-blue-400">
              <i className="fas fa-sync-alt"></i>
            </button> */}
            <Link
              href={`${explorer}/tx/${transaction.txid}`}
              target="_blank"
              className="text-blue-400"
            >
              <i className="fa-regular fa-share-from-square"></i>
            </Link>
          </div>
        ))}
      </ul>
    </aside>
  );
};

export default HistorySidebar;
