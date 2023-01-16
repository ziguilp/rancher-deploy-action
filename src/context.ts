/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-01-16 11:47:35
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-01-16 17:39:16
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
        serviceInfoApiUrl: string;
    };
    dockerImage: string;
};

export async function getInputs(): Promise<Inputs> {
    if (!process.env.GITHUB_ACTIONS) {
        return {
            rancher: {
                accessKey: process.env['RANCHER_ACCESS_KEY'] || '',
                secretKey: process.env['RANCHER_SECRET_KEY'] || '',
                serviceInfoApiUrl: process.env['RANCHER_SERVICE_INFO_API_URL'] || ''
            },
            dockerImage: process.env['DOCKER_IMAGE'] || '',
        };
    }

    return {
        rancher: {
            accessKey: core.getInput('rancherAccessKey'),
            secretKey: core.getInput('rancherSecretKey'),
            serviceInfoApiUrl: core.getInput('serviceInfoApiUrl')
        },
        dockerImage: core.getInput('dockerImage')
    };
}
