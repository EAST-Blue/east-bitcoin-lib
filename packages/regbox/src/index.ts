import express from "express";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import {
  BitcoinContainer,
  ContainerAbstract,
  ElectrsContainer,
} from "./containers";
import { ExplorerContainer } from "./containers/explorer";
import {
  cleanUpContainers,
  containersPortInfo,
  listeningPortInfo,
  shutdownContainers,
  startContainers,
} from "./utils";
import { generateValidator, sendToAddressValidator } from "./validator/server";
import { Config } from "./types";

const server = express();
server.use(cors());
server.use(express.json());

export async function regbox(config: Config) {
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
    await cleanUpContainers(containers);

    process.exit(0);
  });

  try {
    await cleanUpContainers(containers);
    await startContainers(containers);

    // auto mine/generate
    if (config.server.autoMineInterval > 0) {
      setInterval(async () => {
        try {
          await bitcoinContainer.generateBlocks(1);
        } catch { }
      }, config.server.autoMineInterval * 1000);
    }

    const serverLimiter = rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      limit: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute).
    });
    if (config.server.rateLimit) {
      server.use(serverLimiter);
    }

    server.post("/generate", async (req, res) => {
      try {
        await generateValidator.validate(req.body, { strict: true });
        const nblocks = req.body.nblocks as number;

        if (config.server.rateLimit && nblocks > 1) {
          res.status(400).send(`the nblocks value should be less than 1`);
          return;
        }

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

        if (config.server.rateLimit && amount > config.server.maxBTCToSend) {
          res
            .status(400)
            .send(
              `the amount value should be less than ${config.server.maxBTCToSend}`,
            );
          return;
        }

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

  const listen = server.listen(config.server.port);
  listen.on("error", async (error) => {
    console.error(error);

    await shutdownContainers(containers);
    process.exit(1);
  });

  listen.on("listening", () => {
    listeningPortInfo([
      {
        name: "server",
        ports: [config.server.port],
      },
      ...containersPortInfo(containers),
    ]);
  });
}

export * from "./containers";
export * from "./utils";
export * from "./types";
