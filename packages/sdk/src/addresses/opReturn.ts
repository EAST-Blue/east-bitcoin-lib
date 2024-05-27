// this is actually not an address, it's just a wrapper script for op_return output

export type OpReturnOutputArgs = {
  script: Buffer;
};

export class OpReturnOutput {
  script: Buffer;

  constructor({ script }: OpReturnOutputArgs) {
    this.script = script;
  }
}
