"use client";

import { useEffect, useRef, useState } from "react";
import Leftbar from "../../components/Leftbar";
import NetworkSection from "../../components/Network";
import { createEditor, PrismEditor } from "prism-code-editor";
import "prism-code-editor/prism/languages/nasm";
import "prism-code-editor/layout.css";
import "prism-code-editor/scrollbar.css";
import "../../prism-style.css";

export default function Page(): JSX.Element {
  const [input, setInput] = useState("");
  const [encoded, setEncoded] = useState("");

  const inputScriptRef = useRef<HTMLDivElement>(null);
  const inputScriptEditorRef = useRef<PrismEditor>();
  useEffect(() => {
    const inputEditor = (inputScriptEditorRef.current = createEditor(
      inputScriptRef.current!,
      {
        value: "",
        language: "nasm",
        tabSize: 2,
        insertSpaces: false,
        lineNumbers: false,
        wordWrap: true,
      }
    ));
    import("../../extension").then((module) =>
      module.addExtensions(inputEditor)
    );

    return inputEditor.remove;
  }, []);

  const handleEncode = () => {
    if (inputScriptEditorRef.current?.value === "") return;

    const hexEncoded = Buffer.from(
      inputScriptEditorRef.current?.value!,
      "utf8"
    ).toString("hex");
    setEncoded(hexEncoded);
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      <Leftbar active="utils/tapscript" />

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        <NetworkSection />

        <div className="w-2/3 pr-4">
          <div className="bg-white-1 p-3 rounded-lg mb-4">
            <h2 className="text-xl font-bold">Tapscript Utils</h2>
          </div>

          <div className="mt-2 bg-white-1 p-3 rounded-lg">
            <h3 className="text-lg font-bold">Opcode to Hex</h3>

            <div
              autoFocus
              ref={inputScriptRef}
              className="w-full min-h-[100px] h-auto px-3 border-white-1 font-medium bg-[rgba(255,255,255,0.05)] rounded-lg outline-none text-white-8 focus:outline-none focus:border-white-4 focus:ring-0 focus:ring-offset-0"
            />
            <p className="text-sm text-white-3">Notes :</p>
            <p className="text-sm text-white-3">
              Replace <i>OP_PUSH "your data" </i>
              with
              <i> encodeUtf8(your data)</i>
            </p>

            <button
              className="flex my-2 px-4 items-center py-2 rounded-lg bg-gradient-to-b from-white-2 to-white-1 hover:from-white-1 cursor-pointer"
              onClick={handleEncode}
            >
              Generate
            </button>

            <div className="mt-4">
              <h4 className="text-lg font-bold">Encoded hex string:</h4>
              <textarea
                className="w-full h-auto px-3 border-white-1 font-medium bg-[rgba(255,255,255,0.05)] rounded-lg outline-none text-white-8 focus:outline-none focus:border-white-4 focus:ring-0 focus:ring-offset-0"
                rows={3}
                readOnly
                value={encoded}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
