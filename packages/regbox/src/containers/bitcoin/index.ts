import { ContainerAbstract } from "..";
import configs from "../../configs";
import { sleep } from "../../utils/utils";

export type BitcoinContainerArgs = {
  socketPath: string;
  printLog: boolean;
};

export class BitcoinContainer extends ContainerAbstract {
  constructor({ socketPath, printLog }: BitcoinContainerArgs) {
    super({
      name: "bitcoin regtest node",
      image: "ruimarinho/bitcoin-core:24-alpine",
      cmd: [
        "-txindex=1",
        "-regtest=1",
        "-rpcallowip=0.0.0.0/0",
        "-rpcbind=0.0.0.0",
        `-rpcuser=${configs.bitcoin.user}`,
        `-rpcpassword=${configs.bitcoin.password}`,
        "-fallbackfee=0.00001",
      ],
      env: [],
      portMappings: [
        {
          host: configs.bitcoin.port,
          container: "18443/tcp",
        },
      ],
      socketPath,
      printLog,
    });
  }

  private async execBitcoinCli(cmd: string[]) {
    return this.execCommand([
      "bitcoin-cli",
      "-regtest",
      `-rpcuser=${configs.bitcoin.user}`,
      `-rpcpassword=${configs.bitcoin.password}`,
      ...cmd,
    ]);
  }

  private async checkNodeUntilReady() {
    while (true) {
      console.info(`info.checking ${this.name} `);
      await sleep(1000);
      try {
        await this.execBitcoinCli(["getrpcinfo"]);
        return;
      } catch {}
    }
  }

  async waitUntilReady() {
    await this.checkNodeUntilReady();

    console.info(`info.creating initial wallet: ${configs.bitcoin.wallet}`);
    await this.execBitcoinCli(["createwallet", configs.bitcoin.wallet]);

    console.info(`info.generating first 10 blocks`);
    await this.execBitcoinCli(["-generate", "10"]);
  }
}
