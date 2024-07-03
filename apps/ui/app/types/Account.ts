export type Account = {
  mnemonic: string;
  p2wpkh: string;
  p2tr: string;
};

export type AccountContextType = {
  accounts: Account[];
  fetchAccounts: () => void;
};
