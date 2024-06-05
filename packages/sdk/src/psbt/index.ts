import { Psbt, payments, script } from "bitcoinjs-lib";
import { Address, P2pkhUtxo, P2trUtxo, P2wpkhUtxo } from "../addresses";
import { bitcoinJsNetwork } from "../utils";
import { CoinSelect, CoinSelectArgs } from "./coin-select";
import { Input, Output } from "./types";
import { OpReturn } from "../addresses/opReturn";
import { P2shUtxo } from "../addresses/p2sh";
import { StackScripts } from "../script";

export type PSBTArgs = CoinSelectArgs & {};

export class PSBT extends CoinSelect {
  private psbt: Psbt;

  constructor({
    network,
    inputs,
    outputs,
    feeRate,
    changeOutput,
    utxoSelect,
  }: PSBTArgs) {
    super({ network, inputs, outputs, feeRate, changeOutput, utxoSelect });

    this.psbt = new Psbt({
      network: bitcoinJsNetwork(this.network),
    });
  }

  private addInput(input: Input) {
    switch (true) {
      case input.utxo instanceof P2pkhUtxo:
        this.psbt.addInput({
          hash: input.utxo.txid,
          index: input.utxo.vout,
          nonWitnessUtxo: input.utxo.transaction,
        });
        break;
      case input.utxo instanceof P2shUtxo:
        this.psbt.addInput({
          hash: input.utxo.txid,
          index: input.utxo.vout,
          nonWitnessUtxo: input.utxo.transaction,
          redeemScript: input.utxo.redeemScript,
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
          ...(input.utxo.tapLeafScript
            ? {
              tapLeafScript: input.utxo.tapLeafScript,
            }
            : {}),
        });
        break;

      default:
        throw new Error("errors.psbt input is not implemented yet");
    }
  }

  private addOutput(output: Output) {
    switch (true) {
      case output.output instanceof Address:
        this.psbt.addOutput({
          address: output.output.address,
          value: output.value,
        });
        break;
      case output.output instanceof OpReturn:
        this.psbt.addOutput({
          script: output.output.script,
          value: output.value,
        });
        break;
      default:
        throw new Error("errors.psbt output is not implemented yet");
    }
  }

  async build() {
    await this.coinSelection();
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

  static finalScript(unlockScripts: StackScripts) {
    return ({ } = {}, { } = {}, redeemScript: Buffer) => {
      const payment = payments.p2sh({
        redeem: {
          output: redeemScript,
          input: script.compile(unlockScripts),
        },
      });

      return {
        finalScriptSig: payment.input,
        finalScriptWitness: undefined,
      };
    };
  }
}

export * from "./extensions";
