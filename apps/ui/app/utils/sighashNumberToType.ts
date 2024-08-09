import { Transaction } from "bitcoinjs-lib";

export const sighashNumberToType = (
  transaction: Transaction | null,
  inputIndex: number
): string => {
  if (!transaction) return "UNDEFINED";

  const witness = transaction.ins[inputIndex]?.witness;

  if (!witness) throw new Error(`Witness not exist on input`);

  const witnessByte = witness[0];
  if (!witnessByte) throw new Error(`First byte witness not exist`);

  const sighash = witnessByte[witnessByte.length - 1];
  switch (sighash) {
    case Transaction.SIGHASH_ALL:
      return "SIGHASH_ALL";
    case Transaction.SIGHASH_NONE:
      return "SIGHASH_NONE";
    case Transaction.SIGHASH_SINGLE:
      return "SIGHASH_SINGLE";
    case Transaction.SIGHASH_ALL + Transaction.SIGHASH_ANYONECANPAY:
      return "SIGHASH_ALL_ANYONECANPAY";
    case Transaction.SIGHASH_NONE + Transaction.SIGHASH_ANYONECANPAY:
      return "SIGHASH_NONE_ANYONECANPAY";
    case Transaction.SIGHASH_SINGLE + Transaction.SIGHASH_ANYONECANPAY:
      return "SIGHASH_SINGLE_ANYONECANPAY";
    default:
      throw new Error(`Sighash number is not valid`);
      break;
  }
};
