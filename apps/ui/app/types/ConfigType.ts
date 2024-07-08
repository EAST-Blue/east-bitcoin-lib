export type NetworkConfigType = {
  network: string;
  uri: string | null;
  explorer: string | null;
  regbox: string | null;
  fetchConfig: () => void;
};
