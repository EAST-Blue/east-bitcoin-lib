import { Network } from "../../types";

export type BitcoinAPIAbstractArgs = {
  network: Network;
  key?: string;
};

export abstract class BitcoinAPIAbstract {
  protected readonly network: Network;

  constructor(params: BitcoinAPIAbstractArgs) {
    this.network = params.network;
  }

  abstract getUTXOs(address: string): Promise<void>;
  abstract brodcastTx(txHex: string): Promise<void>;
  abstract recommendedFee(): Promise<void>;
}

export * from "./mempool";
