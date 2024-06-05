import {
  API,
  Address,
  BElectrsAPI,
  OrdAPI,
  P2shAutoUtxo,
  P2trAutoUtxo,
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

async function psbtBuilderP2tr() {
  const wallet = new Wallet({
    mnemonic:
      "final chat okay post increase install picnic library modify legend soap cube",
    network: "regtest",
  });
  const p2tr = wallet.p2tr(0);

  // TODO: add minimum input and output value
  const p = new PSBT({
    network: "regtest",
    inputs: [],
    outputs: [
      {
        output: Address.fromString("2N8ruoh7CGSycEnSx1nhi9C2UVYdUf89T7C"),
        value: 0.5 * 10 ** 8,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString("2N8ruoh7CGSycEnSx1nhi9C2UVYdUf89T7C"),
    autoUtxo: {
      api,
      from: new P2trAutoUtxo(p2tr),
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
    network: "regtest",
  });

  const lockScripts = [
    Script.encodeNumber(1000),
    Script.OP_ADD,
    Script.encodeNumber(2000),
    Script.OP_EQUAL,
  ];
  const unlockScripts = [Script.encodeNumber(1000)];

  const p2sh = wallet.p2sh(lockScripts);

  const p = new PSBT({
    network: "regtest",
    inputs: [],
    outputs: [
      {
        output: Address.fromString(p2sh.address),
        value: 0.1 * 10 ** 8,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString(p2sh.address),
    autoUtxo: {
      api,
      from: new P2shAutoUtxo({
        address: p2sh.address,
        redeemScript: p2sh.redeemScript,
        unlockScript: Script.compile(unlockScripts),
      }),
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
  // psbtBuilderP2tr();
  psbtBuilderP2sh();
}

main();
