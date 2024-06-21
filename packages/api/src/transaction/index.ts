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

// const params = {
//     id: "sha256(signature)",
//     signature: "secp256k1.ecdsaSign(transaction, privKey)",
//     transaction: {
//       signer: pubKey.toString("hex"),
//       receiver: "abc",
//       actions: [
//         {
//           kind: "call",
//           method_name: "asd",
//           args: ["hello", "world"],
//         },
//       ],
//     },
//   };

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
  async send(type: string) {
    const method = type === "mutate" ? "Runtime.Mutate" : "Runtime.Query";
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
      method: method,
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
}
