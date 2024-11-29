import { address, networks, script } from "bitcoinjs-lib";
import { Output } from "bitcoinjs-lib/src/transaction";

export const outsToString = (out: Output): string => {
  try {
    if (!out) return "NULL";
    const outScript = out.script;
    const asmScript = script.toASM(outScript);
    const splitAsmScript = asmScript.split(" ");

    if (splitAsmScript[0] === "OP_1" || splitAsmScript[0] === "OP_0") {
      const addr = address.fromOutputScript(outScript, networks.regtest);
      return addr;
    } else {
      return asmScript;
    }
  } catch (error) {
    console.log("ERROR : ", error);
    return "ERROR";
  }
};
