import {
  API,
  Address,
  BElectrsAPI,
  OrdAPI,
  PSBT,
  Wallet,
} from "@east-bitcoin-lib/sdk";

function newWallet() {
  const wallet = new Wallet({
    mnemonic:
      "final chat okay post increase install picnic library modify legend soap cube",
    network: "regtest",
  });
  const index = 0;

  const p2pkh = wallet.p2pkh(index);
  const p2wpkh = wallet.p2wpkh(index);
  const p2tr = wallet.p2tr(index);

  return {
    p2pkh,
    p2wpkh,
    p2tr,
  };
}

async function psbtBuilder() {
  const wallet = newWallet();
  const p2pkh = wallet.p2pkh;
  const p2tr = wallet.p2tr;

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
        output: Address.fromString(p2tr.address),
        value: 0.5 * 10 ** 8,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString(p2pkh.address),
    utxoSelect: {
      api,
      address: Address.fromString(p2tr.address),
      pubkey: p2tr.keypair.publicKey,
    },
  });

  await p.build();
  const psbt = p.toPSBT();

  psbt.signInput(0, p2tr.keypair);
  const hex = psbt.finalizeAllInputs().extractTransaction().toHex();

  console.log({ hex });
}

async function main() {
  psbtBuilder();
}

main();
