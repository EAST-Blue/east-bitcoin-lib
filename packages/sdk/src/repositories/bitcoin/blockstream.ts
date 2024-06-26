import fetch from "cross-fetch";
import * as bitcoinjs from "bitcoinjs-lib";
import { BitcoinAPIAbstract } from ".";
import { Network } from "../../types";
import { APIUrl, BitcoinUTXO } from "./types";
import { bitcoinJsNetwork } from "../../utils";

export type BElectrsAPIParams = {
  network: Network;
  apiUrl?: APIUrl;
};

export class BElectrsAPI extends BitcoinAPIAbstract {
  constructor({
    network,
    // default apis url
    apiUrl = {
      mainnet: "https://blockstream.info/api",
      testnet: "https://blockstream.info/testnet/api",
    },
  }: BElectrsAPIParams) {
    super({ network, apiUrl });
  }

  async getUTXOs(address: string): Promise<BitcoinUTXO[]> {
    const res = await fetch(`${this.url}/address/${address}/utxo`);
    const scriptHash = bitcoinjs.address
      .toOutputScript(address, bitcoinJsNetwork(this.network))
      .toString("hex");

    const utxos = (await res.json()) as {
      txid: string;
      vout: number;
      status: {
        confirmed: boolean;
        block_height: number;
        block_hash: string;
        block_time: number;
      };
      value: number;
    }[];
    return utxos.map((utxo) => {
      return {
        ...utxo,
        address,
        script_hash: scriptHash,
      };
    });
  }

  async getTransactionHex(txid: string): Promise<string> {
    const res = await fetch(`${this.url}/tx/${txid}/hex`);
    return await res.text();
  }

  async brodcastTx(txHex: string): Promise<void> { }
  async recommendedFee(): Promise<void> { }
}
