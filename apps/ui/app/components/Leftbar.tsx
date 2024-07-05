import Link from "next/link";
import { ReactNode } from "react";

// /* Rectangle 42 */

// box-sizing: border-box;

// position: absolute;
// width: 154px;
// height: 30px;
// left: 13px;
// top: 64px;

// background: rgba(255, 255, 255, 0.1);
// box-shadow: inset 0px 0px 10px rgba(255, 255, 255, 0.1);
// border-radius: 8px;

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
      }
            w-full text-left py-2 px-4`}
    >
      {children}
    </Link>
  );
};

const Leftbar = ({ active }: { active: string }) => {
  return (
    <aside className="w-[200px] bg-white bg-opacity-10 p-4 rounded-r-lg">
      <div className="text-2xl font-bold mb-6">Satforge</div>
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

        <NavLink active={active} name="utils" href="/utils">
          Utils
        </NavLink>
      </nav>
    </aside>
  );
};

export default Leftbar;
