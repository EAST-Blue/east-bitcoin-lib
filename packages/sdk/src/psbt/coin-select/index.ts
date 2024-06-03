import { P2pkhUtxo, P2trUtxo, P2wpkhUtxo } from "../../addresses";
import { BitcoinUTXO } from "../../repositories/bitcoin/types";
import { Network } from "../../types";
import { Input, InputType, Output, OutputOutput, OutputType } from "../types";

import { UtxoSelect } from "./types";

// Refer to this page: https://bitcoinops.org/en/tools/calc-size/
// export const FEE_TX_OUTPUT_SCRIPTHASH = 23;
// export const FEE_TX_OUTPUT_SEGWIT_SCRIPTHASH = 34;
export const FEE_TX_EMPTY_SIZE = 4 + 1 + 1 + 4;

export const FEE_TX_INPUT_BASE = 32 + 4 + 1 + 4;
export const FEE_TX_INPUT_PUBKEYHASH = 107;
export const FEE_TX_INPUT_SEGWIT = 27 + 1;
export const FEE_TX_INPUT_TAPROOT = 17 + 1;

export const FEE_TX_OUTPUT_BASE = 8 + 1;
export const FEE_TX_OUTPUT_PUBKEYHASH = 25;
export const FEE_TX_OUTPUT_SEGWIT = 22;
export const FEE_TX_OUTPUT_TAPROOT = 34;

export type CoinSelectArgs = {
  network: Network;
  inputs: Input[];
  outputs: Output[];
  feeRate: number;
  changeOutput?: OutputOutput;
  utxoSelect?: UtxoSelect;
};

// highly inspired by https://github.com/bitcoinjs/coinselect & https://github.com/joundy/bitcoin-utxo-select
export class CoinSelect {
  network: Network;
  inputs: Input[];
  outputs: Output[];
  feeRate: number;
  changeOutput?: OutputOutput;
  utxoSelect?: UtxoSelect;

  private utxoCandidates: BitcoinUTXO[] = [];

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

  private inputBytes(inputType: InputType) {
    let bytes = FEE_TX_INPUT_BASE;

    switch (inputType) {
      case "p2pkh":
        bytes += FEE_TX_INPUT_PUBKEYHASH;
        break;
      case "p2wpkh":
        bytes += FEE_TX_INPUT_SEGWIT;
        break;
      case "p2tr":
        bytes += FEE_TX_INPUT_TAPROOT;
        break;
      default:
        throw new Error("errors.fee input is not implemented yet");
    }

    return bytes;
  }

  private outputBytes(outputType: OutputType) {
    let bytes = FEE_TX_OUTPUT_BASE;

    switch (outputType) {
      case "p2pkh":
        bytes += FEE_TX_OUTPUT_PUBKEYHASH;
        break;
      case "p2wpkh":
        bytes += FEE_TX_OUTPUT_SEGWIT;
        break;
      case "p2tr":
        bytes += FEE_TX_OUTPUT_TAPROOT;
        break;
      case "op_return":
        throw new Error("errors.fee output op_return is not implemented yet");

      default:
        throw new Error("errors.fee output is not implemented yet");
    }

    return bytes;
  }

  private transactionBytes() {
    return (
      FEE_TX_EMPTY_SIZE +
      this.inputs.reduce(
        (prev, input) => prev + this.inputBytes(input.utxo.type),
        0,
      ) +
      this.outputs.reduce(
        (prev, output) => prev + this.outputBytes(output.output.type),
        0,
      )
    );
  }

  private async selectUtxoCandidates() {
    if (!this.utxoSelect) return;

    let transactionBytes = this.transactionBytes();
    let totalInputValue = this.totalInputValue;
    const totalOutputValue = this.totalOutputValue;

    const fee = this.feeRate * transactionBytes;
    if (totalInputValue > totalOutputValue + fee) {
      // no need to add more UTXOs since the inputs already cover the transaction fee and total output value
      return;
    }

    const utxos = await this.utxoSelect.api.bitcoin.getUTXOs(
      this.utxoSelect.address.address,
    );

    for (const utxo of utxos) {
      const utxoBytes = this.inputBytes(this.utxoSelect.address.type);
      const utxoFee = this.feeRate * utxoBytes;
      const utxoValue = utxo.value;

      // find another UTXO candidate because the value is less than the fee, considered as dust.
      if (utxoFee > utxoValue) continue;

      transactionBytes += utxoBytes;
      totalInputValue += utxoValue;
      this.utxoCandidates.push(utxo);

      // let's add other UTXOs if the inputs still not cover the fee and total output value.
      if (totalInputValue < totalOutputValue + fee) continue;

      return;
    }
  }

  private async prepareUtxoCandidates() {
    if (!this.utxoSelect) return;

    for (const utxo of this.utxoCandidates) {
      switch (this.utxoSelect.address.type) {
        case "p2pkh":
          this.inputs.push({
            utxo: await P2pkhUtxo.fromBitcoinUTXO(
              this.utxoSelect.api.bitcoin,
              utxo,
            ),
            value: utxo.value,
          });
          break;
        case "p2wpkh":
          this.inputs.push({
            utxo: await P2wpkhUtxo.fromBitcoinUTXO(utxo),
            value: utxo.value,
          });
          break;
        case "p2tr":
          if (!this.utxoSelect.pubkey) {
            throw new Error(
              "errors.pubkey is required when using taproot/p2tr address",
            );
          }
          this.inputs.push({
            utxo: await P2trUtxo.fromBitcoinUTXO(utxo, this.utxoSelect.pubkey),
            value: utxo.value,
          });
          break;
        default:
          throw new Error("errors.utxo candidate is not implemented yet");
      }
    }
  }

  // this will calculate the final inputs and outputs fees,
  // and also add a change output if it's worth it.
  private finalize() {
    // set the default change fee with pubkeyhash bytes (worst case)
    let changeFee = this.outputBytes("p2pkh");
    if (this.changeOutput) {
      changeFee = this.outputBytes(this.changeOutput.type);
    }

    const transactionBytes = this.transactionBytes();
    const feeAfterExtraOutput = this.feeRate * (transactionBytes + changeFee);
    const remainderAfterExtraOutput =
      this.totalInputValue - (this.totalOutputValue + feeAfterExtraOutput);

    // is it worth a change output?
    if (remainderAfterExtraOutput > this.dustThreshold && this.changeOutput) {
      this.outputs.push({
        output: this.changeOutput,
        value: remainderAfterExtraOutput,
      });
    }
  }

  async coinSelection() {
    await this.selectUtxoCandidates();
    await this.prepareUtxoCandidates();
    this.finalize();
  }
}
