import { Script } from "@east-bitcoin-lib/sdk";
import { script, opcodes } from "bitcoinjs-lib";

export const parseScript = (plaintext: string): any => {
  if (plaintext === "") return;

  const components: any = plaintext.split(" ");
  const scriptComponents = components.map((component: any) => {
    if (!isNaN(component)) {
      return script.number.encode(Number(component));
    } else if (opcodes[component]) {
      return opcodes[component];
    } else {
      return Script.encodeUTF8(component);
    }
  });

  return scriptComponents;
};
