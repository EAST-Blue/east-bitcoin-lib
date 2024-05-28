import { API } from "../repositories";
import { AddressOutput } from "./output";

export type AutoAdjustment = {
  api: API;
  feeRate: number;
  changeOutput?: AddressOutput;
};
