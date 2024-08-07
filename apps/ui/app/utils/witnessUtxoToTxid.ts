import { Psbt } from "bitcoinjs-lib";

export const witnessUtxoToTxid = (psbt: Psbt, inputIndex: number): string => {
  const extractedPsbt = psbt.extractTransaction(true);
  const ins = extractedPsbt.ins;

  const hash = ins[inputIndex]?.hash;
  const txid = reverseBuffer(hash!).toString("hex");

  return txid;
};

export function reverseBuffer(buffer: Buffer): Buffer {
  if (buffer.length < 1) return buffer;
  let ret = Buffer.alloc(buffer.length);
  let j = buffer.length - 1;
  for (let i = 0; i < buffer.length; i++) {
    ret[i] = buffer[j]!;
    j--;
  }
  return ret;
}
