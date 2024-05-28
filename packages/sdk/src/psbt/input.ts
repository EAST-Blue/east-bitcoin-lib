import { P2pkhUtxo, P2trUtxo, P2wpkhUtxo } from "../addresses";

export type UtxoInput = P2pkhUtxo | P2wpkhUtxo | P2trUtxo;

export type Input = {
  utxo: UtxoInput;
  value: number;
};
