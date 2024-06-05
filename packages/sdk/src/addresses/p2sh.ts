import {
  AddressAutoUtxo,
  AddressAutoUtxoArgs,
  AddressType,
  AddressUtxo,
  AddressUtxoArgs,
} from ".";
import { BitcoinAPIAbstract } from "../repositories";
import { BitcoinUTXO } from "../repositories/bitcoin/types";

export type P2shUtxoArgs = AddressUtxoArgs & {
  transaction: Buffer;
  redeemScript: Buffer;
  unlockScript: Buffer;
};

export type P2shFromBitcoinUTXOArgs = {
  bitcoinAPI: BitcoinAPIAbstract;
  bitcoinUTXO: BitcoinUTXO;
  redeemScript: Buffer;
  unlockScript: Buffer;
};

export class P2shUtxo extends AddressUtxo {
  type: AddressType = "p2sh";
  transaction: Buffer;
  redeemScript: Buffer;
  unlockScript: Buffer;

  constructor({
    txid,
    vout,
    transaction,
    redeemScript,
    unlockScript,
  }: P2shUtxoArgs) {
    super({ txid, vout });
    this.transaction = transaction;
    this.redeemScript = redeemScript;
    this.unlockScript = unlockScript;
  }

  static async fromBitcoinUTXO({
    bitcoinAPI,
    bitcoinUTXO,
    redeemScript,
    unlockScript,
  }: P2shFromBitcoinUTXOArgs) {
    const txHex = await bitcoinAPI.getTransactionHex(bitcoinUTXO.txid);
    const txBuffer = Buffer.from(txHex, "hex");

    return new P2shUtxo({
      txid: bitcoinUTXO.txid,
      vout: bitcoinUTXO.vout,
      transaction: txBuffer,
      redeemScript,
      unlockScript,
    });
  }
}

export type P2shAutoUtxoArgs = AddressAutoUtxoArgs & {
  redeemScript: Buffer;
  unlockScript: Buffer;
};

export class P2shAutoUtxo extends AddressAutoUtxo {
  redeemScript: Buffer;
  unlockScript: Buffer;
  constructor({ address, redeemScript, unlockScript }: P2shAutoUtxoArgs) {
    super({ address });
    this.redeemScript = redeemScript;
    this.unlockScript = unlockScript;
  }
}
