export type P2wpkhUtxoArgs = {
  txid: string;
  vout: number;
  witness: {
    script: Buffer;
    value: number;
  };
};

export class P2wpkhUtxo {
  txid: string;
  vout: number;
  witness: {
    script: Buffer;
    value: number;
  };

  constructor({ txid, vout, witness }: P2wpkhUtxoArgs) {
    this.txid = txid;
    this.vout = vout;
    this.witness = witness;
  }
}
