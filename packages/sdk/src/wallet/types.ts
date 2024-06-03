import { ECPairInterface } from "ecpair";

export type DeriveAddress = {
  address: string;
  keypair: ECPairInterface;
};
