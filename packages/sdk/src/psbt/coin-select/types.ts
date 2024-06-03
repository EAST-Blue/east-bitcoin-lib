import { Address } from "../../addresses";
import { API } from "../../repositories";

export type UtxoSelect = {
  api: API;
  address: Address;
  pubkey?: Buffer;
};
