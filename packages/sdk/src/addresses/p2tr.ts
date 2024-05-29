import { AddressType, AddressUtxo, AddressUtxoArgs } from ".";
import { BitcoinUTXO } from "../repositories/bitcoin/types";

export type TapLeafScript = {
  controlBlock: Buffer;
  leafVersion: number;
  script: Buffer;
};

export type P2trUtxoArgs = AddressUtxoArgs & {
  witness: {
    script: Buffer;
    value: number;
  };
  tapInternalKey?: Buffer;
  tapLeafScript?: TapLeafScript[];
};

export class P2trUtxo extends AddressUtxo {
  type: AddressType = "p2tr";
  witness: {
    script: Buffer;
    value: number;
  };
  tapInternalKey?: Buffer;
  tapLeafScript?: TapLeafScript[];

  constructor({
    txid,
    vout,
    witness,
    tapInternalKey,
    tapLeafScript,
  }: P2trUtxoArgs) {
    super({ txid, vout });
    this.witness = witness;
    this.tapInternalKey = tapInternalKey;
    this.tapLeafScript = tapLeafScript;
  }

  static async fromBitcoinUTXO(bitcoinUTXO: BitcoinUTXO) {
    return new P2trUtxo({
      txid: bitcoinUTXO.txid,
      vout: bitcoinUTXO.vout,
      witness: {
        script: Buffer.from(bitcoinUTXO.script_hash, "hex"),
        value: bitcoinUTXO.value,
      },
    });
  }
}
