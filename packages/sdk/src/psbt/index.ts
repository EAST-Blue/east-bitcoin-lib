import { Psbt, networks } from "bitcoinjs-lib";
import { Network } from "../types";
import { AutoAdjustment, InputAddress, OutputAddress } from "./types";
import { P2pkhUtxo, P2trUtxo, P2wpkhUtxo } from "../addresses";

export type PSBTBuilderArgs = {
  network: Network;
  inputs: InputAddress[];
  outputs: OutputAddress[];
  autoAdjustment?: AutoAdjustment;
};

// TODO:
// - preinputs
// - merge another with PSBT
// - change address
// - calculate fee
export class PSBT {
  network: Network;
  private inputs: InputAddress[];
  private outputs: OutputAddress[];
  private autoAdjustment?: AutoAdjustment;

  private psbt: Psbt;

  constructor(params: PSBTBuilderArgs) {
    this.network = params.network;
    this.inputs = params.inputs;
    this.outputs = params.outputs;
    this.autoAdjustment = params.autoAdjustment;

    this.psbt = new Psbt({
      network: networks[this.network === "mainnet" ? "bitcoin" : this.network],
    });
  }

  private addInput(input: InputAddress) {
    if (input instanceof P2pkhUtxo) {
    } else if (input instanceof P2wpkhUtxo) {
    } else if (input instanceof P2trUtxo) {
    } else {
      throw new Error("errors.utxo input is not implemented yet");
    }
  }

  private addOutput(output: OutputAddress) {
    this.psbt.addOutput(output);
  }

  build() {
    for (const input of this.inputs) {
      this.addInput(input);
    }
    for (const output of this.outputs) {
      this.addOutput(output);
    }
  }
}

export * from "./extensions";
