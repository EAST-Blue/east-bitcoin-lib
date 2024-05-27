export * from "./types";
export * from "./p2pkh";
export * from "./p2tr";
export * from "./p2wpkh";

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

export type AddressOutputArgs = {
  address: string;
};

export class AddressOutput {
  address: string;
  constructor({ address }: AddressOutput) {
    this.address = address;
  }
}
