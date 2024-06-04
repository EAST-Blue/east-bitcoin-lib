import { initEccLib } from "bitcoinjs-lib";
initEccLib(require("tiny-secp256k1"));

export * from "./types";
export * from "./addresses";
export * from "./repositories";
export * from "./psbt";
export * from "./script";
export * from "./utils";
export * from "./wallet";
