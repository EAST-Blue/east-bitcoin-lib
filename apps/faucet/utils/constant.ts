export const HOMEPAGE_ALWAYS_RESILIENCE = [
  {
    body: "Experience the reliable uptime powered by cutting-edge decentralized technology.",
  },
  {
    body: "Ensure rock-solid data integrity with extended-CometBFT consensus, fortified by Bitcoin",
  },
  {
    body: "Eastlayer has built-in mechanisms designed to effectively handle Bitcoin reorganizations",
  },
];

export const SATFORGE_EXAMPLE_CODE = `import { PSBT } from "east-bitcoin-lib";

const tx = new PSBT({
  inputs: [
    {
      txid: "6ababfb6c4b0b68d4c7167294ff19dbe87ef7895ff938a98499d1aa04745820e",
      vout: 0,
      type: "p2tr",
      witness: { /** witness object */ },
      tapInternalKey: {/** taproot key object */} }
    },
  ],
  outputs: [
    {
      value: 546,
      output: {
        type: "op_return",
        script: {
          type: "Buffer",
          data: [/** script buffer */],
        },
      }`;

export const HOMEPAGE_BUILT_WITH = [
  {
    title: "wallet",
    body: "Empower your wallet applications with seamless Bitcoin data retrieval and enhanced functionality.",
  },
  {
    title: "marketplace",
    body: "Manage, create, and trade unique digital assets on the Bitcoin network.",
  },
  {
    title: "metaprotocol",
    body: "Seamlessly develop and deploy any protocols with our flexible framework.",
  },
  {
    title: "bitcoin analytics",
    body: "Analyze Bitcoin data comprehensively, use it for you own use or make it public easily.",
  },
  {
    title: "tokenization",
    body: "Securely tokenize assets with ease on Bitcoin, the longest running blockchain in the world.",
  },
  {
    title: "your vision",
    body: "Unlock limitless possibilities with Eastlayer. Empower your ideas and bring them to life on a decentralized platform.",
  },
];

export const HOMEPAGE_CODE_1 = `# Simplified coin using OP_RETURN

Data in the marker output        Description
-------------------------        -------------------------
0x6a                             The OP_RETURN opcode.
0x43 0x4F 0x49 0x4E              The protocol signature "COIN"
0x69 | 0x74                      Issue (0x69) or Transfer (0x74) action
<TOKEN_NAME>                     Token name string
0x5f                             Protocol delimiter
<AMOUNT>                         Token amount in string`;

export const HOMEPAGE_CODE_2 = `if (utxo.pkAsmScripts[0] === "OP_RETURN") {
  const msg = decode(utxo.pkAsmScripts[1]);
  if (msg.substr(0, 4) === "COIN") {
    const command = msg.charAt(4);
    if (command === “i”) { /* issue operation */
      txTable.insert("root", to, amount)
    } 
    else if (command === "t") { /* transfer operation */
     txTable.insert(from, to, amount)
    }
  }
}`;

export const HOMEPAGE_CODE_3 = `Response: {
  blockHeight: 1945
  result: [
    "coin-a": 69420,
    "coin-b": 23000,
    "coin-c": 10000,
  ]
}`;

export const REGNETPAGE_FEATURES = [
  {
    title: "Fast and Reliable Operation",
    body: "Experience rapid transaction processing and seamless performance for testing and development.",
  },
  {
    title: "Streamline Your Workflow",
    body: "Seamlessly integrate Regnet into your workflow with your favorite dev tools and packages.",
  },
  {
    title: "Proper Working Faucet",
    body: "Instantly request rBTC to power your development and test transactions effortlessly.",
  },
];

export const SMARTINDEXPAGE_FEATURES = [
  {
    title: "Developer Friendly",
    body: "Utilize the familiar syntax and structure of TypeScript through AssemblyScript, reducing the learning curve and speeding up development.",
  },
  {
    title: "SQL Data Management",
    body: "Leverage SQL for complex data organization and sophisticated data queries, enhancing the capability of your applications.",
  },
];

export const SATSFORGEPAGE_FEATURES = [
  {
    title: "Generate Client Code",
    body: "Engineer Bitcoin transactions easier by generating the necessary code directly from the user-friendly interface.",
  },
  {
    title: "Templates, Scripts",
    body: "Write custom scripts or use open-source templates created by developers all around the world.",
  },
  {
    title: "Network Integration",
    body: "Connect Satsforge to any Bitcoin network from any API and RPC providers via custom configuration.",
  },
  {
    title: "Multi-account Support",
    body: "Manage and test transactions across multiple accounts seamlessly. Iterate and debug easily via transactions history.",
  },
];

export const LINK_TO_DOCS = "https://docs.eastlayer.io";
export const LINK_TO_GIT = "https://github.com/EAST-Blue";
