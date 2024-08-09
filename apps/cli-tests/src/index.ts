import {
  API,
  Address,
  BElectrsAPI,
  P2shAutoUtxo,
  P2trAutoUtxo,
  P2trScript,
  P2wpkhAutoUtxo,
  PSBT,
  Script,
  Wallet,
  OpReturn,
} from "@east-bitcoin-lib/sdk";

const bitcoinaApi = new BElectrsAPI({
  network: "regtest",
  apiUrl: {
    regtest: "http://localhost:3002",
  },
});
const api = new API({
  network: "regtest",
  bitcoin: bitcoinaApi,
});

const wallet = new Wallet({
  mnemonic:
    "final chat okay post increase install picnic library modify legend soap cube",
  network: "regtest",
});

async function psbtBuilderP2tr() {
  const p2tr = wallet.p2tr(0);
  console.log({ address: p2tr.address });

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
  const lockScripts = [
    Script.encodeNumber(1000),
    Script.OP_ADD,
    Script.encodeNumber(2000),
    Script.OP_EQUAL,
  ];
  const unlockScripts = [Script.encodeNumber(1000)];

  const p2sh = wallet.p2sh(lockScripts);
  console.log({ address: p2sh.address });

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
  p.inputs.forEach((_, i) => {
    p.finalizeScriptInput(i, unlockScripts);
  });

  console.log({ hex: p.toHex(true) });
}

async function psbtBuilderP2wpkhOpReturn() {
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

async function psbtBuilderP2trRuneCommit() {
  const script = (internalPubkey: Buffer): P2trScript => {
    const runeCommit = Script.compile([
      internalPubkey,
      Script.OP_CHECKSIG,
      Script.OP_FALSE,
      Script.OP_IF,
      Buffer.from("62ef3ccef7027413e781", "hex"),
      Script.OP_ENDIF,
    ]);
    const recovery = Script.compile([internalPubkey, Script.OP_CHECKSIG]);

    return {
      taptree: [
        {
          output: Script.compile(runeCommit),
        },
        {
          output: Script.compile(recovery),
        },
      ],
      redeem: {
        output: runeCommit,
        redeemVersion: 192,
      },
    };
  };

  const p2tr = wallet.p2trScript(0, script);
  console.log({ address: p2tr.address });

  const p = new PSBT({
    network: "regtest",
    inputs: [],
    outputs: [
      {
        output: Address.fromString("2N8ruoh7CGSycEnSx1nhi9C2UVYdUf89T7C"),
        value: 600,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString(p2tr.address),
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

async function psbtBuilderP2trOrdinalInscriptionText() {
  const script = (internalPubkey: Buffer): P2trScript => {
    const inscription = Script.compile([
      internalPubkey,
      Script.OP_CHECKSIG,
      Script.OP_FALSE,
      Script.OP_IF,
      Script.encodeUTF8("ord"),
      Script.OP_1,
      Script.encodeUTF8("text/plain;charset=utf-8"),
      Script.OP_0,
      Script.encodeUTF8("Nasi Padang Guguak"),
      Script.OP_ENDIF,
    ]);
    const recovery = Script.compile([internalPubkey, Script.OP_CHECKSIG]);

    return {
      taptree: [
        {
          output: Script.compile(inscription),
        },
        {
          output: Script.compile(recovery),
        },
      ],
      redeem: {
        output: inscription,
        redeemVersion: 192,
      },
    };
  };

  const p2tr = wallet.p2trScript(0, script);
  // inscription commit address
  console.log({ address: p2tr.address });

  const p = new PSBT({
    network: "regtest",
    inputs: [],
    outputs: [
      {
        // this will become the owner of the insription
        output: Address.fromString("2N8ruoh7CGSycEnSx1nhi9C2UVYdUf89T7C"),
        value: 600,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString(p2tr.address),
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

async function psbtBuilderP2trOrdinalInscriptionImage() {
  const imageBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKBAMAAAB/HNKOAAAAD1BMVEVbHx6uTEHvrJjbjHrLbFynATLxAAAAIUlEQVQI12NgwASMjgJAUljJEMh0VnIEslmUQCKMxqjqADLDAcrdvFBmAAAAAElFTkSuQmCC";

  const imageBuffer = Buffer.from(imageBase64, "base64");

  const script = (internalPubkey: Buffer): P2trScript => {
    const inscription = Script.compile([
      internalPubkey,
      Script.OP_CHECKSIG,
      Script.OP_FALSE,
      Script.OP_IF,
      Script.encodeUTF8("ord"),
      Script.OP_1,
      Script.encodeUTF8("image/png"),
      Script.OP_0,
      imageBuffer,
      Script.OP_ENDIF,
    ]);
    const recovery = Script.compile([internalPubkey, Script.OP_CHECKSIG]);

    return {
      taptree: [
        {
          output: Script.compile(inscription),
        },
        {
          output: Script.compile(recovery),
        },
      ],
      redeem: {
        output: inscription,
        redeemVersion: 192,
      },
    };
  };

  const p2tr = wallet.p2trScript(0, script);
  // inscription commit address
  console.log({ address: p2tr.address });

  const p = new PSBT({
    network: "regtest",
    inputs: [],
    outputs: [
      {
        // this will become the owner of the insription
        output: Address.fromString("2N8ruoh7CGSycEnSx1nhi9C2UVYdUf89T7C"),
        value: 600,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString(p2tr.address),
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

async function main() {
  // psbtBuilderP2tr();
  // psbtBuilderP2sh();
  // psbtBuilderP2wpkhOpReturn();
  // psbtBuilderP2trRuneCommit();
  // psbtBuilderP2trOrdinalInscriptionText();
  psbtBuilderP2trOrdinalInscriptionImage();
}

main();
