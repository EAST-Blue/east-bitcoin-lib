import { OpCodes, Script } from "@east-bitcoin-lib/sdk";
import { script, StackElement } from "bitcoinjs-lib";
type OpCodeKey = keyof typeof OpCodes;

export const parseScript = (plaintext: string): any => {
  if (plaintext === "") return [];

  const components: any = plaintext.split(" ");
  const scriptComponents: Buffer[] = components.map((component: any) => {
    if (component in OpCodes) {
      return OpCodes[component as OpCodeKey];
    } else if (!isNaN(parseInt(component))) {
      return script.number.encode(Number(component));
    } else {
      return Buffer.from(component, "hex");
    }
  });

  return scriptComponents;
};

export const parseTapscript = (plaintext: string): Buffer => {
  if (plaintext === "") return Buffer.from([]);

  const components: string[] = plaintext.split(" ");
  const scriptComponents = components.map((component) => {
    if (component in OpCodes) {
      return OpCodes[component as OpCodeKey];
    } else if (isFunctionCall(component)) {
      const { functionName, args } = parseFunctionCall(component);
      if (functionName === "encodeUtf8") {
        return Script.encodeUTF8(args[0]!);
      } else if (functionName === "base64") {
        return Buffer.from(args[0]!, "base64");
      } else if (functionName === "encodeNumber") {
        return Script.encodeNumber(parseInt(args[0]!));
      }
    }
  });

  return Script.compile(scriptComponents as StackElement[]);
};

const isFunctionCall = (component: string): boolean => {
  const functionCallPattern = /^[a-zA-Z_][a-zA-Z0-9_]*\(([^)]*)\)$/;
  return functionCallPattern.test(component);
};

const parseFunctionCall = (
  component: string
): { functionName: string; args: string[] } => {
  const functionCallPattern = /^([a-zA-Z_][a-zA-Z0-9_]*)\(([^)]*)\)$/;
  const match = component.match(functionCallPattern);
  if (match) {
    const functionName = match[1]!;
    const args = match[2]!.split(",").map((arg) => arg.trim());
    return { functionName, args };
  } else {
    throw new Error(`Invalid function call syntax: ${component}`);
  }
};
