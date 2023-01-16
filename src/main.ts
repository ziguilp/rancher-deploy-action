/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-01-16 11:47:35
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-01-16 16:51:50
 * @FilePath      : /rancher-deploy-action/src/main.ts
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import * as core from '@actions/core';

import { getInputs } from './context';
import Rancher from './rancher';

(async () => {
    const { rancher, dockerImage, projectName, serviceName } = await getInputs();

    const client = new Rancher(rancher.urlApi, rancher.accessKey, rancher.secretKey);

    const { data: projects } = await client.fetchProjectsAsync();
    for (const project of projects) {

        if (project.name != projectName) continue;

        const { data: services } = await client.fetchProjectServicesAsync(project);
        const service = services.find(({ name }) => name === serviceName);
        if (service) {
            const result = await client.changeImageAsync(service, {
                name: serviceName,
                image: dockerImage
            });
            core.info(`${projectName}-${serviceName} upgrade image to: ${result.launchConfig.imageUuid}`);
            core.info(`Upgrade done， please confirm it in rancher UI`);
            core.setOutput('projectName', projectName);
            core.setOutput('serviceName', serviceName);
            core.setOutput('dockerImage', dockerImage);
            core.setOutput('status', 'success');
            return;
        } else {
            throw new Error(`Couldn't found service "${serviceName}" in project "${projectName}"`);
        }
    }
})().catch(err => {
    core.setFailed(err.message);
});
