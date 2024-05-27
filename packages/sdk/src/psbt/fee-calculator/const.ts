// Refer to this page: https://bitcoinops.org/en/tools/calc-size/
export const FEE_TX_EMPTY_SIZE = 4 + 1 + 1 + 4;

export const FEE_TX_INPUT_BASE = 32 + 4 + 1 + 4;
export const FEE_TX_INPUT_PUBKEYHASH = 107;
export const FEE_TX_INPUT_SEGWIT = 27 + 1;
export const FEE_TX_INPUT_TAPROOT = 17 + 1;

export const FEE_TX_OUTPUT_BASE = 8 + 1;
export const FEE_TX_OUTPUT_PUBKEYHASH = 25;
export const FEE_TX_OUTPUT_SEGWIT = 22;
export const FEE_TX_OUTPUT_TAPROOT = 34;

// export const FEE_TX_OUTPUT_SCRIPTHASH = 23;
// export const FEE_TX_OUTPUT_SEGWIT_SCRIPTHASH = 34;
