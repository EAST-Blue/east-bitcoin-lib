import Client from ".";

const main = async () => {
  const client = new Client({
    network: "regtest",
    rpcUrl: "http://127.0.0.1:3000",
  });

  const pubKey = await client.requestSignIn(
    "7c67c815e1c4a25fe70d95aad9440b682bdcbe6e2baf34d460966e605705ea8e"
  );

  const lastNonce = await client.accounts.get(pubKey)?.getNonce();
  console.log(lastNonce);

  client.mutate({
    signer: pubKey,
    receiver: "smart-index",
    actions: [
      {
        kind: "call",
        method_name: "indexBlock",
        args: ["hello", "world"],
      },
    ],
  });
};

main();
