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
  networkName: string;
  portMappings: PortMapping[];
  printLog: boolean;
};

export abstract class ContainerAbstract {
  name: string;
  image: string;
  cmd: string[];
  env: string[];
  networkName: string;
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
    networkName,
    portMappings,
    printLog,
  }: ContainerAbstractArgs) {
    this.name = name;
    this.image = image;
    this.cmd = cmd;
    this.env = env;
    this.networkName = networkName;
    this.portMappings = portMappings;
    this.printLog = printLog;

    this.docker = new Docker({ socketPath });
  }

  private async logs() {
    if (!this.container) {
      return;
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

  private async connectNetwork() {
    if (!this.container) {
      return;
    }

    const networks = await this.docker.listNetworks();

    let networkId = networks.find(
      (network) => network.Name === this.networkName,
    )?.Id;
    let network;

    if (networkId) {
      console.info(`info.use exising network ${this.networkName}`);
      network = this.docker.getNetwork(networkId);
    } else {
      console.info(`info.creating network ${this.networkName}`);
      network = await this.docker.createNetwork({
        Name: this.networkName,
      });
    }

    console.info(`info.connecting network into ${this.name}`);
    await network.connect({
      Container: this.container.id,
    });

    return;
  }

  private async pullImage() {
    console.info(`info.pulling image ${this.image}`);
    const logStream = createLogStream({ printLog: this.printLog });
    const stream = await this.docker.pull(this.image);
    stream.pipe(logStream);

    return new Promise(async (resolve) => {
      stream.on("end", () => {
        logStream.destroy();
        resolve(true);
      });
    });
  }

  // hacky trick to check image exist or not
  private async imageExist() {
    const image = this.docker.getImage(this.image);
    try {
      await image.inspect();
      return true;
    } catch (error: any) {
      if (error.message && (error.message as string).includes("404")) {
        return false;
      }
      throw error;
    }
  }

  private async checkImage() {
    const exist = await this.imageExist();
    if (exist) {
      console.info(`info.use exising image ${this.image}`);
    } else {
      await this.pullImage();
    }
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
      console.info(`info.checking image ${this.image}`);

      await this.checkImage();
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
        name: this.name,
        Image: this.image,
        Cmd: this.cmd,
        ExposedPorts: exposedPortsObj,
        HostConfig: {
          PortBindings: portBindings,
        },
        Env: this.env,
        NetworkingConfig: {},
      });
      this.container = container;
      await this.connectNetwork();

      await container.start();

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
        "errors.can't execute the command, the container is not ready",
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
