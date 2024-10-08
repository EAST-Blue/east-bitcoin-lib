import Link from "next/link";
import { LINK_TO_DOCS } from "../utils/constant";
import IconExternal from "../icons/IconExternal";

const Footer = () => {
  return (
    <div className="mt-16 p-4">
      <div className="flex flex-wrap items-center text-center md:text-left">
        <div className="w-full order-2 md:order-1 md:w-1/2 space-y-4 mt-16">
          <h1 className="text-5xl">Eastlayer</h1>
          <div>© 2024 East Blue Research Limited.</div>
        </div>
        <div className="w-full order-1 md:order-2 md:w-1/2 space-y-4 mt-16">
          <div className="flex justify-between">
            <div>
              <p>Navigation</p>
            </div>
            <div className="flex space-x-8">
              <Link
                className="flex items-center space-x-2 hover:text-main-9"
                href={LINK_TO_DOCS}
                target="_blank"
              >
                <p>Docs</p>
                <IconExternal size={20} />
              </Link>
              <Link
                className="flex items-center space-x-2 hover:text-main-9"
                href={LINK_TO_DOCS}
                target="_blank"
              >
                <p>Blog</p>
                <IconExternal size={20} />
              </Link>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p>Social</p>
            </div>
            <div className="flex space-x-8">
              <Link
                className="flex items-center space-x-2 hover:text-main-9"
                href="/satsforge"
              >
                <p>Twitter</p>
                <IconExternal size={20} />
              </Link>
              <Link
                className="flex items-center space-x-2 hover:text-main-9"
                href="/satsforge"
              >
                <p>Discord</p>
                <IconExternal size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
