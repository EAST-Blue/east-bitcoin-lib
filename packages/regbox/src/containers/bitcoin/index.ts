import chalk from "chalk";
import { ContainerAbstract } from "..";
import configs from "../../configs";
import { sleep } from "../../utils/utils";
import { BitcoinContainerArgs, GenerateAddress } from "./types";

export class BitcoinContainer extends ContainerAbstract {
  constructor({ socketPath, printLog }: BitcoinContainerArgs) {
    super({
      name: configs.bitcoin.name,
      image: configs.bitcoin.image,
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
      networkName: configs.docker.network,
      portMappings: [
        {
          host: configs.bitcoin.rpcPort,
          container: "18443/tcp",
        },
        {
          host: configs.bitcoin.peerPort,
          container: "18444/tcp",
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
    ]) as Promise<string>;
  }

  private async checkNodeUntilReady() {
    while (true) {
      this.logger(`checking ${this.name} `);
      await sleep(1000);
      try {
        await this.execBitcoinCli(["getrpcinfo"]);
        return;
      } catch { }
    }
  }

  async generateBlocks(nblocks: number) {
    const result = await this.execBitcoinCli(["-generate", nblocks.toString()]);
    return JSON.parse(result) as GenerateAddress;
  }

  async getBalance() {
    const result = await this.execBitcoinCli(["getbalance"]);
    return parseInt(result, 10);
  }

  async sendToAddress(address: string, amount: number) {
    await this.execBitcoinCli(["sendtoaddress", address, amount.toString()]);
  }

  logger(log: string) {
    console.log(chalk.yellow(log));
  }

  async waitUntilReady() {
    await this.checkNodeUntilReady();

    this.logger(`creating initial wallet: ${configs.bitcoin.wallet}`);
    await this.execBitcoinCli(["createwallet", configs.bitcoin.wallet]);

    // miner should wait until the next 100 block to spend the balance.
    // this should give 50 * 10 BTC to the wallet.
    this.logger(`generating first 110 blocks`);
    await this.generateBlocks(110);
  }
}
