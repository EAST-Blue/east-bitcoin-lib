import chalk from "chalk";
import { ContainerAbstract } from "..";
import { ExplorerContainerParams } from "./types";

export class ExplorerContainer extends ContainerAbstract {
  constructor({ config }: ExplorerContainerParams) {
    super({
      name: config.explorer.name,
      image: config.explorer.image,
      cmd: [],
      env: [
        "BTCEXP_HOST=0.0.0.0",
        "BTCEXP_PORT=3002",
        `BTCEXP_BITCOIND_URI=bitcoin://${config.bitcoin.user}:${config.bitcoin.password}@${config.bitcoin.name}:18443?timeout=10000`,
        "BTCEXP_ADDRESS_API=electrum",
        `BTCEXP_ELECTRUM_SERVERS=tcp://${config.electrs.name}:60401`,
        "BTCEXP_ELECTRUM_TXINDEX=true",
      ],
      networkName: config.container.network,
      portMappings: [
        {
          host: config.explorer.port,
          container: "3002/tcp",
        },
      ],
      socketPath: config.container.socketPath,
      printLog: config.container.printLog,
    });
  }

  logger(log: string) {
    console.log(chalk.magenta(log));
  }

  async waitUntilReady() { }
}
