import Link from "next/link";

const Leftbar = ({ active }: { active: string }) => {
  return (
    <aside className="w-1/6 bg-gray-800 p-4">
      <div className="text-2xl font-bold mb-4">Satforge</div>
      <nav className="flex flex-col space-y-2">
        <Link
          href={"/"}
          className={`${active === "transaction" && "bg-gray-700 rounded"} w-full text-left py-2 px-4`}
        >
          Transactions
        </Link>
        <Link
          href={"/accounts"}
          className={`${active === "accounts" && "bg-gray-700 rounded"} w-full text-left py-2 px-4`}
        >
          Accounts
        </Link>

        <Link
          href={"/config"}
          className={`${active === "config" && "bg-gray-700 rounded"} w-full text-left py-2 px-4`}
        >
          Config
        </Link>
        <Link
          href={"/"}
          className={`${active === "utils" && "bg-gray-700 rounded"} w-full text-left py-2 px-4`}
        >
          Utils
        </Link>
      </nav>
    </aside>
  );
};

export default Leftbar;
