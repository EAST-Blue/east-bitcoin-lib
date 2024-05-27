import { networks } from "bitcoinjs-lib";
import { Network } from "../types";

export function bitcoinJsNetwork(network: Network) {
  return networks[network === "mainnet" ? "bitcoin" : network];
}
