import { AddressOutput, AddressUtxo, AddressUtxoArgs } from ".";

export type P2wpkhUtxoArgs = AddressUtxoArgs & {
  witness: {
    script: Buffer;
    value: number;
  };
};

export class P2wpkhUtxo extends AddressUtxo {
  witness: {
    script: Buffer;
    value: number;
  };

  constructor({ txid, vout, witness }: P2wpkhUtxoArgs) {
    super({ txid, vout });
    this.witness = witness;
  }
}

export class P2wpkhOutput extends AddressOutput {}
