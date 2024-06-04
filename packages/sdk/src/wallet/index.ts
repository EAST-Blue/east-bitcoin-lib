import { BIP32Factory, BIP32Interface } from "bip32";
import * as bip39 from "bip39";
import { ECPairFactory } from "ecpair";
import { payments, crypto, script } from "bitcoinjs-lib";
import { Network } from "../types";
import { bitcoinJsNetwork, pubkeyXOnly } from "../utils";
import { DeriveP2pkh, DeriveP2sh, DeriveP2tr, DeriveP2wpkh } from "./types";
import { StackScripts } from "../script";

const bip32 = BIP32Factory(require("tiny-secp256k1"));
const ecpair = ECPairFactory(require("tiny-secp256k1"));

export type AddressPathType = "legacy" | "nested-segwit" | "segwit" | "taproot";

export type WalletGetPathArgs = {
  type: AddressPathType;
  network: Network;
  index: number;
};

export type WalletArgs = {
  mnemonic?: string;
  network: Network;
};

export class Wallet {
  mnemonic: string;
  network: Network;

  masterNode: BIP32Interface;

  constructor({ mnemonic, network }: WalletArgs) {
    if (!mnemonic) {
      mnemonic = Wallet.generateMnemonic();
    }
    this.mnemonic = mnemonic;
    this.network = network;

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const masterNode = bip32.fromSeed(seed);
    this.masterNode = masterNode;
  }

  static generateMnemonic() {
    return bip39.generateMnemonic();
  }

  static getPath({ type, network, index }: WalletGetPathArgs) {
    let coinType = 1;
    if (network === "mainnet") {
      coinType = 0;
    }

    switch (type) {
      case "legacy":
        return `m/44'/${coinType}'/0'/0/${index}`;
      case "nested-segwit":
        return `m/49'/${coinType}'/0'/0/${index}`;
      case "segwit":
        return `m/84'/${coinType}'/0'/0/${index}`;
      case "taproot":
        return `m/86'/${coinType}'/0'/0/${index}`;
    }
  }

  p2pkh(index: number): DeriveP2pkh {
    const childNode = this.masterNode.derivePath(
      Wallet.getPath({ type: "legacy", network: this.network, index }),
    );
    const keypair = ecpair.fromPrivateKey(childNode.privateKey!);

    const p2pkh = payments.p2pkh({
      network: bitcoinJsNetwork(this.network),
      pubkey: keypair.publicKey,
    });

    return {
      address: p2pkh.address!,
      keypair,
    };
  }

  p2sh(scripts: StackScripts): DeriveP2sh {
    const redeemScript = script.compile(scripts);
    const p2sh = payments.p2sh({
      redeem: {
        output: redeemScript,
        network: bitcoinJsNetwork(this.network),
      },
      network: bitcoinJsNetwork(this.network),
    });

    return {
      address: p2sh.address!,
      redeemScript,
    };
  }

  p2wpkh(index: number): DeriveP2wpkh {
    const childNode = this.masterNode.derivePath(
      Wallet.getPath({ type: "segwit", network: this.network, index }),
    );
    const keypair = ecpair.fromPrivateKey(childNode.privateKey!);

    const p2wpkh = payments.p2wpkh({
      network: bitcoinJsNetwork(this.network),
      pubkey: keypair.publicKey,
    });

    return {
      address: p2wpkh.address!,
      keypair,
    };
  }

  p2tr(index: number): DeriveP2tr {
    const childNode = this.masterNode.derivePath(
      Wallet.getPath({ type: "taproot", network: this.network, index }),
    );
    const keypair = ecpair.fromPrivateKey(childNode.privateKey!);
    const xOnly = pubkeyXOnly(keypair.publicKey);

    const p2tr = payments.p2tr({
      network: bitcoinJsNetwork(this.network),
      internalPubkey: xOnly,
    });

    const tweakedKeyPair = keypair.tweak(crypto.taggedHash("TapTweak", xOnly));

    return {
      address: p2tr.address!,
      keypair: tweakedKeyPair,
    };
  }
}
