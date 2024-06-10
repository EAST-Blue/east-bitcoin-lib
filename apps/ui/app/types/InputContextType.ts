import { BitcoinUTXO } from "@east-bitcoin-lib/sdk/dist/repositories/bitcoin/types";

export type InputContextType = {
  utxos: BitcoinUTXO[];
  saveUtxos: (utxos: BitcoinUTXO[]) => void;
  removeUtxoByTxid: (txid: string) => void;
};
