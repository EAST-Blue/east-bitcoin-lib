import { BElectrsAPI, P2pkhUtxo } from "@east-bitcoin-lib/sdk";

async function main() {
  const api = new BElectrsAPI({
    network: "testnet",
  });

  const utxos = await api.getUTXOs(
    "tb1qcddsra3dk7fqgxfymwc5h47cyxm96cnw29aqh4",
  );

  const p2pkhUtxos = utxos.map((utxo) => {
    return P2pkhUtxo.fromBitcoinUTXO(api, utxo);
  });

  console.log(await Promise.all(p2pkhUtxos));
}

main();
