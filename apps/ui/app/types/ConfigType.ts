export type NetworkConfigType = {
  network: string;
  uri: string | null;
  explorer: string | null;
  regbox: string | null;
  configApiUrl: string | null;
  fetchConfig: () => void;
};
