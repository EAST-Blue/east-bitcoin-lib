import { Account } from "./account";
import Transaction from "./transaction";
import { ClientArgs, MutateArgs, Network, QueryArgs } from "./types";

// wallet request sign (from private key, from file, from browser)
// signed msg push to rpc connection
// client.connectWallet()
// client.mutate()
// client.query()

export default class Client {
  network: Network;
  rpcUrl: string;
  accounts: Map<string, Account>;

  constructor({ network, rpcUrl }: ClientArgs) {
    this.network = network;
    this.rpcUrl = rpcUrl;
    this.accounts = new Map<string, Account>();
  }

  // request wallet sign in, type = private key, type = browser
  async requestSignIn(privKey: string): Promise<string> {
    const newAcc = new Account(this, {
      privKey: privKey,
    });

    await newAcc.init();

    const pubKey = newAcc.getPublicKey();

    this.accounts.set(pubKey, newAcc);

    return pubKey;
  }

  async mutate({ signer, receiver, actions }: MutateArgs) {
    const newTx = new Transaction(this, {
      signer: signer,
      receiver: receiver,
      actions: actions,
    });

    const signature = await newTx.exec();
    const body = await signature?.json();

    const b64decode = Buffer.from(body.result.result, "base64");

    return b64decode.toString();
  }

  async query({ receiver, function_name, args }: QueryArgs) {
    const newQueryTx = new Transaction(this, {
      signer: "dontcare",
      receiver: receiver,
      actions: [
        {
          kind: "view",
          function_name: function_name,
          args: args,
        },
      ],
    });

    const response = await newQueryTx.exec();
    const body = await response.json();

    return body;
  }
}
