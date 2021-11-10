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
  if (!process.env.GITHUB_ACTIONS) {
    return {
      rancher: {
        accessKey: process.env['RANCHER_ACCESS_KEY'] || '',
        secretKey: process.env['RANCHER_SECRET_KEY'] || '',
        urlApi: process.env['RANCHER_URL_API'] || ''
      },
      serviceName: process.env['SERVICE_NAME'] || '',
      dockerImage: process.env['DOCKER_IMAGE'] || '',
      namespaceId: process.env['NAMESPACE_ID']
    };
  }

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
