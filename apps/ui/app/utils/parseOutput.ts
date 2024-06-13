import { Output } from "@east-bitcoin-lib/sdk/dist/psbt/types";
import { PSBTOutput } from "../types/OutputContextType";
import { Address } from "@east-bitcoin-lib/sdk";

export const parseOutput = (outputs: PSBTOutput[]): Output[] => {
  const newOutputs: Output[] = [];

  for (const output of outputs) {
    newOutputs.push({
      output: Address.fromString(output.address),
      value: output.value,
    });
  }

  return newOutputs;
};
