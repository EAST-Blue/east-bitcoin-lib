import { ContainerAbstract } from "..";

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
        "-rpcuser=east",
        "-rpcpassword=east",
        "-fallbackfee=0.00001",
      ],
      portMappings: [
        {
          host: "18443",
          container: "18443/tcp",
        },
      ],
      socketPath,
      printLog,
    });
  }

  async waitUntilReady() {
    return;
  }
}
