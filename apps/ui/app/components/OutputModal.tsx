"use client";

import { useEffect, useRef, useState } from "react";
import "prism-code-editor/prism/languages/nasm";
import "prism-code-editor/layout.css";
import "prism-code-editor/scrollbar.css";
// import "prism-code-editor/themes/vs-code-dark.css";
import "../prism-style.css";
import "prism-code-editor/languages/asm";
import { PrismEditor, createEditor } from "prism-code-editor";
import { useOutputContext } from "../contexts/OutputContext";
import { OutputContextType } from "../types/OutputContextType";

const OutputModal = ({
  isOpen,
  setIsOpen,
  title = "",
}: {
  isOpen: any;
  setIsOpen: any;
  title: string;
}) => {
  const { saveOutputs } = useOutputContext() as OutputContextType;

  const [addressType, setAddressType] = useState<string>("nonstandard");
  const [pubkey, setPubkey] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [outputType, setOutputType] = useState<string>("address");

  const scriptRef = useRef<HTMLDivElement>(null);
  const scriptEditorRef = useRef<PrismEditor>();

  useEffect(() => {
    const editor = (scriptEditorRef.current = createEditor(scriptRef.current!, {
      value: "",
      language: "nasm",
      tabSize: 2,
      insertSpaces: false,
      lineNumbers: false,
      wordWrap: true,
    }));
    import("../psbt/extension").then((module) => module.addExtensions(editor));

    return editor.remove;
  }, [outputType]);

  const onSave = () => {
    if (outputType === "address" && value <= 0) return;
    if (outputType === "address" && pubkey === "") return;
    if (outputType === "script" && !scriptEditorRef.current?.value) return;

    if (outputType === "address") {
      saveOutputs([{ address: pubkey, value }]);
    } else {
      saveOutputs([{ script: scriptEditorRef.current?.value, value }]);
    }

    setValue(0);
    setPubkey("");
    setIsOpen(false);
  };

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
              <div className="flex flex-col">
                <div className="w-full my-2">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    Output Type:
                  </label>
                  <div className="w-full flex flex-row gap-x-2">
                    <button
                      onClick={() => {
                        setOutputType("address");
                      }}
                      className={`${outputType === "address" && "border border-white"} rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-10`}
                    >
                      Address
                    </button>
                    <button
                      onClick={() => {
                        setOutputType("script");
                      }}
                      className={`${outputType === "script" && "border border-white"} rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-10`}
                    >
                      Custom Script
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="w-full my-2">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    value (sats):
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value))}
                    className="bg-transparent rounded-md text-sm border-gray-700"
                  />
                </div>
              </div>

              {outputType === "script" && (
                <>
                  <div className="flex flex-row">
                    <div className="w-full my-2">
                      <label className="block text-sm font-medium leading-6 text-gray-200">
                        custom script (asm):
                      </label>
                      <div
                        ref={scriptRef}
                        className="w-full rounded-sm border border-gray-700 overflow-auto break-words"
                      />
                    </div>
                  </div>
                </>
              )}

              {outputType === "address" && (
                <>
                  <div className="flex flex-row">
                    <div className="w-full  my-2">
                      <label className="block text-sm font-medium leading-6 text-gray-200">
                        Address Type:
                      </label>
                      <select
                        value={addressType}
                        onChange={(e) => setAddressType(e.target.value)}
                        className="w-11/12 bg-[#0F111B] hover:bg-[#0F171B] rounded-md text-sm hover:cursor-pointer"
                      >
                        <option value={"nonstandard"}>Nonstandard</option>
                        <option value={"p2wpkh"}>
                          P2WPKH (Pay to Witness Public Key Hash)
                        </option>
                        <option value={"p2tr"}>P2TR (Pay to Taproot)</option>
                      </select>
                    </div>
                  </div>

                  {addressType === "p2wpkh" && (
                    <div className="flex flex-row">
                      <div className="w-full my-2">
                        <label className="block text-sm font-medium leading-6 text-gray-200">
                          address:
                        </label>
                        <input
                          type="text"
                          value={pubkey}
                          onChange={(e) => setPubkey(e.target.value)}
                          className="w-full bg-transparent rounded-md text-sm border-gray-700"
                        />
                        <label className="block text-sm font-medium leading-6 text-gray-200 -mt-1">
                          or send to{" "}
                          <span
                            onClick={() => {
                              setPubkey(
                                "bcrt1q3a34qdsw4dd7ye4fdvzut88tcjgz76d8gkjqdd"
                              );
                            }}
                            className="underline hover:cursor-pointer"
                          >
                            Alice
                          </span>
                          {", "}
                          <span
                            onClick={() => {
                              setPubkey(
                                "bcrt1q63062x9c98g025gttswwpmjk49wcysk5jeh4pd"
                              );
                            }}
                            className="underline hover:cursor-pointer"
                          >
                            Bob
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                  {addressType === "p2tr" && (
                    <div className="flex flex-row">
                      <div className="w-full my-2">
                        <label className="block text-sm font-medium leading-6 text-gray-200">
                          address:
                        </label>
                        <input
                          type="text"
                          value={pubkey}
                          onChange={(e) => setPubkey(e.target.value)}
                          className="w-full bg-transparent rounded-md text-sm border-gray-700"
                        />
                        <label className="block text-sm font-medium leading-6 text-gray-200 -mt-1">
                          or send to{" "}
                          <span
                            onClick={() => {
                              setPubkey(
                                "bcrt1pxc8kgrxdlzvclef9fnfd7nslmval2xlgg30nxw06hl86j4lml50sauyyat"
                              );
                            }}
                            className="underline hover:cursor-pointer"
                          >
                            Alice
                          </span>
                          {", "}
                          <span
                            onClick={() => {
                              setPubkey(
                                "bcrt1pny8rwj0j4xnlgmqkx8hqmf0tdx7zdh5y0u7w0te65j79n00a584sxupumd"
                              );
                            }}
                            className="underline hover:cursor-pointer"
                          >
                            Bob
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex flex-row my-2">
                <button
                  className="w-full rounded-sm shadow-sm bg-[#222842] hover:bg-[#223242] text-gray-200 text-sm py-1 px-40"
                  onClick={onSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputModal;
