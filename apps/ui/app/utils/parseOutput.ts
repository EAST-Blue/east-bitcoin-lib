import { Output } from "@east-bitcoin-lib/sdk/dist/psbt/types";
import { PSBTOutput } from "../types/OutputContextType";
import { Address, Script } from "@east-bitcoin-lib/sdk";
import { parseScript } from "./parseOpcode";

export const parseOutput = (outputs: PSBTOutput[]): Output[] => {
  const newOutputs: Output[] = [];

  for (const output of outputs) {
    if (output.address) {
      newOutputs.push({
        output: Address.fromString(output?.address!),
        value: output.value,
      });
    } else if (output.script) {
      const bufferScript = parseScript(output.script);
      newOutputs.push({
        output: { type: "op_return", script: Script.compile(bufferScript) },
        value: output.value,
      });
    }
  }

  return newOutputs;
};
