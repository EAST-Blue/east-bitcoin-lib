import Docker, { Container } from "dockerode";
import { createLogStream } from "../utils/utils";

export type PortMapping = {
  host: string;
  container: string;
};

export type ContainerAbstractArgs = {
  socketPath?: string;
  name: string;
  image: string;
  cmd: string[];
  env: string[];
  portMappings: PortMapping[];
  printLog: boolean;
};

// TODO:
// 1. check image exist, if not then pull the image
// 2. attach east_network into each container
export abstract class ContainerAbstract {
  name: string;
  image: string;
  cmd: string[];
  env: string[];
  portMappings: PortMapping[];
  printLog: boolean;

  docker: Docker;
  container?: Container;

  constructor({
    socketPath,
    name,
    image,
    cmd,
    env,
    portMappings,
    printLog,
  }: ContainerAbstractArgs) {
    this.name = name;
    this.image = image;
    this.cmd = cmd;
    this.env = env;
    this.portMappings = portMappings;
    this.printLog = printLog;

    this.docker = new Docker({ socketPath });
  }

  private async logs() {
    if (!this.container) {
      throw new Error(
        "errors.can't see the logs, the container is not running",
      );
    }

    const logStream = createLogStream({
      printLog: true,
    });

    console.info(`info.attaching log for ${this.name}`);
    const stream = await this.container.logs({
      follow: true,
      stderr: true,
      stdout: true,
    });
    this.container.modem.demuxStream(stream, logStream, logStream);

    stream.on("end", () => {
      logStream.end(`info.ended logs for ${this.name}`);
      logStream.destroy();
    });
  }

  async shutdown() {
    if (!this.container) {
      return;
    }

    console.info(`info.shutting down ${this.name}`);
    await this.container.stop();
    await this.container.remove();
  }

  async start() {
    try {
      console.info(`info.starting ${this.name}`);
      const exposedPortsObj = this.portMappings.reduce((prev, portMapping) => {
        return {
          ...prev,
          [portMapping.container]: {},
        };
      }, {});
      const portBindings = this.portMappings.reduce((prev, portMapping) => {
        return {
          ...prev,
          [portMapping.container]: [
            {
              HostPort: portMapping.host,
            },
          ],
        };
      }, {});

      const container = await this.docker.createContainer({
        Image: this.image,
        Cmd: this.cmd,
        ExposedPorts: exposedPortsObj,
        HostConfig: {
          PortBindings: portBindings,
        },
        Env: this.env,
      });
      await container.start();
      this.container = container;

      if (this.printLog) {
        await this.logs();
      }

      await this.waitUntilReady();

      console.info(`info.${this.name} is ready`);
      return this.container;
    } catch (error) {
      this.shutdown();
      throw error;
    }
  }

  async execCommand(cmd: string[]) {
    if (!this.container) {
      throw new Error(
        "errors.can't execute the command, the container is not running",
      );
    }

    let successLog = "";
    let errorLog = "";

    const successLogStream = createLogStream({
      printLog: false,
      onLog: (log: string) => {
        successLog += log;
      },
    });
    const errorLogStream = createLogStream({
      printLog: false,
      onLog: (log: string) => {
        errorLog += log;
      },
    });

    const exec = await this.container.exec({
      Cmd: cmd,
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({
      hijack: false,
      stdin: false,
    });
    this.docker.modem.demuxStream(stream, successLogStream, errorLogStream);

    return new Promise((resolve, reject) => {
      stream.on("end", () => {
        successLogStream.destroy();

        if (errorLog) {
          reject(errorLog);
        }
        resolve(successLog);
      });
    });
  }

  abstract waitUntilReady(): Promise<void>;
}

export * from "./bitcoin";
export * from "./electrs";
export * from "./types";
