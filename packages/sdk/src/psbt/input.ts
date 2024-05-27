import { P2pkhUtxo, P2trUtxo, P2wpkhUtxo } from "../addresses";

export type PSBTAddressInput = P2pkhUtxo | P2wpkhUtxo | P2trUtxo;

export type PSBTInputArgs = {
  utxo: PSBTAddressInput;
  value: number;
};

export class PSBTInput {
  utxo: PSBTAddressInput;
  value: number;

  constructor({ utxo, value }: PSBTInputArgs) {
    this.utxo = utxo;
    this.value = value;
  }
}
