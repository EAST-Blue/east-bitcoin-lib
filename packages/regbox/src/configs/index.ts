export default {
  server: {
    port: "8080",
  },
  docker: {
    socketPath: "/var/run/docker.sock",
    printLog: false,
    network: "east_regbox",
  },
  bitcoin: {
    name: "east_bitcoin_node__",
    image: "docker.io/ruimarinho/bitcoin-core:24",
    user: "east",
    password: "east",
    wallet: "east",
    port: "18443",
  },
  electrs: {
    name: "east_electrs__",
    image: "docker.io/eastbluehq/blockstream-electrs:v1.0.0",
    rpcPort: "60401",
    restPort: "3002",
  },
  explorer: {
    name: "east_explorer__",
    image: "docker.io/eastbluehq/janoside-btc-rpc-explorer:v3.4.0",
    port: "3000",
  },
  preloadAddresses: [
    "mrfaXzS5GkffJ7w7aHqheqTi81CGAgW3QL",
    "2N7XtNcP6xr4ZDCksqP1QvU9FyfaBXh2VGG",
    "bcrt1q3a34qdsw4dd7ye4fdvzut88tcjgz76d8gkjqdd",
    "bcrt1pxc8kgrxdlzvclef9fnfd7nslmval2xlgg30nxw06hl86j4lml50sauyyat",
    "n4o6eQLiDk8S4Y75aqxeBqhW3jXa9VWkXM",
    "2NF1x6SNoZRbtAYT1hGNwZk7cuAHYsguU3p",
    "bcrt1q63062x9c98g025gttswwpmjk49wcysk5jeh4pd",
    "bcrt1pny8rwj0j4xnlgmqkx8hqmf0tdx7zdh5y0u7w0te65j79n00a584sxupumd",
  ],
};