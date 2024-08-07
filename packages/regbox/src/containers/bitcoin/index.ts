import chalk from "chalk";
import { ContainerAbstract } from "..";
import { sleep } from "../../utils";
import { BitcoinContainerParams, GenerateAddress } from "./types";
import { Config } from "../../types";

export class BitcoinContainer extends ContainerAbstract {
  config: Config;
  execQueue?: any;

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
      volumeMappings: [
        {
          source: `${config.bitcoin.name}_data`,
          target: "/home/bitcoin/.bitcoin",
        },
      ],
      socketPath: config.container.socketPath,
      printLog: config.container.printLog,
    });

    this.config = config;
  }

  private async execBitcoinCli(cmd: string[]) {
    // TODO: tech debt, this package (regbox) should be esm type
    if (!this.execQueue) {
      const PQueue = await import("p-queue");
      this.execQueue = new PQueue.default({ concurrency: 1 });
    }

    return (await this.execQueue.add(() => {
      return this.execCommand([
        "bitcoin-cli",
        "-regtest",
        `-rpcuser=${this.config.bitcoin.user}`,
        `-rpcpassword=${this.config.bitcoin.password}`,
        ...cmd,
      ]);
    })) as Promise<string>;
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
    const preloadAddresses = this.config.preloadAddresses || [];
    for (const address of preloadAddresses) {
      await this.sendToAddress(address, 1);
    }
  }

  async generateBlocks(nblocks: number) {
    this.logger(`generating ${nblocks} blocks`);
    const result = await this.execBitcoinCli(["-generate", nblocks.toString()]);
    return JSON.parse(result) as GenerateAddress;
  }

  async getBalance() {
    this.logger(`getting the balance`);
    const result = await this.execBitcoinCli(["getbalance"]);
    return parseInt(result, 10);
  }

  async sendToAddress(address: string, amount: number) {
    this.logger(`send ${amount} btc to ${address}`);
    await this.execBitcoinCli(["sendtoaddress", address, amount.toString()]);
  }

  private async loadWallet() {
    const walletDir = JSON.parse(
      await this.execBitcoinCli(["listwalletdir"]),
    ) as {
      wallets: { name: string }[];
    };
    const isWalletExist = walletDir.wallets.find((wallet) => {
      return wallet.name === this.config.bitcoin.wallet;
    });

    if (isWalletExist) {
      this.logger(`use exising wallet: ${this.config.bitcoin.wallet}`);
      await this.execBitcoinCli(["loadwallet", this.config.bitcoin.wallet]);
    } else {
      this.logger(`creating new  wallet: ${this.config.bitcoin.wallet}`);
      await this.execBitcoinCli(["createwallet", this.config.bitcoin.wallet]);
    }
  }

  logger(log: string) {
    console.log(chalk.yellow(log));
  }

  async waitUntilReady() {
    await this.checkNodeUntilReady();

    await this.loadWallet();

    // miner should wait until the next 100 block to spend the balance.
    // this should give 50 * 10 BTC to the wallet.
    this.logger(`generating first 110 blocks`);
    await this.generateBlocks(110);

    // send to Alice, Bob addresses
    await this.seedPreloadAddresses();
    await this.generateBlocks(1);
  }
}
