import parseCSV from 'csv-parse/lib/sync';
import * as core from '@actions/core';

export type Inputs = {
  rancher: {
    accessKey: string;
    secretKey: string;
    urlApi: string;
  };
  serviceName: string;
  tags: string[];
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
    tags: await getInputList('tags'),
    namespaceId: core.getInput('namespaceId')
  };
}

export async function getInputList(name: string, ignoreComma?: boolean) {
  let res: string[] = [];

  const items = core.getInput(name);
  if (items == '') {
    return res;
  }

  const data = await parseCSV(items, {
    columns: false,
    relax: true,
    relaxColumnCount: true,
    skipLinesWithEmptyValues: true
  });
  for (let output of data) {
    if (output.length == 1) {
      res.push(output[0]);
      continue;
    } else if (!ignoreComma) {
      res.push(...output);
      continue;
    }
    res.push(output.join(','));
  }

  return res.filter(item => item).map(pat => pat.trim());
}
