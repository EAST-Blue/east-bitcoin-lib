import { Network } from "../../types";

export type OrdAPIParams = {
  network: Network;
};

export class OrdAPI {
  protected readonly network: Network;

  constructor({ network }: OrdAPIParams) {
    this.network = network;
  }

  async getOutput(): Promise<void> { }
}
