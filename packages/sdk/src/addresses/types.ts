export type Address = {
  address: string;
  pubKey?: string;
};

export type P2pkh = Address & {};
export type P2wpkh = Address & {};
export type P2tr = Address & {};
export type OpReturn = {
  script: Buffer;
};
