export const NETWORK_MODE_OPTIONS = [
  {
    label: "Mainnet",
    value: "mainnet",
  },
  {
    label: "Testnet",
    value: "testnet",
  },
  {
    label: "Regtest",
    value: "regtest",
  },
];

export const TX_OUTPUT_OPTIONS = [
  {
    label: "Standard",
    options: [
      { label: "Transfer", value: "address" },
      { label: "Custom Script", value: "script_custom" },
    ],
  },
  {
    label: "Eastlayer",
    options: [
      { label: "Issue Eastlayer Token", value: "script" },
      { label: "Transfer Eastlayer Token", value: "script_transfer" },
    ],
  },
];

export const SelectStyles = {
  placeholder: (provided: any) => ({
    ...provided,
    color: "rgba(255,255,255,0.6)",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "rgba(255,255,255,0.8)",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    cursor: "pointer",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: "0.5rem",
    boxShadow: "none !important",
    opacity: state.isDisabled ? "0.5" : "1",
    "*": {
      boxShadow: "none !important",
      fontWeight: "500",
    },
    "&:hover": {
      borderColor: "rgba(255,255,255,0.4)",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#e5e7eb",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "var(--black-2)",
    color: "#e5e7eb",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "var(--black-3)" : "",
    color: state.isSelected ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.7)",
    "&:hover": {
      backgroundColor: "var(--black-3)",
      color: "rgba(255,255,255,1)",
    },
  }),
};
