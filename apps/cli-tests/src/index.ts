import { BElectrsAPI } from "@east-bitcoin-lib/sdk";

async function main() {
  const api = new BElectrsAPI({
    network: "mainnet",
  });

  const utxos = await api.getUTXOs(
    "tb1qcddsra3dk7fqgxfymwc5h47cyxm96cnw29aqh4",
  );
  console.log(utxos);
}

main();
