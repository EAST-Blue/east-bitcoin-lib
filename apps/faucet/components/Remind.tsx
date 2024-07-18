import Link from "next/link";
import IconExternal from "../icons/IconExternal";
import Image from "next/image";
import { LINK_TO_DOCS, LINK_TO_GIT } from "../utils/constant";

const Remind = () => {
  return (
    <div className="my-32 p-4 mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center">
        <div className="w-full md:w-1/3 p-4 flex justify-center">
          <Image
            alt="build with eastlayer stacks"
            src="/assets/remind.svg"
            width={300}
            height={300}
          />
        </div>
        <div className="w-full md:w-2/3 space-y-8 pl-0 md:pl-8">
          <h3 className="text-4xl">Start building with Eastlayer</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <p>
                Eastlayer offers a powerful development environment for building
                on Bitcoin.
              </p>
              <p>
                Design transactions, integrate custom logic, and construct
                virtual states seamlessly.
              </p>
            </div>
            <div className="flex space-x-8">
              <Link
                href={LINK_TO_DOCS}
                target="_blank"
                className="inline-block"
              >
                <div className="flex flex-grow-0 items-center space-x-1 text-main-8 hover:text-main-9">
                  <p className="font-semibold">Read Docs</p>
                  <IconExternal size={20} />
                </div>
              </Link>
              <Link href={LINK_TO_GIT} target="_blank" className="inline-block">
                <div className="flex flex-grow-0 items-center space-x-1 text-main-8 hover:text-main-9">
                  <p className="font-semibold">Visit Github</p>
                  <IconExternal size={20} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Remind;
