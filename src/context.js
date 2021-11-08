import csvparse from 'csv-parse/lib/sync';
import * as core from '@actions/core';

export async function getInputs(defaultContext) {
  return {
    context: core.getInput('context') || defaultContext,
    tags: await getInputList('tags'),
  };
}

export async function getInputList(name, ignoreComma = false) {
  let res = [];

  const items = core.getInput(name);
  if (items == '') {
    return res;
  }

  for (let output of (await csvparse(items, {
    columns: false,
    relax: true,
    relaxColumnCount: true,
    skipLinesWithEmptyValues: true
  }))) {
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

