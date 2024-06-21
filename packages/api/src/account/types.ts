import { ECPairAPI } from "ecpair";

export type { ECPairAPI };

export const BorshQuerySchema = {
  struct: {
    method: "string",
    args: {
      array: {
        type: "string",
      },
    },
  },
};
