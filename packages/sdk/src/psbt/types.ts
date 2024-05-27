import { API } from "../repositories";
import { PSBTAddressOutput } from "./output";

export type AutoAdjustment = {
  api: API;
  feeRate: number;
  changeOutput?: PSBTAddressOutput;
};
