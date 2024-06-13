import { BitcoinContainer } from "./containers";
import { sleep } from "./utils/utils";

export * from "./containers";

async function main() {
  const bitcoinContainer = new BitcoinContainer({
    socketPath: "/run/user/1000/podman/podman.sock",
    printLog: false,
  });
  await bitcoinContainer.start();

  await sleep(2000);

  try {
    await bitcoinContainer.execCommand([
      "bitcoin-cli",
      "-regtest",
      "-rpcuser=east",
      "-rpcpassword=east",
      "createwallet",
      "east",
    ]);
    await bitcoinContainer.execCommand([
      "bitcoin-cli",
      "-regtest",
      "-rpcuser=east",
      "-rpcpassword=east",
      "-generate",
      "1",
    ]);
    await bitcoinContainer.execCommand([
      "bitcoin-cli",
      "-regtest",
      "-rpcuser=east",
      "-rpcpassword=east",
      "-generate",
      "1000",
    ]);
    await bitcoinContainer.execCommand([
      "bitcoin-cli",
      "-regtest",
      "-rpcuser=east",
      "-rpcpassword=east",
      "-generate",
      "1",
    ]);
  } catch (error) {
    console.log(error);
  }

  await sleep(2000);

  await bitcoinContainer.shutdown();
  process.on("SIGINT", async function () {
    await bitcoinContainer.shutdown();
  });
}

main();
