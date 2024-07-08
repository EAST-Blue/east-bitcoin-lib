import Docker, { Container } from "dockerode";
import { createLogStream } from "../utils";
import { ContainerAbstractParams, PortMapping } from "./types";

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
  }: ContainerAbstractParams) {
    this.name = name;
    this.image = image;
    this.cmd = cmd;
    this.env = env;
    this.networkName = networkName;
    this.portMappings = portMappings;
    this.printLog = printLog;

    this.docker = new Docker({ socketPath });
  }

  async logs() {
    if (!this.container) {
      return;
    }

    const logStream = createLogStream({
      printLog: true,
    });

    this.logger(`attaching log for ${this.name}`);
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

  private async getNetworkId(): Promise<string | undefined> {
    if (!this.container) {
      return undefined;
    }

    const networks = await this.docker.listNetworks();
    let networkId = networks.find(
      (network) => network.Name === this.networkName,
    )?.Id;

    return networkId;
  }

  private async connectNetwork() {
    if (!this.container) {
      return;
    }

    const networkId = await this.getNetworkId();
    let network;

    if (networkId) {
      this.logger(`use exising network ${this.networkName}`);
      network = this.docker.getNetwork(networkId);
    } else {
      this.logger(`creating network ${this.networkName}`);
      network = await this.docker.createNetwork({
        Name: this.networkName,
      });
    }

    this.logger(`connecting network into ${this.name}`);
    await network.connect({
      Container: this.container.id,
    });

    return;
  }

  private async removeNetwork() {
    if (!this.container) {
      return;
    }

    const networkId = await this.getNetworkId();
    if (!networkId) {
      return;
    }

    const network = this.docker.getNetwork(networkId);
    await network.remove();
  }

  private async getContainerId(): Promise<string | undefined> {
    const containers = await this.docker.listContainers({ all: true });
    let containerId = containers.find(
      (container) => container.Image === this.image,
    )?.Id;

    return containerId;
  }

  private async removeContainer() {
    const containerId = await this.getContainerId();
    if (!containerId) {
      return;
    }

    const container = this.docker.getContainer(containerId);
    await container.remove();
  }

  private async pullImage() {
    this.logger(`info.pulling image ${this.image}`);
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
      this.logger(`use exising image ${this.image}`);
    } else {
      await this.pullImage();
    }
  }

  async shutdown() {
    if (!this.container) {
      return;
    }

    this.logger(`shutting down ${this.name}`);
    await this.container.stop();
    await this.container.remove();
  }

  async cleanUp() {
    this.logger(`cleaning up ${this.name}`);

    await this.removeContainer();
    await this.removeNetwork();
  }

  async start() {
    try {
      this.logger(`starting ${this.name}`);
      this.logger(`checking image ${this.image}`);

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

      this.logger(`${this.name} is ready`);
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

  abstract logger(log: string): void;
  abstract waitUntilReady(): Promise<void>;
}

export * from "./bitcoin";
export * from "./electrs";
export * from "./types";
