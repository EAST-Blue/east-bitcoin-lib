import * as bip39 from "bip39";
import { ecpair } from "@east-bitcoin-lib/sdk";
import { networks } from "bitcoinjs-lib";
import { SecretEnum } from "../enums/SecretEnum";

export const checkSecretType = (input: string) => {
  // Check if input is a valid mnemonic
  if (bip39.validateMnemonic(input)) {
    return SecretEnum.MNEMONIC;
  }

  // Check if input is a valid private key hex
  const isHex = /^[0-9a-fA-F]{64}$/.test(input);
  if (isHex) {
    return SecretEnum.PRIVATEKEY;
  }

  // Check if input is a valid WIF
  try {
    ecpair.fromWIF(input, networks.regtest);
    return SecretEnum.WIF;
  } catch (e) {
    console.error("invalid wif format");
  }

  return SecretEnum.UNKNOWN;
};
