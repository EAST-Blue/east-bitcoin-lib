// this is actually not an address, it's just a wrapper script for op_return output.

import { AddressType } from "./types";

export type OpReturnArgs = {
  script: Buffer;
};

export class OpReturn {
  type: AddressType = "op_return";
  script: Buffer;

  constructor({ script }: OpReturnArgs) {
    this.script = script;
  }
}
