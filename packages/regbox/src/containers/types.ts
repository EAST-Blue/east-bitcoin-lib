export type PortMapping = {
  host: string;
  container: string;
};

export type ContainerAbstractParams = {
  socketPath?: string;
  name: string;
  image: string;
  cmd: string[];
  env: string[];
  networkName: string;
  portMappings: PortMapping[];
  printLog: boolean;
};
