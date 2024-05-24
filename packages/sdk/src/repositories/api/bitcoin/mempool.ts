import { BitcoinAPIAbstract } from ".";
import axios from "axios";
import { Utxo, RecommendedFee } from "./types";

export class MempoolAPI extends BitcoinAPIAbstract {
  private baseUrl = this.url
    ? this.url
    : this.network === "mainnet"
      ? "https://mempool.space/api"
      : "https://mempool.space/testnet/api/v1";

  async getUTXOs(address: string): Promise<Utxo[]> {
    const url = `${this.baseUrl}/address/${address}/utxo`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching UTXOs:", error);
      throw error;
    }
  }

  async getSafeSpendUTXOs(address: string): Promise<void> {
    const utxos = await this.getUTXOs(address);

    for (const { txid, vout } of utxos) {
      const url = `${this.baseUrl}/tx/${txid}`;
      try {
        const response = await axios.get(url);
        const txData = response.data;

        // Find the specific output in the transaction
        const output = txData.vout.find((output: any) => output.n === vout);

        // A UTXO is considered safe to spend if it has at least 6 confirmations
        if (
          output &&
          txData.status.confirmed &&
          txData.status.block_height !== null &&
          txData.status.block_height >= 6
        ) {
          continue;
        }

        return;
      } catch (error) {
        console.error("Error checking safe to spend:", error);
        throw error;
      }
    }
  }

  async brodcastTx(txHex: string): Promise<void> {
    const url = `${this.baseUrl}/tx`;
    try {
      const response = await axios.post(url, txHex, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      return response.data.txid;
    } catch (error) {
      console.error("Error broadcasting transaction:", error);
      throw error;
    }
  }

  async recommendedFee(): Promise<RecommendedFee> {
    const url = `${this.baseUrl}/v1/fees/recommended`;
    try {
      const response = await axios.get(url);
      return {
        fastestFee: response.data.fastestFee,
        halfHourFee: response.data.halfHourFee,
        hourFee: response.data.hourFee,
      };
    } catch (error) {
      console.error("Error fetching recommended fees:", error);
      throw error;
    }
  }
}
