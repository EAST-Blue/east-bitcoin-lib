import { AddressType, AddressUtxo, AddressUtxoArgs } from ".";
import { BitcoinAPIAbstract } from "../repositories";
import { BitcoinUTXO } from "../repositories/bitcoin/types";

export type P2shUtxoArgs = AddressUtxoArgs & {
  transaction: Buffer;
  redeemScript: Buffer;
};

export class P2shUtxo extends AddressUtxo {
  type: AddressType = "p2sh";
  transaction: Buffer;
  redeemScript: Buffer;

  constructor({ txid, vout, transaction, redeemScript }: P2shUtxoArgs) {
    super({ txid, vout });
    this.transaction = transaction;
    this.redeemScript = redeemScript;
  }

  static async fromBitcoinUTXO(
    bitcoinAPI: BitcoinAPIAbstract,
    redeemScript: Buffer,
    bitcoinUTXO: BitcoinUTXO,
  ) {
    const txHex = await bitcoinAPI.getTransactionHex(bitcoinUTXO.txid);
    const txBuffer = Buffer.from(txHex, "hex");

    return new P2shUtxo({
      txid: bitcoinUTXO.txid,
      vout: bitcoinUTXO.vout,
      transaction: txBuffer,
      redeemScript,
    });
  }
}
