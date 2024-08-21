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
  P2wpkhUtxo,
  P2wpkhAutoUtxo,
} from "@east-bitcoin-lib/sdk";
import { Input } from "@east-bitcoin-lib/sdk/dist/psbt/types";
import { BitcoinUTXO } from "@east-bitcoin-lib/sdk/dist/repositories/bitcoin/types";

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

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getInputsByOutpoints(
  address: string,
  outpoints: {
    hash: string;
    index: number;
  }[]
): Promise<Input[]> {
  const runeWallet1Utxos = await walletApi.getUTXOs(address);
  const utxoMap = new Map(
    runeWallet1Utxos.map((utxo) => {
      return [`${utxo.txid}:${utxo.vout}`, utxo];
    })
  );

  const utxos: BitcoinUTXO[] = [];
  for (const outpoint of outpoints) {
    const key = `${outpoint.hash}:${outpoint.index}`;
    if (utxoMap.has(key)) {
      utxos.push(utxoMap.get(key)!);
    }
  }

  if (outpoints.length !== utxos.length) {
    throw new Error("errors.outpoints and utxos length doesn't match");
  }

  const inputs = await Promise.all(
    utxos.map(async (utxo) => {
      return {
        utxo: await P2wpkhUtxo.fromBitcoinUTXO(utxo),
        value: utxo.value,
      };
    })
  );

  return inputs;
}

// commit-reveal ordinal minting

async function mintInscription(script: (internalPubkey: Buffer) => P2trScript) {
  const p2tr = wallet.p2trScript(0, script);
  await regboxApi.getFaucet(p2tr.address, 1);
  await regboxApi.generateBlock(1);
  await sleep(5000);

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
    changeOutput: Address.fromString(wallet.p2pkh(0).address),
    autoUtxo: {
      api,
      from: new P2trAutoUtxo(p2tr),
    },
  });

  await p.build();
  console.log(p);
  p.signAllInputs(p2tr.keypair);
  p.finalizeAllInputs();

  const txHash = await walletApi.brodcastTx(p.toHex(true));
  console.log({ hex: p.toHex(true), txHash: txHash });
  return txHash;
}

async function mintInscriptionText() {
  const script = (internalPubkey: Buffer): P2trScript => {
    const inscription = Script.compile([
      internalPubkey,
      Script.OP_CHECKSIG,
      Script.OP_FALSE,
      Script.OP_IF,
      Script.encodeUTF8("ord"),
      1,
      1, // OP_PUSHBYTES_1 1
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

  mintInscription(script);
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
      1,
      1, // OP_PUSHBYTES_1 1
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

  return mintInscription(script);
}

async function mintInscriptionCursedIncompleteField() {
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
      1, // OP_PUSHBYTES_1
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

  return mintInscription(script);
}

async function mintInscriptionCursedNotAtInput0() {
  // TODO
}

async function mintInscriptionCursedNotAtOffset0() {
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
      1, 1,
      Script.encodeUTF8("image/png"),
      1, 2,
      Buffer.from([251]),
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

  return mintInscription(script);
}

async function mintInscriptionCursedPushnum() {
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
      Script.OP_1, // this is pushnum
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

  return mintInscription(script);
}

async function mintInscriptionCursedStutter() {
  const imageBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKBAMAAAB/HNKOAAAAD1BMVEVbHx6uTEHvrJjbjHrLbFynATLxAAAAIUlEQVQI12NgwASMjgJAUljJEMh0VnIEslmUQCKMxqjqADLDAcrdvFBmAAAAAElFTkSuQmCC";

  const imageBuffer = Buffer.from(imageBase64, "base64");

  const script = (internalPubkey: Buffer): P2trScript => {
    const inscription = Script.compile([
      internalPubkey,
      Script.OP_CHECKSIG,
      Script.OP_FALSE,
      Script.OP_IF,
      Script.OP_FALSE,
      Script.OP_IF,
      Script.encodeUTF8("ord"),
      1,
      1,
      Script.encodeUTF8("image/png"),
      Script.OP_0,
      imageBuffer,
      Script.OP_ENDIF,
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

  return mintInscription(script);
}

async function mintInscriptionCursedDuplicateFields() {
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
      1,
      1,
      Script.encodeUTF8("image/png"),
      1,
      1,
      Script.encodeUTF8("image/jpeg"),
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

  return mintInscription(script);
}

async function mintAndTransferInscription() {
  const inscriptionTxHash = await mintInscriptionImage();

  const oldOwner = wallet.p2wpkh(0);
  const newOwner = wallet.p2wpkh(1);
  console.log("new owner", newOwner.address);

  const inputs = await getInputsByOutpoints(oldOwner.address, [
    { hash: inscriptionTxHash, index: 0 },
  ]);

  const p = new PSBT({
    network: "regtest",
    inputs: inputs,
    outputs: [
      {
        // this will become the owner of the insription
        output: Address.fromString(newOwner.address),
        value: 600,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString(oldOwner.address),
    autoUtxo: {
      api,
      from: new P2wpkhAutoUtxo(oldOwner),
    },
  });

  await p.build();
  p.signAllInputs(oldOwner.keypair);
  p.finalizeAllInputs();

  const txHash = await walletApi.brodcastTx(p.toHex(true));
  console.log({ hex: p.toHex(true), txHash: txHash });
  return txHash;
}

async function mintInscriptionCursedReinscription() {
  // 1. MINT
  const inscriptionTxHash = await mintInscriptionImage();
  await sleep(5000);

  console.log("inscriptionTxHash", inscriptionTxHash);

  const oldOwner = wallet.p2wpkh(0);
  await regboxApi.getFaucet(oldOwner.address, 1);
  await sleep(5000);

  const inputs = await getInputsByOutpoints(oldOwner.address, [
    { hash: inscriptionTxHash, index: 0 },
  ]);
  // 2. TRANSFER TO newOwner

  // script for step 3 (reinscription)
  const script = (internalPubkey: Buffer): P2trScript => {
    const inscription = Script.compile([
      internalPubkey,
      Script.OP_CHECKSIG,
      Script.OP_FALSE,
      Script.OP_IF,
      Script.encodeUTF8("ord"),
      1,
      1, // OP_PUSHBYTES_1 1
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

  const p2trReinscription = wallet.p2trScript(0, script);
  await regboxApi.getFaucet(p2trReinscription.address, 1);
  await sleep(5000);

  const p = new PSBT({
    network: "regtest",
    inputs: inputs,
    outputs: [
      {
        // this will become the owner of the insription
        output: Address.fromString(p2trReinscription.address),
        value: 600,
      },
    ],
    feeRate: 1,
    changeOutput: Address.fromString(oldOwner.address),
    autoUtxo: {
      api,
      from: new P2wpkhAutoUtxo(oldOwner),
    },
  });

  await p.build();
  p.signAllInputs(oldOwner.keypair);
  p.finalizeAllInputs();

  const txHash = await walletApi.brodcastTx(p.toHex(true));
  await sleep(5000);

  // 3. MINT AGAIN

  const reinscriptionP = new PSBT({
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
    changeOutput: Address.fromString(wallet.p2pkh(0).address),
    autoUtxo: {
      api,
      from: new P2trAutoUtxo(p2trReinscription),
    },
  });

  await reinscriptionP.build();
  reinscriptionP.signAllInputs(p2trReinscription.keypair);
  reinscriptionP.finalizeAllInputs();

  const remintTxHash = await walletApi.brodcastTx(reinscriptionP.toHex(true));
  console.log({ hex: p.toHex(true), txHash: remintTxHash });
  return txHash;
}

async function main() {
  const p2wpkhAddress = wallet.p2wpkh(0).address;
  console.log("p2wpkh address: ", p2wpkhAddress);
  await regboxApi.getFaucet(p2wpkhAddress, 1);
  await regboxApi.generateBlock(1);
  await sleep(5000);

  // NORMAL ORDINAL MINTING
  // mintInscriptionText();
  // mintInscriptionImage();

  // CURSED ORDINALS
  // DuplicateField - two field using the same key
  // mintInscriptionCursedDuplicateFields()

  // IncompleteField - key without value
  // mintInscriptionCursedIncompleteField()
  // NotAtOffsetZero - ins.offset != 0
  // mintInscriptionCursedNotAtOffset0()
  // NotInFirstInput - ins.input_index != 0
  // mintInscriptionCursedNotAtInput0()

  // Pointer - pointer.is_some() https://github.com/ordinals/ord/pull/2523
  // mintInscriptionCursedNotAtOffset0()

  // Pushnum - using OP_PUSHNUM before jubilee will be cursed (jubilee 824544)
  // mintInscriptionCursedPushnum();
  // Reinscription - using reinscription is cursed
  // mintInscriptionCursedReinscription()
  // Stutter - for inscriptions which start with OP_FALSE OP_FALSE OP_IF or OP_FALSE OP_IF OP_FALSE OP_IF https://github.com/ordinals/ord/issues/2693         // UnrecognizedEvenField - check even field (i % 2 == 0), if not recognize then cursed
  mintInscriptionCursedStutter()


  // PROVENANCE

  // DELEGATE

  // pointer ordinal (2 ordinal in one tx)

  // TRANSFER
  // mintAndTransferInscription()
}

main();
