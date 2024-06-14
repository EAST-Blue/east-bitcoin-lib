import { BitcoinContainer, ElectrsContainer } from "./containers";
import { ExplorerContainer } from "./containers/explorer";
import { sleep } from "./utils/utils";

async function main() {
  const socketPath = "/run/user/1000/podman/podman.sock";

  const bitcoinContainer = new BitcoinContainer({
    socketPath,
    printLog: false,
  });
  await bitcoinContainer.start();

  const electrsContainer = new ElectrsContainer({
    socketPath,
    printLog: false,
  });
  await electrsContainer.start();

  const explorerContainer = new ExplorerContainer({
    socketPath,
    printLog: false,
  });
  await explorerContainer.start();

  process.on("SIGINT", async function () {
    await bitcoinContainer.shutdown();
    await electrsContainer.shutdown();
    await explorerContainer.shutdown();

    process.exit(1);
  });

  await sleep(100000);
  await bitcoinContainer.shutdown();
  await electrsContainer.shutdown();
  await explorerContainer.shutdown();
}

main();

export * from "./containers";
