import { AddressType, AddressUtxo, AddressUtxoArgs } from ".";
import { BitcoinUTXO } from "../repositories/bitcoin/types";

export type P2wpkhUtxoArgs = AddressUtxoArgs & {
  witness: {
    script: Buffer;
    value: number;
  };
};

export class P2wpkhUtxo extends AddressUtxo {
  type: AddressType = "p2wpkh";

  witness: {
    script: Buffer;
    value: number;
  };

  constructor({ txid, vout, witness }: P2wpkhUtxoArgs) {
    super({ txid, vout });
    this.witness = witness;
  }

  static async fromBitcoinUTXO(bitcoinUTXO: BitcoinUTXO) {
    return new P2wpkhUtxo({
      txid: bitcoinUTXO.txid,
      vout: bitcoinUTXO.vout,
      witness: {
        script: Buffer.from(bitcoinUTXO.script_hash, "hex"),
        value: bitcoinUTXO.value,
      },
    });
  }
}
