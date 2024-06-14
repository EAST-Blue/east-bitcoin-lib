import { ContainerAbstract } from "..";
import configs from "../../configs";

export type ExplorerContainerArgs = {
  socketPath: string;
  printLog: boolean;
};

export class ExplorerContainer extends ContainerAbstract {
  constructor({ socketPath, printLog }: ExplorerContainerArgs) {
    super({
      name: "explorer server",
      image: "haffjjj/janoside-btc-rpc-explorer:v3.4.0",
      cmd: [],
      env: [
        "BTCEXP_HOST=0.0.0.0",
        "BTCEXP_PORT=3002",
        `BTCEXP_BITCOIND_URI=bitcoin://${configs.bitcoin.user}:${configs.bitcoin.password}@192.168.1.29:18443?timeout=10000`,
        "BTCEXP_ADDRESS_API=electrum",
        "BTCEXP_ELECTRUM_SERVERS=tcp://192.168.1.29:60401",
        "BTCEXP_ELECTRUM_TXINDEX=true",
      ],
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

  async waitUntilReady() {}
}
