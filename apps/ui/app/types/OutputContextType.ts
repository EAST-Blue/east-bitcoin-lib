export type PSBTOutput = {
  address: string;
  value: number;
};

export type OutputContextType = {
  outputs: PSBTOutput[];
  saveOutputs: (output: PSBTOutput[]) => void;
  removeOutputByAddress: (address: string) => void;
};
