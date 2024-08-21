import {
  API,
  Address,
  BElectrsAPI,
  P2trAutoUtxo,
  P2trScript,
  PSBT,
  Script,
  Wallet,
  RegboxAPI,
} from "@east-bitcoin-lib/sdk";
import { bitcoin } from "bitcoinjs-lib/src/networks";

const walletApi = new BElectrsAPI({
  network: "regtest",
  apiUrl: {
    regtest: "http://localhost:3002",
  },
});

const api = new API({
  network: "regtest",
  bitcoin: walletApi,
});

const regboxApi = new RegboxAPI({ url: "http://localhost:8080" });

const wallet = new Wallet({
  mnemonic:
    "final chat okay post increase install picnic library modify legend soap cube",
  network: "regtest",
});

// HELPER FUNCTIONS

// commit-reveal ordinal minting

async function mintInscription(script: (internalPubkey: Buffer) => P2trScript) {
  const p2tr = wallet.p2trScript(0, script);
  await regboxApi.getFaucet(p2tr.address, 0.000001);
  // inscription commit address
  console.log({ address: p2tr.address });

  const p = new PSBT({
    network: "regtest",
    inputs: [],
    outputs: [
      {
        // this will become the owner of the insription
        output: Address.fromString(wallet.p2wpkh(0).address),
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

  const txHash = await walletApi.brodcastTx(p.toHex(true));
  console.log({ hex: p.toHex(true), txHash: txHash });
}

async function mintInscriptionText() {
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

  mintInscription(script)
}

async function mintInscriptionImage() {
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

  mintInscription(script);
}

async function main() {
  console.log("p2wpkh address: ", wallet.p2wpkh(0).address);

  // normal ordinal
  mintInscriptionText();
  // mintInscriptionImage();

  // cursed ordinal (unrecognized even field)


  // parent ordinal

  // delegate ordinal

  // pointer ordinal (2 ordinal in one tx)

  // transfer ordinal
}

main();
