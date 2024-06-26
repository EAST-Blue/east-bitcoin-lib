import { Network } from "../types";
import { BitcoinAPIAbstract } from "./bitcoin";
import { OrdAPI } from "./ord";

export type APIParams = {
  network: Network;
  ord: OrdAPI;
  bitcoin: BitcoinAPIAbstract;
};

// Construct the BitcoinAPI and OrdAPI
export class API {
  protected network: Network;
  ord: OrdAPI;
  bitcoin: BitcoinAPIAbstract;

  constructor(params: APIParams) {
    this.network = params.network;
    this.ord = params.ord;
    this.bitcoin = params.bitcoin;
  }

  async getSafeUTXOs(address: string): Promise<void> {
    // Loop through all address UTXOs.
    // Check them one by one against the ORD server.
    // Make sure the UTXO doesn't exist as an ORD output.
  }
}

export * from "./types";
export * from "./bitcoin";
export * from "./ord";
