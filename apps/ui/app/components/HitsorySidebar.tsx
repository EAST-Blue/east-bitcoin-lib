import Link from "next/link";
import { formatDateTime, prettyTruncate } from "../utils/prettyTruncate";
import { format } from "timeago.js";
import { useConfigContext } from "../contexts/ConfigContext";
import { NetworkConfigType } from "../types/ConfigType";

const HistorySidebar = ({ transactions }: { transactions: any }) => {
  const { explorer } = useConfigContext() as NetworkConfigType;

  return (
    <aside className="w-1/3">
      <div className="flex flex-col h-full">
        <div className="bg-white-1 p-3 rounded-lg">
          <h2 className="text-xl font-bold">History</h2>
        </div>
        <div className="flex-1 max-h-96 mt-2 items-stretch bg-white-1 p-3 rounded-lg overflow-y-auto">
          <div className="flex font-semibold text-white-7 items-center justify-between">
            <div className="w-5/12">
              <p>TxID</p>
            </div>
            <div className="w-4/12">
              <p>Time</p>
            </div>
            <div className="w-3/12">
              <p>Actions</p>
            </div>
          </div>
          <ul className="space-y-2">
            {transactions.length === 0 && (
              <div className="flex items-center justify-center">
                <p className="text-white-3 text-lg p-4 font-semibold">
                  No Transactions
                </p>
              </div>
            )}
            {transactions.map((transaction: any, i: number) => (
              <div key={i} className="flex space-x-4 items-center py-2 rounded">
                <div className="w-5/12">
                  <span className="font-code font-semibold">
                    {prettyTruncate(transaction.txid, 10, "address")}
                  </span>
                </div>
                <div className="w-4/12">
                  <div className="text-sm text-white-7">
                    {formatDateTime(transaction.createdAt)}
                  </div>
                </div>
                <div className="w-3/12">
                  <button className="text-blue-400 p-1">
                    <i className="fas fa-sync-alt"></i>
                  </button>
                  <Link
                    href={`${explorer}/tx/${transaction.txid}`}
                    target="_blank"
                    className="text-blue-400 p-1"
                  >
                    <i className="fa-regular fa-share-from-square"></i>
                  </Link>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default HistorySidebar;
