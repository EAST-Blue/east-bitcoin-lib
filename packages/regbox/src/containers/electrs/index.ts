import chalk from "chalk";
import { ContainerAbstract } from "..";
import configs from "../../configs";
import { sleep } from "../../utils";
import { ElectrsContainerArgs } from "./types";

export class ElectrsContainer extends ContainerAbstract {
  constructor({ socketPath, printLog }: ElectrsContainerArgs) {
    super({
      name: configs.electrs.name,
      image: configs.electrs.image,
      cmd: [
        "-vvvv",
        "--jsonrpc-import",
        "--network=regtest",
        `--daemon-rpc-addr=${configs.bitcoin.name}:18443`,
        `--cookie=${configs.bitcoin.user}:${configs.bitcoin.password}`,
        "--lightmode=1",
        "--index-unspendables=1",
        "--utxos-limit=100000",
        "--electrum-txs-limit=100000",
        "--http-addr=0.0.0.0:3002",
        "--electrum-rpc-addr=0.0.0.0:60401",
        "--cors=*",
      ],
      env: [],
      networkName: configs.docker.network,
      portMappings: [
        {
          host: configs.electrs.restPort,
          container: "3002/tcp",
        },
        {
          host: configs.electrs.rpcPort,
          container: "60401/tcp",
        },
      ],
      socketPath,
      printLog,
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
