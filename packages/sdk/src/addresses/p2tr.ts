export type TapLeafScript = {
  controlBlock: Buffer;
  leafVersion: number;
  script: Buffer;
};

export type P2trUtxoArgs = {
  txid: string;
  vout: number;

  witness: {
    script: Buffer;
    value: number;
  };

  tapInternalKey: Buffer;
  tapLeafScript: TapLeafScript[];
};

export class P2trUtxo {
  txid: string;
  vout: number;
  witness: {
    script: Buffer;
    value: number;
  };
  tapInternalKey: Buffer;
  tapLeafScript: TapLeafScript[];

  constructor({
    txid,
    vout,
    witness,
    tapInternalKey,
    tapLeafScript,
  }: P2trUtxoArgs) {
    this.txid = txid;
    this.vout = vout;
    this.witness = witness;
    this.tapInternalKey = tapInternalKey;
    this.tapLeafScript = tapLeafScript;
  }
}
