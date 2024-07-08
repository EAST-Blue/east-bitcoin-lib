// this is actually not an address, it's just a wrapper script for op_return output.

import { Script, StackScripts } from "../script";
import { OpReturnType } from "./types";

export type OpReturnParams = {
  dataScripts: StackScripts;
};

export class OpReturn {
  type: OpReturnType = "op_return";
  script: Buffer;

  constructor({ dataScripts }: OpReturnParams) {
    const finalScripts = [Script.OP_RETURN, ...dataScripts];
    this.script = Script.compile(finalScripts);
  }
}
