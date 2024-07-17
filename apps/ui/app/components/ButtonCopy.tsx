"use client";

import { useState } from "react";

const ButtonCopy = ({ onClick }: { onClick: () => void }) => {
  const [isCopying, setIsCopying] = useState(false);

  const copy = () => {
    setIsCopying(true);
    onClick();
    setTimeout(() => {
      setIsCopying(false);
    }, 1000);
  };

  return (
    <button
      disabled={isCopying}
      onClick={() => copy()}
      type="button"
      className="flex items-center justify-center py-1 w-16 rounded-lg bg-gradient-to-b from-white-2 to-white-1 disabled:opacity-50"
    >
      <p className="whitespace-nowrap font-semibold text-xs">
        {isCopying ? "COPIED" : "COPY"}
      </p>
    </button>
  );
};

export default ButtonCopy;
