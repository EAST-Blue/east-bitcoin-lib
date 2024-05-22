import { Network } from "../types";
import { AutoAdjustment, InputAddress, OutputAdreess } from "./types";

export type PSBTBuilderArgs = {
  network: Network;
  inputs: InputAddress[];
  outputs: OutputAdreess[];
  autoAdjustment?: AutoAdjustment;
};

// TODO:
// - preinputs
// - merge another with PSBT
// - change address
// - calculate fee
export class PSBT {
  private inputs: InputAddress[];
  private outputs: OutputAdreess[];
  private autoAdjustment?: AutoAdjustment;

  constructor(params: PSBTBuilderArgs) {
    this.inputs = params.inputs;
    this.outputs = params.outputs;
    this.autoAdjustment = params.autoAdjustment;
  }

  static foo() { }
}

export * from "./extensions";
