import Link from "next/link";
import IconArrowDown from "../icons/IconExpandDown";
import IconExternal from "../icons/IconExternal";
import { LINK_TO_DOCS } from "../utils/constant";

const Navbar = () => {
  return (
    <div className="h-[64px]">
      <div className="fixed top-0 z-10 left-0 right-0 bg-main-0">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
          <div className="flex space-x-2 items-center">
            <Link href="/">
              <div className="font-title text-main-9 text-2xl font-bold">
                RegNet by Eastlayer
              </div>
            </Link>
            <div className="px-2 py-1 bg-main-1 rounded-xl">
              <h4 className="text-xs">ALPHA</h4>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative group/build z-20 bg-main-0">
              <div className="flex items-center space-x-1 cursor-pointer group-hover/build:bg-main-9 group-hover/build:text-main-0 rounded-xl px-2 lg:px-4 py-1">
                <p className="font-semibold">Build</p>
                <IconArrowDown size={20} />
              </div>
              <div className="group/build group-hover/build:translate-y-0 -translate-y-[150%] absolute pt-4">
                <div className="border-2 border-main-1 rounded-lg flex flex-col w-40 bg-main-0">
                  <Link href="/smart-index">
                    <p className="text-main-8 hover:text-main-9 hover:bg-main-1 p-2">
                      Smart Index
                    </p>
                  </Link>
                  <Link href="/bitcoin-regnet">
                    <p className="text-main-8 hover:text-main-9 hover:bg-main-1 p-2">
                      Bitcoin Regnet
                    </p>
                  </Link>
                  <Link href="/satsforge">
                    <p className="text-main-8 hover:text-main-9 hover:bg-main-1 p-2">
                      Satsforge
                    </p>
                  </Link>
                </div>
              </div>
            </div>
            <Link href={LINK_TO_DOCS} target="_blank">
              <div className="flex items-center space-x-1 hover:bg-main-9 hover:text-main-0 rounded-xl px-2 lg:px-4 py-1">
                <p className="font-semibold">Docs</p>
                <IconExternal size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
