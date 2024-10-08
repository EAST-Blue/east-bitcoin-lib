import { Network, Wallet } from "@east-bitcoin-lib/sdk";
import { checkSecretType } from "./checkSecretType";
import { SecretEnum } from "../enums/SecretEnum";

export const generateWalletBySecretType = (
  secret: string,
  network: string
): Wallet | null => {
  let wallet: Wallet;

  const secretType = checkSecretType(secret);

  if (secretType === SecretEnum.MNEMONIC) {
    wallet = new Wallet({ mnemonic: secret, network: network as Network });
  } else if (secretType === SecretEnum.PRIVATEKEY) {
    wallet = new Wallet({ privateKey: secret, network: network as Network });
  } else if (secretType === SecretEnum.WIF) {
    wallet = new Wallet({ wif: secret, network: network as Network });
  } else {
    return null;
  }

  return wallet;
};
