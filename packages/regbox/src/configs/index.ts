export default {
  server: {
    port: "8080",
  },
  docker: {
    socketPath: "/run/user/1000/podman/podman.sock",
    printLog: false,
    network: "east_regbox",
  },
  bitcoin: {
    name: "east_bitcoin_node__",
    image: "docker.io/ruimarinho/bitcoin-core:24-alpine",
    user: "east",
    password: "east",
    wallet: "east",
    rpcPort: "18443",
    peerPort: "18444",
  },
  electrs: {
    name: "east_electrs__",
    image: "docker.io/haffjjj/blockstream-electrs:v1.0.0",
    rpcPort: "60401",
    restPort: "3002",
  },
  explorer: {
    name: "east_explorer__",
    image: "docker.io/haffjjj/janoside-btc-rpc-explorer:v3.4.0",
    port: "3000",
  },
};
