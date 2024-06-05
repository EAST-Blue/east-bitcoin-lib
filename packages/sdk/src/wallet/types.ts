import { ECPairInterface } from "ecpair";

export type DeriveAddress = {
  address: string;
};

export type DeriveP2pkh = DeriveAddress & {
  keypair: ECPairInterface;
};

export type DeriveP2wpkh = DeriveAddress & {
  keypair: ECPairInterface;
};

export type DeriveP2tr = DeriveAddress & {
  keypair: ECPairInterface;
  tapInternalKey: Buffer;
};

export type DeriveP2sh = DeriveAddress & {
  redeemScript: Buffer;
};
