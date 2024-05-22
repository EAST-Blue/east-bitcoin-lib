import { OP_RETURN, P2PKH, P2TR, P2WPKH } from "../addresses/types";
import { API } from "../repositories";

export type AutoAdjustment = {
  api: API;
  feeRate: number;
  changeOutput?: OutputAdreess;
};

export type Input = {
  txid: string;
  vout: number;
  sighashType?: number;
};

export type InputWitness = {
  witness: {
    script: Buffer;
    value: number;
  };
};

export type InputP2PKH = Input & {
  transaction: Buffer;
};

export type InputP2WPKH = Input & InputWitness;

export type InputP2TR = Input &
  InputWitness & {
    tapInternalKey: Buffer;
  };

export type InputAddress = InputP2WPKH | InputP2WPKH | InputP2TR;
export type OutputAdreess = P2PKH | P2WPKH | P2TR | OP_RETURN;
