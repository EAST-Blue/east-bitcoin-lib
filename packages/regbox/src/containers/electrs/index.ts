import chalk from "chalk";
import { ContainerAbstract } from "..";
import { sleep } from "../../utils";
import { ElectrsContainerParams } from "./types";

export class ElectrsContainer extends ContainerAbstract {
  constructor({ config }: ElectrsContainerParams) {
    super({
      name: config.electrs.name,
      image: config.electrs.image,
      cmd: [
        "-vvvv",
        "--jsonrpc-import",
        "--network=regtest",
        `--daemon-rpc-addr=${config.bitcoin.name}:18443`,
        `--cookie=${config.bitcoin.user}:${config.bitcoin.password}`,
        "--lightmode=1",
        "--index-unspendables=1",
        "--utxos-limit=100000",
        "--electrum-txs-limit=100000",
        "--http-addr=0.0.0.0:3002",
        "--electrum-rpc-addr=0.0.0.0:60401",
        "--cors=*",
      ],
      env: [],
      networkName: config.container.network,
      portMappings: [
        {
          host: config.electrs.restPort,
          container: "3002/tcp",
        },
        {
          host: config.electrs.rpcPort,
          container: "60401/tcp",
        },
      ],
      volumeMappings: [
        {
          source: `${config.electrs.name}_data`,
          target: "/data/db",
        },
      ],
      socketPath: config.container.socketPath,
      printLog: config.container.printLog,
    });
  }

  private async checkServerUntilReady() {
    while (true) {
      this.logger(`checking ${this.name} `);
      await sleep(1000);
      try {
        await this.execCommand(["curl", "-s", "-S", "localhost:3002/mempool"]);
        return;
      } catch { }
    }
  }

  logger(log: string) {
    console.log(chalk.blue(log));
  }

  async waitUntilReady() {
    await this.checkServerUntilReady();
  }
}
