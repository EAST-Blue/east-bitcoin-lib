import { Psbt } from "bitcoinjs-lib";
import { Network } from "../types";
import { AutoAdjustment } from "./types";
import {
  P2pkhOutput,
  P2pkhUtxo,
  P2trOutput,
  P2trUtxo,
  P2wpkhOutput,
  P2wpkhUtxo,
} from "../addresses";
import { PSBTInput } from "./input";
import { PSBTOutput } from "./output";
import { bitcoinJsNetwork } from "../utils";
import { OpReturnOutput } from "../addresses/opReturn";
import { PSBTFeeCalculator } from "./fee-calculator";

export type PSBTBuilderArgs = {
  network: Network;
  inputs: PSBTInput[];
  outputs: PSBTOutput[];
  autoAdjustment?: AutoAdjustment;
};

// TODO:
// - preinputs
// - merge another with PSBT
// - change address
// - calculate fee
export class PSBT extends PSBTFeeCalculator {
  network: Network;
  private autoAdjustment?: AutoAdjustment;

  private psbt: Psbt;

  constructor({ network, inputs, outputs, autoAdjustment }: PSBTBuilderArgs) {
    super({ inputs, outputs });

    this.network = network;
    this.autoAdjustment = autoAdjustment;

    this.psbt = new Psbt({
      network: bitcoinJsNetwork(this.network),
    });
  }

  private addInput(input: PSBTInput) {
    switch (true) {
      case input.utxo instanceof P2pkhUtxo:
        this.psbt.addInput({
          hash: input.utxo.txid,
          index: input.utxo.vout,
          nonWitnessUtxo: input.utxo.transaction,
        });
        break;
      case input.utxo instanceof P2wpkhUtxo:
        this.psbt.addInput({
          hash: input.utxo.txid,
          index: input.utxo.vout,
          witnessUtxo: input.utxo.witness,
        });
        break;
      case input.utxo instanceof P2trUtxo:
        this.psbt.addInput({
          hash: input.utxo.txid,
          index: input.utxo.vout,
          witnessUtxo: input.utxo.witness,
          tapInternalKey: input.utxo.tapInternalKey,
          tapLeafScript: input.utxo.tapLeafScript,
        });
        break;

      default:
        throw new Error("errors.psbt input is not implemented yet");
    }
  }

  private addOutput(output: PSBTOutput) {
    switch (true) {
      case output.output instanceof P2pkhOutput ||
        output.output instanceof P2wpkhOutput ||
        output.output instanceof P2trOutput:
        this.psbt.addOutput({
          address: output.output.address,
          value: output.value,
        });
        break;
      case output.output instanceof OpReturnOutput:
        this.psbt.addOutput({
          script: output.output.script,
          value: output.value,
        });
        break;
      default:
        throw new Error("errors.psbt output is not implemented yet");
    }
  }

  build() {
    for (const input of this.inputs) {
      this.addInput(input);
    }
    for (const output of this.outputs) {
      this.addOutput(output);
    }
  }

  toPSBT() {
    return this.psbt;
  }

  toHex() {
    return this.psbt.toHex();
  }

  toBase64() {
    return this.psbt.toBase64();
  }
}

export * from "./extensions";
