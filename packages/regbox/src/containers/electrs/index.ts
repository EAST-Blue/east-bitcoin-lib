import { ContainerAbstract } from "..";
import configs from "../../configs";
import { sleep } from "../../utils/utils";

export type ElectrsContainerArgs = {
  socketPath: string;
  printLog: boolean;
};

export class ElectrsContainer extends ContainerAbstract {
  constructor({ socketPath, printLog }: ElectrsContainerArgs) {
    super({
      name: configs.electrs.name,
      image: "haffjjj/blockstream-electrs:v1.0.0",
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
      console.info(`info.checking ${this.name} `);
      await sleep(1000);
      try {
        await this.execCommand(["curl", "-s", "-S", "localhost:3002/mempool"]);
        return;
      } catch (error) {
        console.log(error);
      }
    }
  }

  async waitUntilReady() {
    await this.checkServerUntilReady();
  }
}
