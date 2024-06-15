import stream from "stream";
import { ContainerAbstract } from "../containers";

export type CreateLogStreamArgs = {
  printLog: boolean;
  onLog?: (log: string) => void;
};
export function createLogStream({ printLog, onLog }: CreateLogStreamArgs) {
  const logStream = new stream.PassThrough();
  logStream.on("data", function(chunk) {
    const log = chunk.toString("utf8");

    if (onLog) {
      onLog(log);
    }

    if (printLog) {
      process.stdout.write(log);
    }
  });

  return logStream;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function listeningPortInfo(datas: { name: string; ports: string[] }[]) {
  for (const data of datas) {
    console.info(`${data.name}: ${data.ports}`);
  }
}

export async function startContainers(containers: ContainerAbstract[]) {
  for (let i = 0; i < containers.length; i++) {
    await containers[i]?.start();
  }
}

export async function shutdownContainers(containers: ContainerAbstract[]) {
  for (let i = 0; i < containers.length; i++) {
    await containers[i]?.shutdown();
  }
}

export function containersPortInfo(containers: ContainerAbstract[]) {
  return containers.map((container) => {
    return {
      name: container.name,
      ports: container.portMappings.map((portMapping) => {
        return portMapping.host;
      }),
    };
  });
}
