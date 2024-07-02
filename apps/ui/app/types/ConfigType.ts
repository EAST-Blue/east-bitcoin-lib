export type NetworkConfigType = {
  network: string;
  uri: string | null;
  explorer: string | null;
  fetchConfig: () => void;
};
