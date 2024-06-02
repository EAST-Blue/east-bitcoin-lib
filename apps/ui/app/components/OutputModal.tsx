"use client";

import { useEffect, useRef, useState } from "react";
import "prism-code-editor/prism/languages/nasm";
import "prism-code-editor/layout.css";
import "prism-code-editor/scrollbar.css";
// import "prism-code-editor/themes/vs-code-dark.css";
import "../prism-style.css";
import "prism-code-editor/languages/asm";
import { PrismEditor, createEditor } from "prism-code-editor";

const OutputModal = ({
  isOpen,
  setIsOpen,
  title = "",
}: {
  isOpen: any;
  setIsOpen: any;
  title: string;
}) => {
  const [type, setType] = useState("nonstandard");

  const divRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<PrismEditor>();

  useEffect(() => {
    const editor = (editorRef.current = createEditor(divRef.current!, {
      value: "",
      language: "nasm",
      tabSize: 2,
      insertSpaces: false,
      lineNumbers: false,
      wordWrap: true,
    }));
    import("../psbt/extension").then((module) => module.addExtensions(editor));

    return editor.remove;
  }, []);

  return (
    <div
      onClick={() => setIsOpen(false)}
      className={`fixed inset-0 ${isOpen ? "z-50" : "delay-500 -z-10"}`}
    >
      <div
        className={`absolute inset-0 overflow-auto pb-16 bg-black bg-opacity-80 p-6 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex h-full items-center justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md mx-auto bg-[#0F111B] rounded-lg text-gray-200 overflow-hidden border border-gray-800"
          >
            <div className="w-full p-4 flex items-center justify-between gap-x-[300px] bg-[#0F111B]">
              <p className="text-title text-xl font-bold tracking-wide">
                {title}
              </p>
              <div
                className="w-5 cursor-pointer hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 66 66"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.99987 0.000111535C8.23224 0.000111535 7.46377 0.292518 6.87877 0.879018L0.878774 6.87902C-0.294227 8.05202 -0.294227 9.95121 0.878774 11.1212L22.7577 33.0001L0.878774 54.879C-0.294227 56.052 -0.294227 57.9512 0.878774 59.1212L6.87877 65.1212C8.05177 66.2942 9.95096 66.2942 11.121 65.1212L32.9999 43.2423L54.8788 65.1212C56.0488 66.2942 57.951 66.2942 59.121 65.1212L65.121 59.1212C66.294 57.9482 66.294 56.049 65.121 54.879L43.2421 33.0001L65.121 11.1212C66.294 9.95121 66.294 8.04902 65.121 6.87902L59.121 0.879018C57.948 -0.293982 56.0488 -0.293982 54.8788 0.879018L32.9999 22.7579L11.121 0.879018C10.5345 0.292518 9.76749 0.000111535 8.99987 0.000111535Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col p-4">
              <div className="flex flex-row">
                <div className="w-full  my-2">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    Address Type:
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-11/12 bg-[#0F111B] hover:bg-[#0F171B] rounded-md text-sm hover:cursor-pointer"
                  >
                    <option value={"nonstandard"}>Nonstandard</option>
                    <option value={"p2pkh"}>
                      P2PKH (Pay to Public Key Hash)
                    </option>
                    <option value={"p2wpkh"}>
                      P2WPKH (Pay to Witness Public Key Hash)
                    </option>
                    <option value={"p2tr"}>P2TR (Pay to Taproot)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="w-full my-2">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    value (sats):
                  </label>
                  <input className="bg-transparent rounded-md text-sm border-gray-700" />
                </div>
              </div>
              {type === "p2pkh" && (
                <div className="flex flex-row">
                  <div className="w-full my-2">
                    <label className="block text-sm font-medium leading-6 text-gray-200">
                      public key (hex):
                    </label>
                    <textarea className="w-full bg-transparent rounded-md text-sm border-gray-700" />
                  </div>
                </div>
              )}
              {type === "p2wpkh" && (
                <div className="flex flex-row">
                  <div className="w-full my-2">
                    <label className="block text-sm font-medium leading-6 text-gray-200">
                      public key (hex):
                    </label>
                    <textarea className="w-full bg-transparent rounded-md text-sm border-gray-700" />
                  </div>
                </div>
              )}

              <div className="flex flex-row">
                <div className="w-full my-2">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    locking script (asm):
                  </label>
                  <div
                    ref={divRef}
                    className="rounded-sm border border-gray-700 overflow-auto break-words"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputModal;
