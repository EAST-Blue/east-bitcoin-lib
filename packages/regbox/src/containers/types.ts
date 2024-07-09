export type PortMapping = {
  host: string;
  container: string;
};

export type VolumeMapping = {
  source: string;
  target: string;
};

export type ContainerAbstractParams = {
  socketPath?: string;
  name: string;
  image: string;
  cmd: string[];
  env: string[];
  networkName: string;
  portMappings: PortMapping[];
  volumeMappings: VolumeMapping[];
  printLog: boolean;
};
