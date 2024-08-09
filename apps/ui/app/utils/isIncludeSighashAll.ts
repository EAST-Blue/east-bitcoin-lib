import { Transaction } from "bitcoinjs-lib";

export const isIncludeSighashAll = (transaction: Transaction): boolean => {
  const ins = transaction.ins;
  for (const input of ins) {
    const witness = input.witness;
    const witnessFirstByte = witness[0];

    if (!witnessFirstByte) return false;
    const sighash = witnessFirstByte![witnessFirstByte!.length - 1];
    if (
      sighash === Transaction.SIGHASH_ALL ||
      sighash === Transaction.SIGHASH_ALL + Transaction.SIGHASH_ANYONECANPAY
    ) {
      return true;
    }
  }

  return false;
};
