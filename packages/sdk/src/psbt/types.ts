import {
  OpReturn,
  P2pkh,
  P2pkhUtxo,
  P2tr,
  P2trUtxo,
  P2wpkh,
  P2wpkhUtxo,
} from "../addresses";
import { API } from "../repositories";

export type AutoAdjustment = {
  api: API;
  feeRate: number;
  changeOutput?: OutputAddress;
};

export type InputAddress = P2pkhUtxo | P2wpkhUtxo | P2trUtxo;
export type OutputAddress = (P2pkh | P2wpkh | P2tr | OpReturn) & {
  value: number;
};
