import { Sha256 } from "@aws-crypto/sha256-browser";
import { ECPairFactory } from "ecpair";
import ecc from "@bitcoinerlab/secp256k1";

export const sha256 = async (msg: Buffer) => {
  const hash = new Sha256();
  hash.update(msg);
  const result = await hash.digest();

  return result;
};

export const ecpair = ECPairFactory(ecc);
