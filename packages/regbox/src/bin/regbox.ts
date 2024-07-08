#!/usr/bin/env node

import { Command } from "commander";
import { Config, regbox } from "..";
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
      "--server-max-btc-to-send <number>",
      "server maximum btc to send (faucet)",
      "0.1",
    )
    .option(
      "--server-auto-mine-interval <number>",
      "server auto mine interval (generate new block) in second",
      "10",
    )
    .option("--server-rate-limit", "set server rate limit for the apis", false)
    .option(
      "--electrs-rest-port <port>",
      "electrs rest port (blockstream rest)",
      "3002",
    )
    .option("--explorer-port <port>", "explorer port", "3000")
    .action((opts) => {
      const config: Config = {
        server: {
          port: "8080",
          maxBTCToSend: parseArgToNumber(opts.serverMaxBtcToSend),
          autoMineInterval: parseArgToNumber(opts.serverAutoMineInterval),
          rateLimit: opts.serverRateLimit as boolean,
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
          name: "east_bitcoin_electrs",
          image: "docker.io/eastbluehq/blockstream-electrs:v1.0.1",
          rpcPort: parseArgToNumber(opts.electrsRpcPort).toString(),
          restPort: parseArgToNumber(opts.electrsRestPort).toString(),
        },
        explorer: {
          name: "east_bitcoin_explorer",
          image: "docker.io/eastbluehq/janoside-btc-rpc-explorer:v3.4.0",
          port: parseArgToNumber(opts.explorerPort).toString(),
        },
        preloadAddresses: [
          "mrfaXzS5GkffJ7w7aHqheqTi81CGAgW3QL",
          "2N7XtNcP6xr4ZDCksqP1QvU9FyfaBXh2VGG",
          "bcrt1q3a34qdsw4dd7ye4fdvzut88tcjgz76d8gkjqdd",
          "bcrt1pxc8kgrxdlzvclef9fnfd7nslmval2xlgg30nxw06hl86j4lml50sauyyat",
          "n4o6eQLiDk8S4Y75aqxeBqhW3jXa9VWkXM",
          "2NF1x6SNoZRbtAYT1hGNwZk7cuAHYsguU3p",
          "bcrt1q63062x9c98g025gttswwpmjk49wcysk5jeh4pd",
          "bcrt1pny8rwj0j4xnlgmqkx8hqmf0tdx7zdh5y0u7w0te65j79n00a584sxupumd",
        ],
      };

      regbox(config);
    });

  program.parse();
}

main();
