import { networks, Transaction } from "bitcoinjs-lib";
import { Network } from "../types";
import { AddressType } from "../addresses";
import { getAddressInfo } from "bitcoin-address-validation";

export function bitcoinJsNetwork(network: Network) {
  return networks[network === "mainnet" ? "bitcoin" : network];
}

export function getAddressType(address: string): AddressType {
  const adddresInfo = getAddressInfo(address);
  return adddresInfo.type;
}

export function pubkeyXOnly(pubkey: Buffer) {
  return pubkey.subarray(1, 33);
}

export function witnessUtxoToTxid(
  transaction: Transaction | null,
  inputIndex: number
): string {
  if (!transaction) return "UNDEFINED";

  const ins = transaction.ins;

  const hash = ins[inputIndex]?.hash;
  const txid = reverseBuffer(hash!).toString("hex");

  return txid;
}

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

export * from "./bip32";
export * from "./ecpair";
