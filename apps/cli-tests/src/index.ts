import {
  API,
  Address,
  BElectrsAPI,
  OrdAPI,
  PSBT,
  Script,
  Wallet,
} from "@east-bitcoin-lib/sdk";

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

async function psbtBuilderP2tr() {
  const wallet = newWallet();
  const p2pkh = wallet.p2pkh;
  const p2tr = wallet.p2tr;

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

  psbt.signAllInputs(p2tr.keypair);
  const hex = psbt.finalizeAllInputs().extractTransaction().toHex();
  console.log({ hex });
}

async function psbtBuilderP2sh() {
  const wallet = new Wallet({
    mnemonic:
      "final chat okay post increase install picnic library modify legend soap cube",
    network: "regtest",
  });

  const p2pkh = wallet.p2pkh(0);
  const p2pkhAddress = p2pkh.address;

  const lockScripts = [
    Script.OP_ADD,
    Script.encodeNumber(2000),
    Script.OP_EQUAL,
  ];
  const unlockScripts = [Script.encodeNumber(1000), Script.encodeNumber(1000)];

  const p2sh = wallet.p2sh(lockScripts);
  const p2shAddress = p2sh.address;

  const p = new PSBT({
    network: "regtest",
    inputs: [],
    outputs: [
      {
        output: Address.fromString(p2pkhAddress),
        value: 0.5 * 10 ** 8,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString(p2pkh.address),
    utxoSelect: {
      api,
      address: Address.fromString(p2shAddress),
      redeemScript: p2sh.redeemScript,
    },
  });

  await p.build();
  const psbt = p.toPSBT();

  const hex = psbt
    .finalizeInput(0, PSBT.finalScript(unlockScripts))
    .extractTransaction()
    .toHex();
  console.log({ hex });
}

async function main() {
  psbtBuilderP2sh();
}

main();
