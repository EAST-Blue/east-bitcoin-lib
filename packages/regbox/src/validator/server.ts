import * as yup from "yup";

export const generateValidator = yup.object({
  nblocks: yup.number().required(),
});

export const sendToAddressValidator = yup.object({
  address: yup.string().required(),
  amount: yup.number().required(),
});
