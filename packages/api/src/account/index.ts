import { ECPairInterface } from "ecpair";
import { ecpair } from "../utils";
import * as borsh from "borsh";
import Client from "..";
import { BorshQuerySchema } from "./types";

export class Account {
  client: Client;
  keypair: ECPairInterface;
  requestId: number;
  nonce: number;

  constructor(client: Client, { privKey }: { privKey: string }) {
    this.client = client;
    this.keypair = ecpair.fromPrivateKey(Buffer.from(privKey, "hex"));
    this.requestId = 1;
    this.nonce = -1;
  }

  async init() {
    const confirmedNonce = await this.getNonce();
    this.nonce = confirmedNonce;
  }

  sign(hash: Buffer) {
    return this.keypair.sign(hash);
  }

  incrementRequestId() {
    this.requestId += 1;
  }

  incrementNonce() {
    this.nonce += 1;
  }

  getPublicKey(): string {
    return this.keypair.publicKey.toString("hex");
  }

  async getNonce(): Promise<number> {
    const params = borsh.serialize(BorshQuerySchema, {
      function_name: "get_nonce",
      args: [this.getPublicKey()],
    });
    const paramsInHex = Buffer.from(params).toString("hex");

    const body = {
      jsonrpc: "2.0",
      id: this.requestId,
      method: "Common.Query",
      params: [paramsInHex],
    };

    const response = await fetch(this.client.rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    const resultDecoded = Buffer.from(json.result.result, "base64");
    const nonce = resultDecoded.readInt32LE();

    return nonce;
  }
}
