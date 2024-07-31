import { AddressPurposes, getAddress } from "sats-connect";

import {
  fromXOnlyToFullPubkey,
  isXverseInstalled,
  XverseNetwork,
} from "./utils";
import { getAddressFormat } from "../address";
import { Network } from "../network";

export async function connectXverse(network: Network) {
  network = network ?? "testnet";

  const result: Array<{
    pub: string;
    address: string;
    format: string;
    xKey?: string;
  }> = [];

  if (!isXverseInstalled()) {
    throw new Error("Xverse not installed.");
  }

  const handleOnFinish = (
    response: XverseOnFinishResponse,
    network: Network
  ) => {
    if (!response || !response.addresses || response.addresses.length !== 2) {
      throw new Error("Invalid address format");
    }

    response.addresses.forEach((addressObj) => {
      const format = getAddressFormat(addressObj.address, network).format;

      let xKey;
      if (format === "taproot") {
        xKey = addressObj.publicKey; // tr publicKey returned by XVerse is already xOnlyPubKey
        addressObj.publicKey = fromXOnlyToFullPubkey(addressObj.publicKey);
      }

      result.push({
        pub: addressObj.publicKey,
        address: addressObj.address,
        format,
        xKey,
      });
    });
  };

  const xVerseOptions = {
    payload: {
      purposes: ["ordinals", "payment"] as AddressPurposes[],
      message: "Provide access to 2 address formats",
      network: {
        type: (network.charAt(0).toUpperCase() +
          network.slice(1)) as XverseNetwork,
      },
    },
    onFinish: (response: XverseOnFinishResponse) =>
      handleOnFinish(response, network),
    onCancel: handleOnCancel,
  };

  await getAddress(xVerseOptions);

  return result;
}

function handleOnCancel() {
  throw new Error("Request canceled by user.");
}

export type XverseOnFinishResponse = {
  addresses: Array<{
    address: string;
    publicKey: string;
    purpose: "ordinals" | "payment";
  }>;
};
