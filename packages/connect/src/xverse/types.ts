import { Network } from "../network";

export type XverseSignMessageOptions = {
  address: string;
  message: string;
  network: Network;
};

export type XverseOnFinishResponse = {
  addresses: Array<{
    address: string;
    publicKey: string;
    purpose: "ordinals" | "payment";
  }>;
};
