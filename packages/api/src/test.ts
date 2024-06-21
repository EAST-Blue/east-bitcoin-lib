import Client from ".";

const main = async () => {
  const client = new Client({
    network: "regtest",
    rpcUrl: "http://127.0.0.1:3000",
  });

  const pubKey = await client.requestSignIn(
    "7c67c815e1c4a25fe70d95aad9440b682bdcbe6e2baf34d460966e605705ea8e"
  );

  const mutateResp = await client.mutate({
    signer: pubKey,
    receiver: "smart-index",
    actions: [
      {
        kind: "call",
        function_name: "indexBlock",
        args: ["hello", "world"],
      },
    ],
  });
  console.log(mutateResp);

  const queryResp = await client.query({
    receiver: "smart-index",
    function_name: "getBlock",
    args: ["hello", "world"],
  });

  console.log(queryResp);
};

main();
