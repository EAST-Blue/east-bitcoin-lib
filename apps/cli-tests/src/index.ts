import { P2pkhUtxo, P2trOutput, PSBT } from "@east-bitcoin-lib/sdk";
import { PSBTInput } from "@east-bitcoin-lib/sdk/dist/psbt/input";
import { PSBTOutput } from "@east-bitcoin-lib/sdk/dist/psbt/output";

async function main() {
  const psbtInput = new PSBTInput({
    utxo: new P2pkhUtxo({
      txid: "eb4adeb65ee6d91de4fbf61bfbb59754038190bff6fb56c148188a92241f3df5",
      vout: 1,
      transaction: Buffer.from(
        "02000000000105ba5d7b0ba687fd009a455c87d6655b443f88b86c2249a42d94151f9d99156df10000000000fdffffff2a678217ac8ffca2581a4c2844e7b4042d35f4ae26a6ff810a82412eb015134a0100000000fdffffff8773cc6f8dfe9c74e5f5f5a840facc5a7093a04e386bc97a22523af95b8e591d0100000000fdffffffe672f00e1f767fc52e89c2733022852dca8ce668865bc6c5e8b56cdf94252a110100000000fdffffff311f20f69d54c095a6b5b73cd192cec2ea5ba20d6ba60e1ba2af81ffd0b8e9410100000000fdffffff0281daf505000000001976a91484f28b77050619dd995d59bffc95485a94ab521188ac00e40b54020000001976a914ce3b0dfcef96eaafd03a904c3e7ea295ea21f6a988ac014092ce412510d854ff9cb8a3386ae641360f6239d9e84064ec59fd225ab77266278b572f6b4b32d6a900de6fa6ee9870d5211fd0c708bc1aab41af63fd9f8082210140cddd17c72e555f157facc173791a550e0868dbfb409a0931010f035d7adfc97b7b317db838dce45608b4311347c0efc9efc8b55e59a4255bc8edfec93b3d1fa60140e68938a4e7a705f7c8add6906e66776d785c3fce4f040fd6fb6f5b3938f2e6a34bb0c2f8255cb25d4613f88bc27f296ed4c0c0f9d65cd5373d182614172483a40140a4c9b5deec5149a84ec654c086e1c1b42693d7dce745c79dea2ccd159fab2778af1132156cbc9e5de5f9d037e3afef703838917b1f67c151376af9801c8e07cd0140eb1a90810f75b36140711f68b8363d4fbb0ab66737b22424519531f7d4309fd87e1c1330ccd402d49dab8cd2d4564d8bbfbca70952c421cbfa656a8f733faa2433010000",
        "hex",
      ),
    }),
    value: 1,
  });

  const psbtOutput = new PSBTOutput({
    output: new P2trOutput({
      address:
        "bcrt1p53237z7unu5wcd5rqt648w6nay00sq6cnwv9jm9t84d45503qwgse30z0g",
    }),
    value: 1,
  });

  const psbt = new PSBT({
    network: "regtest",
    inputs: [psbtInput],
    outputs: [psbtOutput],
  });

  psbt.build();

  const hex = psbt.toHex();

  console.log({ hex });
}

main();
