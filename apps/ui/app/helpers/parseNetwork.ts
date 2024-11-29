import { Network, networks } from "bitcoinjs-lib";

export const parseNetwork = (network: string): Network => {
  switch (network) {
    case "mainnet":
      return networks.bitcoin;
    case "testnet":
      return networks.testnet;
    case "regtest":
      return networks.regtest;
    default:
      throw new Error(`Network not supported`);
      break;
  }
};
