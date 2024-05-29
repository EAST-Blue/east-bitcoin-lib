// this is actually not an address, it's just a wrapper script for op_return output.

import { OpReturnType } from "./types";

export type OpReturnArgs = {
  script: Buffer;
};

export class OpReturn {
  type: OpReturnType = "op_return";
  script: Buffer;

  constructor({ script }: OpReturnArgs) {
    this.script = script;
  }
}
