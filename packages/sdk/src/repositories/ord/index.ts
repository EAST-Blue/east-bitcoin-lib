import { Network } from "../../types";

export type OrdAPIArgs = {
  network: Network;
};

export class OrdAPI {
  protected readonly network: Network;

  constructor({ network }: OrdAPIArgs) {
    this.network = network;
  }

  async getOutput(): Promise<void> { }
}
