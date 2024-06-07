import { getAddressType } from "../utils";
import { AddressType } from "./types";

export type AddressUtxoArgs = {
  txid: string;
  vout: number;
};

export abstract class AddressUtxo {
  abstract type: AddressType;

  txid: string;
  vout: number;

  constructor({ txid, vout }: AddressUtxoArgs) {
    this.txid = txid;
    this.vout = vout;
  }
}

export type AddressAutoUtxoArgs = {
  address: string;
};

export abstract class AddressAutoUtxo {
  address: Address;
  constructor({ address }: AddressAutoUtxoArgs) {
    this.address = Address.fromString(address);
  }
}

export type AddressArgs = {
  address: string;
};

export class Address {
  address: string;
  type: AddressType;

  constructor({ address }: AddressArgs) {
    this.address = address;
    this.type = getAddressType(address);
  }

  static fromString(address: string) {
    return new Address({ address });
  }
}

export * from "./types";
export * from "./p2pkh";
export * from "./p2sh";
export * from "./p2tr";
export * from "./p2wpkh";
