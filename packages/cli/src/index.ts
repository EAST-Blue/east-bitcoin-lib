#!/usr/bin/env node

import { Command, Option } from "commander";
import Client from "@east-bitcoin-lib/api";
import { promises as fs } from "fs";
import {
  Action,
  borshActionSchema,
} from "@east-bitcoin-lib/api/dist/transaction/types";
import { sha256 } from "@east-bitcoin-lib/api/dist/utils";
import { bech32 } from "bech32";
import { serialize } from "borsh";
import retry from "async-retry";

function utf8ToHex(str: string) {
  return Array.from(str)
    .map((c) => {
      let bStr = c.charCodeAt(0).toString(16);
      if (bStr.length < 2) bStr = "0" + bStr;
      return bStr;
    })
    .join("");
}

function hexToUtf8(hexStr: string) {
    var s = ''
    for (var i = 0; i < hexStr.length; i+=2) {
        s += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16))
    }
    return decodeURIComponent(escape(s))
}

function main() {
  const program = new Command();

  program
    .name("east-cli")
    .description("East bitcoin cli")
    .version("0.0.1")
    .option(
      "-n, --network [NETWORK]",
      "Eastchain network environment e.g. mainnet, testnet, signet, regtest",
      "regtest"
    )
    .option(
      "-r, --rpc-url [RPC_URL]",
      "Eastchain RPC URL",
      "http://127.0.0.1:3000"
    )
    .addOption(
      new Option(
        "-p, --private-key [PRIVATE_KEY]",
        "Bitcoin private key, (env: BITCOIN_PRIVATE_KEY)"
      ).env("BITCOIN_PRIVATE_KEY")
    );

  const globalOptions = program.opts();

  program
    .command("call")
    .description("Call function on a smart index")
    .argument("<smart_index_address>")
    .argument("<function_name>")
    .argument("[args...]")
    .action(async (smartIndexAddress, functionName, args) => {
      const client = new Client({
        network: globalOptions.network,
        rpcUrl: globalOptions.rpcUrl,
      });

      const publicKey = await client.requestSignIn(globalOptions.privateKey);

      const action: Action = {
        kind: "call",
        function_name: functionName,
        args: args,
      }

      const txId = await client.mutate(
        {
          signer: publicKey,
          receiver: smartIndexAddress,
          actions: [action]
        }
      )

      console.log("Broadcasted! Tx Hash:", txId);

      await retry(
        async () => {
          const check = await client.query({
            function_name: "get_transaction",
            receiver: "",
            args: [txId],
          });
          if (check.result.result) {
            console.log("Transaction: ", JSON.parse(hexToUtf8(check.result.result)))
          }
        },
        {
          retries: 50,
        }
      );


    });

  program
    .command("deploy")
    .description("Deploy smart index")
    .argument("<file>", "WASM file to be deployed")
    .action(async (file, opts) => {
      const client = new Client({
        network: globalOptions.network,
        rpcUrl: globalOptions.rpcUrl,
      });

      const wasmFile = await fs.readFile(file, "hex");

      const publicKey = await client.requestSignIn(globalOptions.privateKey);

      const action: Action = {
        kind: "deploy",
        function_name: "",
        args: [wasmFile],
      };

      const txId = await client.mutate({
        signer: publicKey,
        receiver: "",
        actions: [action],
      });

      const actionsPackedByte = Buffer.from(
        serialize(borshActionSchema, action)
      );
      const actionWithPublicKey = Buffer.concat([
        actionsPackedByte,
        Buffer.from(publicKey, "hex"),
      ]);

      // const hash = await sha256(Buffer.from(publicKey, "hex"));
      const hash = await sha256(actionWithPublicKey);
      const smartIndexAddress = bech32
        .encode("idx", bech32.toWords(hash))
        .slice(0, 32);

      console.log("Broadcasted! Tx Hash:", txId);
      await retry(
        async () => {
          const check = await client.query({
            function_name: "get_smart_index_wasm",
            receiver: "",
            args: [smartIndexAddress],
          });
          if (check.result.result == wasmFile) {
            console.log("Smart Index Address: ", smartIndexAddress);
          } else {
            throw new Error("Tx not finished processing");
          }
        },
        {
          retries: 50,
        }
      );
    });

  program.parse();
}

main();
