import {
  P2pkhOutput,
  P2pkhUtxo,
  P2trOutput,
  P2trUtxo,
  P2wpkhOutput,
  P2wpkhUtxo,
} from "../../addresses";
import { OpReturnOutput } from "../../addresses/opReturn";
import { PSBTAddressInput } from "../input";
import { PSBTAddressOutput } from "../output";
import {
  FEE_TX_EMPTY_SIZE,
  FEE_TX_INPUT_BASE,
  FEE_TX_INPUT_PUBKEYHASH,
  FEE_TX_INPUT_SEGWIT,
  FEE_TX_INPUT_TAPROOT,
  FEE_TX_OUTPUT_BASE,
  FEE_TX_OUTPUT_PUBKEYHASH,
  FEE_TX_OUTPUT_SEGWIT,
  FEE_TX_OUTPUT_TAPROOT,
} from "./const";

import { PSBTInput } from "../input";
import { PSBTOutput } from "../output";

export type PSBTFeeCalculatorArgs = {
  inputs: PSBTInput[];
  outputs: PSBTOutput[];
  feeRate: number;
  changeOutput: PSBTAddressOutput;
};
export class PSBTFeeCalculator {
  inputs: PSBTInput[];
  outputs: PSBTOutput[];
  feeRate: number;
  changeOutput: PSBTAddressOutput;

  constructor({
    inputs,
    outputs,
    feeRate,
    changeOutput,
  }: PSBTFeeCalculatorArgs) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.feeRate = feeRate;
    this.changeOutput = changeOutput;
  }

  get dustThreshold() {
    // set the value from the highest input type
    return FEE_TX_INPUT_BASE + FEE_TX_INPUT_PUBKEYHASH * this.feeRate;
  }

  get totalInputValue() {
    return this.inputs.reduce((prev, input) => prev + input.value, 0);
  }

  get totalOutputValue() {
    return this.outputs.reduce((prev, output) => prev + output.value, 0);
  }

  get feeValue() {
    return this.totalInputValue - this.totalOutputValue;
  }

  get transactionFee() {
    return this.transactionBytes() * this.feeRate;
  }

  private inputBytes(psbtAddressInput: PSBTAddressInput) {
    let bytes = FEE_TX_INPUT_BASE;

    switch (true) {
      case psbtAddressInput instanceof P2pkhUtxo:
        bytes += FEE_TX_INPUT_PUBKEYHASH;
        break;
      case psbtAddressInput instanceof P2wpkhUtxo:
        bytes += FEE_TX_INPUT_SEGWIT;
        break;
      case psbtAddressInput instanceof P2trUtxo:
        bytes += FEE_TX_INPUT_TAPROOT;
        break;
      default:
        throw new Error("errors.fee input is not implemented yet");
    }

    return bytes;
  }

  private outputBytes(psbtAddressOutput: PSBTAddressOutput) {
    let bytes = FEE_TX_OUTPUT_BASE;

    switch (true) {
      case psbtAddressOutput instanceof P2pkhOutput:
        bytes += FEE_TX_OUTPUT_PUBKEYHASH;
        break;
      case psbtAddressOutput instanceof P2wpkhOutput:
        bytes += FEE_TX_OUTPUT_SEGWIT;
        break;
      case psbtAddressOutput instanceof P2trOutput:
        bytes += FEE_TX_OUTPUT_TAPROOT;
        break;
      case psbtAddressOutput instanceof OpReturnOutput:
        break;

      default:
        throw new Error("errors.fee output is not implemented yet");
    }

    return bytes;
  }

  protected transactionBytes() {
    return (
      FEE_TX_EMPTY_SIZE +
      this.inputs.reduce(
        (prev, input) => prev + this.inputBytes(input.utxo),
        0,
      ) +
      this.outputs.reduce(
        (prev, output) => prev + this.outputBytes(output.output),
        0,
      )
    );
  }

  // This will calculate all input and output fees,
  // and also add a change output if it's worth it.
  finalizeFee() {
    const changeFee = this.outputBytes(this.changeOutput);

    const bytesAccum = this.transactionBytes();
    const feeAfterExtraOutput = this.feeRate * (bytesAccum + changeFee);
    const remainderAfterExtraOutput =
      this.totalInputValue - this.totalOutputValue + feeAfterExtraOutput;

    // is it worth a change output?
    if (remainderAfterExtraOutput > this.dustThreshold) {
      this.outputs.push({
        output: this.changeOutput,
        value: remainderAfterExtraOutput,
      });
    }
  }
}
