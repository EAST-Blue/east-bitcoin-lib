import { P2trScript, Script } from "@east-bitcoin-lib/sdk";
import { parseTapscript } from "./parseOpcode";

export const generateTapscript = (tapscript: string) => {
  const parsedScript = parseTapscript(tapscript);

  const script = (internalPubkey: Buffer): P2trScript => {
    const inscription = Script.compile([
      internalPubkey,
      Script.OP_CHECKSIG,
      ...parsedScript,
    ]);
    const recovery = Script.compile([internalPubkey, Script.OP_CHECKSIG]);

    return {
      taptree: [
        {
          output: Script.compile(inscription),
        },
        {
          output: Script.compile(recovery),
        },
      ],
      redeem: {
        output: inscription,
        redeemVersion: 192,
      },
    };
  };

  return script;
};
