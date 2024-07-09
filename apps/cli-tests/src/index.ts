import {
  API,
  Address,
  BElectrsAPI,
  OrdAPI,
  P2shAutoUtxo,
  P2trAutoUtxo,
  P2wpkhAutoUtxo,
  PSBT,
  Script,
  Wallet,
} from "@east-bitcoin-lib/sdk";
import { OpReturn } from "@east-bitcoin-lib/sdk/dist/addresses/opReturn";

const bitcoinaApi = new BElectrsAPI({
  network: "regtest",
  apiUrl: {
    regtest: "http://localhost:3002",
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
  p.signAllInputs(p2tr.keypair);
  p.finalizeAllInputs();

  console.log({ hex: p.toHex(true) });
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
  p.finalizeScriptInput(0, unlockScripts);
  console.log({ hex: p.toHex(true) });
}

async function psbtBuilderP2wpkhOpReturn() {
  const wallet = new Wallet({
    network: "regtest",
    mnemonic:
      "final chat okay post increase install picnic library modify legend soap cube",
  });

  const p2wpkh = wallet.p2wpkh(0);
  console.log({ address: p2wpkh.address });

  const opReturnOutput = new OpReturn({
    dataScripts: [
      Script.encodeUTF8("HELLO_MOTHER_FVCKNG_WORLD_3000000000000000000"),
    ],
  });

  // TODO: add minimum input and output value
  const p = new PSBT({
    network: "regtest",
    inputs: [],
    outputs: [
      {
        output: Address.fromString("2N8ruoh7CGSycEnSx1nhi9C2UVYdUf89T7C"),
        value: 0.5 * 10 ** 8,
      },
      {
        output: opReturnOutput,
        value: 0,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString(p2wpkh.address),
    autoUtxo: {
      api,
      from: new P2wpkhAutoUtxo(p2wpkh),
    },
  });

  await p.build();
  p.signAllInputs(p2wpkh.keypair);
  p.finalizeAllInputs();

  console.log({ hex: p.toHex(true) });
}

async function main() {
  // psbtBuilderP2tr();
  // psbtBuilderP2sh();
  psbtBuilderP2wpkhOpReturn();
}

main();
