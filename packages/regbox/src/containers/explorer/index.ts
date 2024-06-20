import chalk from "chalk";
import { ContainerAbstract } from "..";
import configs from "../../configs";
import { ExplorerContainerArgs } from "./types";

export class ExplorerContainer extends ContainerAbstract {
  constructor({ socketPath, printLog }: ExplorerContainerArgs) {
    super({
      name: configs.explorer.name,
      image: configs.explorer.image,
      cmd: [],
      env: [
        "BTCEXP_HOST=0.0.0.0",
        "BTCEXP_PORT=3002",
        `BTCEXP_BITCOIND_URI=bitcoin://${configs.bitcoin.user}:${configs.bitcoin.password}@${configs.bitcoin.name}:18443?timeout=10000`,
        "BTCEXP_ADDRESS_API=electrum",
        `BTCEXP_ELECTRUM_SERVERS=tcp://${configs.electrs.name}:60401`,
        "BTCEXP_ELECTRUM_TXINDEX=true",
      ],
      networkName: configs.docker.network,
      portMappings: [
        {
          host: configs.explorer.port,
          container: "3002/tcp",
        },
      ],
      socketPath,
      printLog,
    });
  }

  logger(log: string) {
    console.log(chalk.magenta(log));
  }

  async waitUntilReady() { }
}
