import { Address, AddressUtxo, AddressUtxoArgs } from ".";
import { BitcoinAPIAbstract } from "../repositories";
import { BitcoinUTXO } from "../repositories/bitcoin/types";

export type P2pkhUtxoArgs = AddressUtxoArgs & {
  transaction: Buffer;
};

export class P2pkhUtxo extends AddressUtxo {
  transaction: Buffer;

  constructor({ txid, vout, transaction }: P2pkhUtxoArgs) {
    super({ txid, vout });
    this.transaction = transaction;
  }

  static async fromBitcoinUTXO(
    bitcoinAPI: BitcoinAPIAbstract,
    bitcoinUTXO: BitcoinUTXO,
  ) {
    const txHex = await bitcoinAPI.getTransactionHex(bitcoinUTXO.txid);
    const txBuffer = Buffer.from(txHex, "hex");

    return new P2pkhUtxo({
      txid: bitcoinUTXO.txid,
      vout: bitcoinUTXO.vout,
      transaction: txBuffer,
    });
  }
}

export class P2pkhAddress extends Address { }
