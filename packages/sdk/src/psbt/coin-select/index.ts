import {
  P2pkhAddress,
  P2pkhUtxo,
  P2trAddress,
  P2trUtxo,
  P2wpkhAddress,
  P2wpkhUtxo,
} from "../../addresses";
import { OpReturnOutput } from "../../addresses/opReturn";
import { Network } from "../../types";
import { Input, UtxoInput } from "../input";
import { Output, AddressOutput } from "../output";
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

import { UtxoSelect } from "./types";

export type CoinSelectArgs = {
  network: Network;
  inputs: Input[];
  outputs: Output[];
  feeRate: number;
  changeOutput?: AddressOutput;
  utxoSelect?: UtxoSelect;
};
export class CoinSelect {
  network: Network;
  inputs: Input[];
  outputs: Output[];
  feeRate: number;
  changeOutput?: AddressOutput;
  utxoSelect?: UtxoSelect;

  constructor({
    network,
    inputs,
    outputs,
    feeRate,
    changeOutput,
    utxoSelect,
  }: CoinSelectArgs) {
    this.network = network;
    this.inputs = inputs;
    this.outputs = outputs;
    this.feeRate = feeRate;
    this.changeOutput = changeOutput;
    this.utxoSelect = utxoSelect;
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

  private inputBytes(utxoInput: UtxoInput) {
    let bytes = FEE_TX_INPUT_BASE;

    switch (true) {
      case utxoInput instanceof P2pkhUtxo:
        bytes += FEE_TX_INPUT_PUBKEYHASH;
        break;
      case utxoInput instanceof P2wpkhUtxo:
        bytes += FEE_TX_INPUT_SEGWIT;
        break;
      case utxoInput instanceof P2trUtxo:
        bytes += FEE_TX_INPUT_TAPROOT;
        break;
      default:
        throw new Error("errors.fee input is not implemented yet");
    }

    return bytes;
  }

  private outputBytes(addressOutput: AddressOutput) {
    let bytes = FEE_TX_OUTPUT_BASE;

    switch (true) {
      case addressOutput instanceof P2pkhAddress:
        bytes += FEE_TX_OUTPUT_PUBKEYHASH;
        break;
      case addressOutput instanceof P2wpkhAddress:
        bytes += FEE_TX_OUTPUT_SEGWIT;
        break;
      case addressOutput instanceof P2trAddress:
        bytes += FEE_TX_OUTPUT_TAPROOT;
        break;
      case addressOutput instanceof OpReturnOutput:
        break;

      default:
        throw new Error("errors.fee output is not implemented yet");
    }

    return bytes;
  }

  private transactionBytes() {
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

  private processUtxo() {
    if (!this.utxoSelect) return;
  }

  // This will calculate all input and output fees,
  // and also add a change output if it's worth it.
  private finalizeFee() {
    // set the default change fee with pubkeyhash bytes (worst case)
    let changeFee = FEE_TX_OUTPUT_BASE + FEE_TX_OUTPUT_PUBKEYHASH;
    if (this.changeOutput) {
      changeFee = this.outputBytes(this.changeOutput);
    }

    const bytesAccum = this.transactionBytes();
    const feeAfterExtraOutput = this.feeRate * (bytesAccum + changeFee);
    const remainderAfterExtraOutput =
      this.totalInputValue - this.totalOutputValue + feeAfterExtraOutput;

    // is it worth a change output?
    if (remainderAfterExtraOutput > this.dustThreshold && this.changeOutput) {
      this.outputs.push({
        output: this.changeOutput,
        value: remainderAfterExtraOutput,
      });
    }
  }

  calculateFee() {
    this.processUtxo();
    this.finalizeFee();
  }
}
