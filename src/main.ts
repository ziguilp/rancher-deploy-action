/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-01-16 11:47:35
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-01-17 16:09:46
 * @FilePath      : /rancher-deploy-action/src/main.ts
 * @Description   :
 *
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved.
 */
import * as core from '@actions/core';

import {getInputs} from './context';
import Rancher from './rancher';

(async () => {
  const {rancher, dockerImage} = await getInputs();
  console.log(rancher, dockerImage);

  const client = new Rancher(rancher.serviceInfoApiUrl, rancher.accessKey, rancher.secretKey);

  const result = await client.upgradeServiceByNewDockerImage(dockerImage);

  core.info(`Success:upgrade image to: ${result.launchConfig.imageUuid}`);
  core.info(`Upgrade done， please confirm it in rancher UI`);
  core.setOutput('envId', client.rancherEnvId);
  core.setOutput('serviceId', client.rancherServiceId);
  core.setOutput('dockerImage', dockerImage);
})().catch(err => {
  core.setFailed(err.message);
});
