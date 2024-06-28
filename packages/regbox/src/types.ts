export type Config = {
  server: {
    port: string;
  };
  container: {
    socketPath: string;
    printLog: boolean;
    network: string;
  };
  bitcoin: {
    name: string;
    image: string;
    user: string;
    password: string;
    wallet: string;
    rpcPort: string;
    peerPort: string;
  };
  electrs: {
    name: string;
    image: string;
    rpcPort: string;
    restPort: string;
  };
  explorer: {
    name: string;
    image: string;
    port: string;
  };
  preloadAddresses?: string[]
};
