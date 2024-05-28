export type AddressUtxoArgs = {
  txid: string;
  vout: number;
};

export class AddressUtxo {
  txid: string;
  vout: number;

  constructor({ txid, vout }: AddressUtxoArgs) {
    this.txid = txid;
    this.vout = vout;
  }
}

export type AddressArgs = {
  address: string;
};

export class Address {
  address: string;
  constructor({ address }: Address) {
    this.address = address;
  }
}

export * from "./types";
export * from "./p2pkh";
export * from "./p2tr";
export * from "./p2wpkh";
