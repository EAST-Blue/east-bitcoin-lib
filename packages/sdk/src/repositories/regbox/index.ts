import { Network } from "../../types";

export type RegboxAPIParams = {
  network: Network;
  url: string;
};

export class RegboxAPI {
  protected readonly network: Network;
  protected readonly url: string;

  constructor({ network, url }: RegboxAPIParams) {
    this.network = network;
    this.url = url;
  }

  async getFaucet(address: string, amount: number): Promise<void> {
    const res = await fetch(`${this.url}/send-to-address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, amount }),
    });

    return await res.json();
  }

  async generateBlock(nblocks: number): Promise<void> {
    const res = await fetch(`${this.url}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nblocks }),
    });

    return await res.json();
  }
}
