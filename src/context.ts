import * as core from '@actions/core';

export type Inputs = {
  rancher: {
    accessKey: string;
    secretKey: string;
    urlApi: string;
  };
  serviceName: string;
  dockerImage: string;
  namespaceId?: string;
};

export async function getInputs(): Promise<Inputs> {
  return {
    rancher: {
      accessKey: core.getInput('rancherAccessKey'),
      secretKey: core.getInput('rancherSecretKey'),
      urlApi: core.getInput('rancherUrlApi')
    },
    serviceName: core.getInput('serviceName'),
    dockerImage: core.getInput('dockerImage'),
    namespaceId: core.getInput('namespaceId')
  };
}
