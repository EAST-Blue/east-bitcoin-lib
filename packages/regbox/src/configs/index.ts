export default {
  docker: {
    network: "east_regbox",
  },
  bitcoin: {
    name: "east_bitcoin_node",
    user: "east",
    password: "east",
    wallet: "east",
    port: "18443",
  },
  electrs: {
    name: "east_electrs",
    rpcPort: "60401",
    restPort: "3002",
  },
  explorer: {
    name: "east_explorer",
    port: "3000",
  },
};
