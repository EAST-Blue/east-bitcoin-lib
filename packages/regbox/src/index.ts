import { BitcoinContainer, ElectrsContainer } from "./containers";
import { ExplorerContainer } from "./containers/explorer";
import { sleep } from "./utils/utils";

async function main() {
  const socketPath = "/run/user/1000/podman/podman.sock";
  const printLog = false;

  const bitcoinContainer = new BitcoinContainer({
    socketPath,
    printLog,
  });
  await bitcoinContainer.start();

  const electrsContainer = new ElectrsContainer({
    socketPath,
    printLog,
  });
  await electrsContainer.start();

  const explorerContainer = new ExplorerContainer({
    socketPath,
    printLog,
  });
  await explorerContainer.start();

  console.info(`info.regtest is ready`);
  console.log({
    bitcoin: bitcoinContainer.portMappings,
    electrs: electrsContainer.portMappings,
    explorer: explorerContainer.portMappings,
  });

  process.on("SIGINT", async function () {
    await bitcoinContainer.shutdown();
    await electrsContainer.shutdown();
    await explorerContainer.shutdown();

    process.exit(1);
  });

  // TODO: block process
  // this is temporary
  await sleep(1000000);
  await bitcoinContainer.shutdown();
  await electrsContainer.shutdown();
  await explorerContainer.shutdown();
}

main();

export * from "./containers";
