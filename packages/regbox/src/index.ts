import Docker, { Container } from "dockerode";
const docker = new Docker({ socketPath: "/run/user/1000/podman/podman.sock" });

const LOG = false;

async function shutdown(runningContainers: Container[]) {
  console.info("info.shutdown the services..");
  for (let i = 0; i < runningContainers.length; i++) {
    const container = runningContainers[i]!;

    console.info(`info.stopping ${container.id}`);

    await container.stop();
    await container.remove();

    console.info(`info.stopped ${container.id}`);
  }
}

async function startBtcNode(
  runningContainers: Container[],
): Promise<Container> {
  return new Promise((resolve, reject) => {
    docker
      .run(
        "ruimarinho/bitcoin-core:24-alpine",
        [
          "-txindex=1",
          "-regtest=1",
          "-rpcallowip=0.0.0.0/0",
          "-rpcbind=0.0.0.0",
          "-rpcuser=east",
          "-rpcpassword=east",
          "-fallbackfee=0.00001",
        ],
        [process.stdout, process.stderr],
        {
          Tty: !LOG,
          ExposedPorts: { "18443/tcp": {} },
          HostConfig: {
            PortBindings: {
              "18443/tcp": [
                {
                  HostPort: "18441",
                },
              ],
            },
          },
        },
        function(err) {
          if (err) {
            console.error(err);

            shutdown(runningContainers);
            reject(err);
          }
        },
      )
      .on("container", function(container: Container) {
        runningContainers.push(container);
        resolve(container);
      });
  });
}

async function main() {
  const runningContainers: Container[] = [];
  process.on("SIGINT", async function() {
    await shutdown(runningContainers);
  });

  console.info("info.starting bitcoin node..");
  const btcContainer = await startBtcNode(runningContainers);
}

main();
