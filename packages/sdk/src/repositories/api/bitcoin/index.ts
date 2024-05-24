import { Network } from "../../../types";
import { Utxo, RecommendedFee } from "./types";

export type BitcoinAPIAbstractArgs = {
  network: Network;
  key?: string;
  url?: string; // for custom url
};

export abstract class BitcoinAPIAbstract {
  protected readonly network: Network;
  protected readonly url?: string;

  constructor(params: BitcoinAPIAbstractArgs) {
    this.network = params.network;
    this.url = params.url;
  }

  abstract getUTXOs(address: string): Promise<Utxo[]>;
  abstract brodcastTx(txHex: string): Promise<void>;
  abstract recommendedFee(): Promise<RecommendedFee>;
}

export * from "./mempool";
