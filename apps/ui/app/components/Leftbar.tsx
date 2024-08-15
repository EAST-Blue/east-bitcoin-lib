import { useState, ReactNode } from "react";
import Link from "next/link";

const NavLink = ({
  active,
  name,
  href,
  children,
}: {
  active: string;
  name: string;
  href: string;
  children: ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={`${
        active === name
          ? "bg-white text-opacity-100 text-black rounded-lg"
          : "text-white text-opacity-60 hover:bg-white hover:bg-opacity-10 hover:text-opacity-100 hover:rounded-lg"
      } w-full text-left py-2 px-4`}
    >
      {children}
    </Link>
  );
};

const Leftbar = ({ active }: { active: string }) => {
  const [isUtilsCollapsed, setIsUtilsCollapsed] = useState(true);

  const toggleUtils = () => {
    setIsUtilsCollapsed(!isUtilsCollapsed);
  };

  return (
    <aside className="w-[200px] bg-white bg-opacity-10 p-4 rounded-r-lg">
      <div className="text-2xl font-bold mb-6">Satsforge</div>
      <nav className="flex flex-col space-y-2 font-semibold">
        <NavLink active={active} name="transaction" href="/">
          Transactions
        </NavLink>

        <NavLink active={active} name="accounts" href="/accounts">
          Accounts
        </NavLink>

        <NavLink active={active} name="config" href="/config">
          Config
        </NavLink>

        <div className="flex flex-col space-y-2">
          <button
            onClick={toggleUtils}
            className="flex flex-row justify-between text-left text-white text-opacity-60 hover:bg-white hover:bg-opacity-10 hover:text-opacity-100 hover:rounded-lg w-full py-2 px-4"
          >
            <p>Utils</p>
            <i className="fa-solid fa-sort-down"></i>
          </button>
          {!isUtilsCollapsed && (
            <div className="ml-4 flex flex-col space-y-2 text-sm">
              <NavLink active={active} name="tapscript" href="/utils/tapscript">
                Tapscript
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Leftbar;
