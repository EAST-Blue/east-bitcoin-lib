import stream from "stream";

export type CreateLogStreamArgs = {
  printLog: boolean;
  onLog?: (log: string) => void;
};

export function createLogStream({ printLog, onLog }: CreateLogStreamArgs) {
  const logStream = new stream.PassThrough();
  logStream.on("data", function (chunk) {
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
