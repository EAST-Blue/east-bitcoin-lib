import express from "express";
import cors from "cors";
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
  shutdownContainers,
  startContainers,
} from "./utils";
import { generateValidator, sendToAddressValidator } from "./validator/server";

const server = express();
server.use(cors());
server.use(express.json());

// TODO BUG:
// - that name is already in use -> duplicate container name

async function main() {
  const bitcoinContainer = new BitcoinContainer({
    socketPath: configs.docker.socketPath,
    printLog: configs.docker.printLog,
  });

  const electrsContainer = new ElectrsContainer({
    socketPath: configs.docker.socketPath,
    printLog: configs.docker.printLog,
  });

  const explorerContainer = new ExplorerContainer({
    socketPath: configs.docker.socketPath,
    printLog: configs.docker.printLog,
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

main();

export * from "./containers";
export * from "./utils/utils";
export * from "./configs";
