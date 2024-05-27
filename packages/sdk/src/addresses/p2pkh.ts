import { AddressOutput, AddressUtxo, AddressUtxoArgs } from ".";

export type P2pkhUtxoArgs = AddressUtxoArgs & {
  transaction: Buffer;
};

export class P2pkhUtxo extends AddressUtxo {
  transaction: Buffer;

  constructor({ txid, vout, transaction }: P2pkhUtxoArgs) {
    super({ txid, vout });
    this.transaction = transaction;
  }
}

export class P2pkhOutput extends AddressOutput {}
