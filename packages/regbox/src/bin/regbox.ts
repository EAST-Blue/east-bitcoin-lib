#!/usr/bin/env node

import { Command } from "commander";
import { regbox } from "..";
import { parseArgToNumber } from "../utils";

function main() {
  const program = new Command();

  program
    .name("regbox")
    .description("East bitcoin regtest box")
    .version("0.0.1");

  program
    .command("start")
    .description("Start the regbox")
    .option(
      "-s, --socket <path>",
      "the docker socket path",
      "/var/run/docker.sock",
    )
    .option("-l, --log", "print containers logs", false)
    .option("--bitcoin-rpc-port <number>", "bitcoin rpc port", "18443")
    .option("--bitcoin-peer-port <port>", "bitcoin peer port", "18444")
    .option("--electrs-rpc-port <port>", "electrs rpc port (electrum)", "60401")
    .option(
      "--electrs-rest-port <port>",
      "electrs rest port (blockstream rest)",
      "3002",
    )
    .option("--explorer-port <port>", "explorer port", "3000")
    .action((opts) => {
      const config = {
        server: {
          port: "8080",
        },
        container: {
          socketPath: opts.socket as string,
          printLog: opts.log as boolean,
          network: "east_regbox",
        },
        bitcoin: {
          name: "east_bitcoin_node",
          image: "docker.io/ruimarinho/bitcoin-core:24",
          user: "east",
          password: "east",
          wallet: "east",
          rpcPort: parseArgToNumber(opts.bitcoinRpcPort).toString(),
          peerPort: parseArgToNumber(opts.bitcoinPeerPort).toString(),
        },
        electrs: {
          name: "east_electrs",
          image: "docker.io/eastbluehq/blockstream-electrs:v1.0.1",
          rpcPort: parseArgToNumber(opts.electrsRpcPort).toString(),
          restPort: parseArgToNumber(opts.electrsRestPort).toString(),
        },
        explorer: {
          name: "east_explorer",
          image: "docker.io/eastbluehq/janoside-btc-rpc-explorer:v3.4.0",
          port: parseArgToNumber(opts.explorerPort).toString(),
        },
      };

      regbox(config);
    });

  program.parse();
}

main();
