// this is actually not an address, it's just a wrapper script for op_return output.

import { OpReturnType } from "./types";

export type OpReturnParams = {
  script: Buffer;
};

export class OpReturn {
  type: OpReturnType = "op_return";
  script: Buffer;

  constructor({ script }: OpReturnParams) {
    this.script = script;
  }
}
