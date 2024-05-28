import { P2pkhAddress, P2trAddress, P2wpkhAddress } from "../addresses";
import { OpReturnOutput } from "../addresses/opReturn";

export type AddressOutput =
  | P2pkhAddress
  | P2wpkhAddress
  | P2trAddress
  | OpReturnOutput;

export type Output = {
  output: AddressOutput;
  value: number;
};
