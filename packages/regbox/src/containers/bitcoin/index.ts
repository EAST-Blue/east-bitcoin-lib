import chalk from "chalk";
import { ContainerAbstract } from "..";
import { sleep } from "../../utils";
import { BitcoinContainerParams, GenerateAddress } from "./types";
import { Config } from "../../types";

export class BitcoinContainer extends ContainerAbstract {
  config: Config;

  constructor({ config }: BitcoinContainerParams) {
    super({
      name: config.bitcoin.name,
      image: config.bitcoin.image,
      cmd: [
        "-txindex=1",
        "-regtest=1",
        "-rpcallowip=0.0.0.0/0",
        "-rpcbind=0.0.0.0",
        `-rpcuser=${config.bitcoin.user}`,
        `-rpcpassword=${config.bitcoin.password}`,
        "-fallbackfee=0.00001",
      ],
      env: [],
      networkName: config.container.network,
      portMappings: [
        {
          host: config.bitcoin.rpcPort,
          container: "18443/tcp",
        },
        {
          host: config.bitcoin.peerPort,
          container: "18444/tcp",
        },
      ],
      socketPath: config.container.socketPath,
      printLog: config.container.printLog,
    });

    this.config = config;
  }

  private async execBitcoinCli(cmd: string[]) {
    return this.execCommand([
      "bitcoin-cli",
      "-regtest",
      `-rpcuser=${this.config.bitcoin.user}`,
      `-rpcpassword=${this.config.bitcoin.password}`,
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

  private async seedPreloadAddresses() {
    const preloadAddresses = this.config.preloadAddresses || []
    for (const address of preloadAddresses) {
      await this.sendToAddress(address, 1)
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

    this.logger(`creating initial wallet: ${this.config.bitcoin.wallet}`);
    await this.execBitcoinCli(["createwallet", this.config.bitcoin.wallet]);

    // miner should wait until the next 100 block to spend the balance.
    // this should give 50 * 10 BTC to the wallet.
    this.logger(`generating first 110 blocks`);
    await this.generateBlocks(110);

    // send to Alice, Bob addresses
    await this.seedPreloadAddresses()
    await this.generateBlocks(1)
  }
}
