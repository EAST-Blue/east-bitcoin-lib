export type RecommendedFee = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
}

export type Utxo = {
  txid: string;
  vout: number;
  value: number;
  status: {
    confirmed: boolean;
    block_height: number | null;
    block_hash: string | null;
    block_time: number | null;
  };
}