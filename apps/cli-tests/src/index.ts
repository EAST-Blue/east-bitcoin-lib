import { ECPairFactory } from "ecpair";
import { API, Address, BElectrsAPI, OrdAPI, PSBT } from "@east-bitcoin-lib/sdk";
import * as bitcoinjs from "bitcoinjs-lib";

const ECpair = ECPairFactory(require("tiny-secp256k1"));
const keypair = ECpair.fromWIF(
  "Kym6MbkzqMpvKTeTEreBLYk4UeHTEnwBDG5NnGd96aAm6G23Gcms",
);
const payment = bitcoinjs.payments.p2pkh({
  pubkey: keypair.publicKey,
  network: bitcoinjs.networks.regtest,
});

async function main() {
  const bitcoinaApi = new BElectrsAPI({
    network: "regtest",
    apiUrl: {
      regtest: "http://13.229.210.197:3000",
    },
  });
  const api = new API({
    network: "regtest",
    bitcoin: bitcoinaApi,
    ord: new OrdAPI({ network: "regtest" }), // this still dummy
  });

  // TODO: add minimum input and output value
  const p = new PSBT({
    network: "regtest",
    inputs: [],
    outputs: [
      {
        output: Address.fromString(payment.address!),
        value: 1000,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString(payment.address!),
    utxoSelect: {
      api,
      address: Address.fromString(payment.address!),
    },
  });

  await p.build();
  const psbt = p.toPSBT();

  psbt.signInput(0, keypair);
  const hex = psbt.finalizeAllInputs().extractTransaction().toHex();

  console.log({ hex });
}

main();
