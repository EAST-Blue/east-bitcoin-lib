import * as borsh from "borsh";
import {
  borshActionsSchema,
  borshMainSchema,
  borshTransactionSchema,
  TransactionParams,
} from "./types";
import { sha256 } from "../utils";
import Client from "..";
import { Account } from "../account";

export default class Transaction {
  client: Client;
  params: TransactionParams;

  constructor(client: Client, params: TransactionParams) {
    this.client = client;
    this.params = params;
  }

  getAccount(): Account {
    const acc = this.client.accounts.get(this.params.signer);
    if (acc) {
      return acc;
    }
    throw new Error("account not found");
  }

  //   return signature (hex) & transaction (hex)
  async sign(): Promise<{
    signature: string;
    msg: string;
  }> {
    // serialize actions
    const actionsPackedByte = Buffer.from(
      borsh.serialize(borshActionsSchema, this.params.actions)
    );
    const actionsPackedHex = actionsPackedByte.toString("hex");

    const account = this.getAccount();
    const signerPK = account.getPublicKey();

    // check nonce increment correct in concurrent manner
    account.incrementNonce();

    // serialize full transaction
    const txPackedByte = Buffer.from(
      borsh.serialize(borshTransactionSchema, {
        nonce: account.nonce,
        signer: signerPK,
        receiver: this.params.receiver,
        actions: actionsPackedHex,
      })
    );

    // sha256 from txPackedByte
    const hashedMsg = await sha256(txPackedByte);

    // sign by account
    const signatureBuf = account.sign(Buffer.from(hashedMsg));

    // return as hex
    return {
      signature: signatureBuf.toString("hex"),
      msg: txPackedByte.toString("hex"),
    };
  }

  //   call sign first, generate params, serialize, then submit to rpc
  async mutate() {
    const { signature, msg } = await this.sign();

    const txId = await sha256(Buffer.from(signature));
    const txIdHex = Buffer.from(txId).toString("hex");

    const mainTx = {
      id: txIdHex,
      signature: signature,
      transaction: msg,
    };
    const mainTxPacked = borsh.serialize(borshMainSchema, mainTx);
    const mainTxPackedHex = Buffer.from(mainTxPacked).toString("hex");

    const account = this.getAccount();

    // to do check increment id works concurrently
    account.incrementRequestId();

    const body = {
      jsonrpc: "2.0",
      id: account.requestId,
      method: "Runtime.Mutate",
      params: [mainTxPackedHex],
    };

    const response = await fetch(this.client.rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(body),
    });

    return response;
  }

  //   call sign first, generate params, serialize, then submit to rpc
  async query() {
    const body = {
      jsonrpc: "2.0",
      id: "dontcare",
      method: "Runtime.Query",
      params: [
        {
          target: this.params.receiver,
          function_name: this.params.actions[0]?.function_name,
          args: this.params.actions[0]?.args,
        },
      ],
    };

    const response = await fetch(this.client.rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(body),
    });

    return response;
  }

  async exec() {
    if (this.params.signer === "dontcare") {
      return await this.query();
    } else {
      return await this.mutate();
    }
  }
}
