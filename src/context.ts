/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-01-16 11:47:35
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-01-16 13:10:27
 * @FilePath      : /rancher-deploy-action/src/context.ts
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import * as core from '@actions/core';

export type Inputs = {
    rancher: {
        accessKey: string;
        secretKey: string;
        urlApi: string;
    };
    serviceName: string;
    dockerImage: string;
    projectName: string;
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
            projectName: process.env['PROJECT_NAME'] || ''
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
        projectName: core.getInput('projectName')
    };
}
