export type Address = {
  address: string;
  pubKey: string;
};

export type P2PKH = Address & {};
export type P2WPKH = Address & {};
export type P2TR = Address & {
  xKey: string;
};
export type OP_RETURN = Address & {
  script: string;
};
