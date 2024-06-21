import { Action } from "./transaction/types";

export type Network = "regtest" | "testnet" | "mainnet";

export type ClientArgs = {
  network: Network;
  rpcUrl: string;
};

export type MutateArgs = {
  signer: string;
  receiver: string;
  actions: Action[];
};

export type QueryArgs = {
  receiver: string;
  function_name: string;
  args: string[];
};
