import express from "express";
import cors from "cors";
import { Command } from "commander";
import {
  BitcoinContainer,
  ContainerAbstract,
  ElectrsContainer,
} from "./containers";
import { ExplorerContainer } from "./containers/explorer";
import configs from "./configs";
import {
  containersPortInfo,
  listeningPortInfo,
  parseArgToNumber,
  shutdownContainers,
  startContainers,
} from "./utils";
import { generateValidator, sendToAddressValidator } from "./validator/server";
import { Config } from "./types";

const server = express();
server.use(cors());
server.use(express.json());

// TODO BUG:
// - that name is already in use -> duplicate container name

async function regbox(config: Config) {
  const bitcoinContainer = new BitcoinContainer({
    config,
  });

  const electrsContainer = new ElectrsContainer({
    config,
  });

  const explorerContainer = new ExplorerContainer({
    config,
  });

  // this should be in order
  const containers: ContainerAbstract[] = [
    bitcoinContainer,
    electrsContainer,
    explorerContainer,
  ];

  process.on("SIGINT", async function() {
    await shutdownContainers(containers);

    process.exit(0);
  });

  try {
    await startContainers(containers);

    server.post("/generate", async (req, res) => {
      try {
        await generateValidator.validate(req.body, { strict: true });
        const nblocks = req.body.nblocks as number;

        const result = await bitcoinContainer.generateBlocks(nblocks);
        res.send(result);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    server.get("/get-balance", async (_, res) => {
      try {
        const result = await bitcoinContainer.getBalance();
        res.send({
          balance: result,
        });
      } catch (error) {
        res.status(500).send(error);
      }
    });

    server.post("/send-to-address", async (req, res) => {
      try {
        await sendToAddressValidator.validate(req.body, { strict: true });
        const address = req.body.address as string;
        const amount = req.body.amount as number;

        const result = await bitcoinContainer.sendToAddress(address, amount);
        res.send(result);
      } catch (error) {
        res.status(500).send(error);
      }
    });
  } catch (error) {
    console.error(error);

    await shutdownContainers(containers);
    process.exit(1);
  }

  const listen = server.listen(configs.server.port);
  listen.on("error", async (error) => {
    console.error(error);

    await shutdownContainers(containers);
    process.exit(1);
  });

  listen.on("listening", () => {
    listeningPortInfo([
      {
        name: "server",
        ports: [configs.server.port],
      },
      ...containersPortInfo(containers),
    ]);
  });
}

function main() {
  const program = new Command();

  program
    .name("east-regbox")
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

export * from "./containers";
export * from "./utils";
export * from "./configs";
