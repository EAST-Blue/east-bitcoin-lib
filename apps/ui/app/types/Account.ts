export type AccountType = {
  secret: string;
  p2wpkh: string;
  p2tr: string;
  path: number;
};

export type AccountContextType = {
  accounts: AccountType[];
  fetchAccounts: () => void;
};
