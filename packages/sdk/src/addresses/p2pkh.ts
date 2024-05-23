export type P2pkhUtxoArgs = {
  txid: string;
  vout: number;
  transaction: Buffer;
};

export class P2pkhUtxo {
  txid: string;
  vout: number;
  transaction: Buffer;

  constructor({ txid, vout, transaction }: P2pkhUtxoArgs) {
    this.txid = txid;
    this.vout = vout;
    this.transaction = transaction;
  }
}
