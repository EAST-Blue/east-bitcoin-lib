import { AddressOutput, AddressUtxo, AddressUtxoArgs } from ".";

export type TapLeafScript = {
  controlBlock: Buffer;
  leafVersion: number;
  script: Buffer;
};

export type P2trUtxoArgs = AddressUtxoArgs & {
  witness: {
    script: Buffer;
    value: number;
  };
  tapInternalKey: Buffer;
  tapLeafScript: TapLeafScript[];
};

export class P2trUtxo extends AddressUtxo {
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
    super({ txid, vout });
    this.witness = witness;
    this.tapInternalKey = tapInternalKey;
    this.tapLeafScript = tapLeafScript;
  }
}

export class P2trOutput extends AddressOutput {}
