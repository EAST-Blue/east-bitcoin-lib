export type TransactionParams = {
  signer: string;
  receiver: string;
  actions: Action[];
};

export type Action = {
  kind: string;
  function_name: string;
  args: string[];
};

export const borshMainSchema = {
  struct: {
    id: "string",
    signature: "string",
    transaction: "string",
  },
};

export const borshTransactionSchema = {
  struct: {
    nonce: "u64",
    signer: "string",
    receiver: "string",
    actions: "string",
  },
};

const borshActionSchema = {
  struct: {
    kind: "string",
    function_name: "string",
    args: {
      array: {
        type: "string",
      },
    },
  },
};

export const borshActionsSchema = {
  array: {
    type: borshActionSchema,
  },
};
