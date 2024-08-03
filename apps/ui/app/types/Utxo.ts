import { BitcoinUTXO } from "@east-bitcoin-lib/sdk/dist/repositories/bitcoin/types";

export type InputUTXO = BitcoinUTXO & { sighash?: number };
