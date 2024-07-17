import { Config } from "../../types";

export type BitcoinContainerParams = {
  config: Config;
};

export type GenerateAddress = {
  address: string;
  blocks: string[];
};
