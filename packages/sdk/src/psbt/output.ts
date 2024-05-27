import { P2pkhOutput, P2trOutput, P2wpkhUtxo } from "../addresses";
import { OpReturnOutput } from "../addresses/opReturn";

export type PSBTAddressOutput =
  | P2pkhOutput
  | P2wpkhUtxo
  | P2trOutput
  | OpReturnOutput;

export type PSBTOutputArgs = {
  output: PSBTAddressOutput;
  value: number;
};

export class PSBTOutput {
  output: PSBTAddressOutput;
  value: number;

  constructor({ output, value }: PSBTOutputArgs) {
    this.output = output;
    this.value = value;
  }
}
