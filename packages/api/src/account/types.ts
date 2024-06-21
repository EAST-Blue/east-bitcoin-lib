import { ECPairAPI } from "ecpair";

export type { ECPairAPI };

export const BorshQuerySchema = {
  struct: {
    function_name: "string",
    args: {
      array: {
        type: "string",
      },
    },
  },
};
