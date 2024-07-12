"use client";

import React, { useEffect, useRef } from "react";
import { createEditor, PrismEditor } from "prism-code-editor";
import { insertText } from "prism-code-editor/utils";
import { copyButton } from "prism-code-editor/copy-button";
import "prism-code-editor/prism/languages/typescript";
import "prism-code-editor/layout.css";
import "prism-code-editor/scrollbar.css";
import "prism-code-editor/copy-button.css";
import "../prism-style.css";

const GenerateCodeModal = ({
  isOpen,
  onClose,
  code,
}: {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}) => {
  if (!isOpen) return null;
  if (code === "") return null;

  const scriptRef = useRef<HTMLDivElement>(null);
  const scriptEditorRef = useRef<PrismEditor>();
  useEffect(() => {
    const editor = (scriptEditorRef.current = createEditor(
      scriptRef.current!,
      {
        value: "",
        language: "typescript",
        tabSize: 2,
        insertSpaces: false,
        lineNumbers: true,
        wordWrap: false,
      },
      copyButton()
    ));
    import("../extension").then((module) => module.addExtensions(editor));

    insertText(editor, code);
    return editor.remove;
  }, [code]);

  console.log(scriptRef);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#262626] p-6 rounded-lg w-[700px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Generate Client Code</h2>
          <button
            className="text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Client Code</label>
          <div
            ref={scriptRef}
            className="w-full h-[300px] border border-gray-700 font-medium bg-[rgba(255,255,255,0.05)] rounded-lg outline-none text-white p-2 overflow-auto"
          />
        </div>
        <div className="flex justify-end gap-x-2">
          <button
            className="flex px-4 items-center py-2 disabled:cursor-not-allowed rounded-lg bg-gradient-to-b from-white-2 to-white-1 hover:from-white-1 disabled:opacity-50"
            onClick={() => {
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateCodeModal;
