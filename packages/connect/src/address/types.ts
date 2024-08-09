export type AddressType = "p2pkh" | "p2sh" | "p2wsh" | "p2wpkh" | "p2tr";

export type WalletAddress = {
  publicKey: string;
  address: string;
  format: AddressFormat;
};

export type AddressFormat =
  | "legacy"
  | "p2sh-p2wpkh"
  | "p2wsh"
  | "segwit"
  | "taproot";
