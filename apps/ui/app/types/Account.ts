export type AccountType = {
  mnemonic: string;
  p2wpkh: string;
  p2tr: string;
};

export type AccountContextType = {
  accounts: AccountType[];
  fetchAccounts: () => void;
};
