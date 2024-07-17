import { Table } from "console-table-printer";
import stream from "stream";
import { ContainerAbstract } from "../containers";

export type CreateLogStreamParams = {
  printLog: boolean;
  onLog?: (log: string) => void;
};
export function createLogStream({ printLog, onLog }: CreateLogStreamParams) {
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
  const table = new Table({
    columns: [
      { name: "name", alignment: "left" },
      { name: "ports", alignment: "left" },
    ],
  });

  for (const data of datas) {
    table.addRow(
      {
        name: data.name,
        ports: data.ports,
      },
      { color: "green" },
    );
  }
  table.printTable();
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

export async function cleanUpContainers(containers: ContainerAbstract[]) {
  for (let i = 0; i < containers.length; i++) {
    await containers[i]?.cleanUp();
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

export function parseArgToNumber(arg: string): number {
  const result = parseFloat(arg);
  if (isNaN(result)) {
    throw new Error(`errors.argument ${arg} is  not a number`);
  }

  return result;
}
