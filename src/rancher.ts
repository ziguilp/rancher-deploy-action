/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-01-16 11:47:35
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-01-16 18:28:33
 * @FilePath      : /rancher-deploy-action/src/rancher.ts
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import fetch from 'node-fetch';

type DeploymentConfig = {
    image: string;
    name: string;
};

type ServiceActions = {
    restart: string;
    upgrade: string;
    update: string;
    remove: string;
};

type ServiceLinks = {
    remove: string;
    revisions: string;
    self: string;
    update: string;
    yaml: string;
};

type LaunchConfig = {
    type: "launchConfig",
    imageUuid: string;
    kind: 'container';
};

type UpgradeInServiceStrategy = {
    imageUuid: string;
    batchSize: number;
    intervalMillis: number;
    startFirst: boolean;
    launchConfig: LaunchConfig
}

type UpgradeToServiceStrategy = {
    batchSize: number;
    finalScale: number;
    intervalMillis: number;
    toServiceId: string;
    updateLinks: boolean;
}

type ServiceUpgrade = {
    inServiceStrategy: UpgradeInServiceStrategy;
    toServiceStrategy: UpgradeToServiceStrategy | null
}

type Service = {
    id: string;
    actions: ServiceActions;
    baseType: 'service';
    created: string;
    links: ServiceLinks;
    name: string;
    state: string;
    environmentId: string;
    accountId: string;
    currentScale?: number;
    launchConfig: LaunchConfig;
    upgrade?: ServiceUpgrade;
};

type ProjectLinks = {
    services: string;
};

type Project = {
    id: string;
    name: string;
    links: ProjectLinks;
};

class Rancher {

    /**
     * rancherAPI
     */
    public readonly rancherApi: string;

    /**
     * rancherServiceUrl
     */
    private readonly rancherServiceUrl: string;

    /**
     * rancher环境ID
     */
    public readonly rancherEnvId: string;

    /**
     * rancher服务ID
     */
    public readonly rancherServiceId: string;

    /**
     * 请求头
     */
    private readonly headers: any;

    constructor(private rancherServiceUrlApi: string, rancherAccessKey: string, rancherSecretKey: string) {

        const ma = rancherServiceUrlApi.match(/^(https?:\/\/.*?\/)(v1|v2\-beta)\/projects\/([a-z0-9]+)\/services\/([a-z0-9]+)$/i)

        if (!ma) {
            throw new Error(`Error: Format of RancherServiceUrlApi:${rancherServiceUrlApi} is wrong`);
        }
        this.rancherServiceUrl = rancherServiceUrlApi;
        this.rancherApi = ma[1] + ma[2];
        this.rancherEnvId = ma[3];
        this.rancherServiceId = ma[4];

        const token = Buffer.from(rancherAccessKey + ':' + rancherSecretKey).toString('base64');
        this.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + token,
        };
    }

    /**
     * 读取当前APIkey下的所有环境
     * @returns 
     */
    async fetchProjectsAsync() {
        const req = await fetch(`${this.rancherApi}/projects`, {
            method: 'GET',
            headers: this.headers
        });

        return req.json() as Promise<{
            data: Project[];
        }>;
    }

    /**
     * 读取当前环境的所有服务
     * @param project 
     * @returns 
     */
    async fetchProjectServicesAsync(project: Project) {

        const req = await fetch(`${this.rancherApi}/projects/${this.rancherEnvId}/services`, {
            method: 'GET',
            headers: this.headers
        });

        return req.json() as Promise<{
            data: Service[];
        }>;
    }


    /**
     * 升级服务
     */
    async upgradeServiceByNewDockerImage(dockerImage: string) {

        const req = await fetch(this.rancherServiceUrl, { method: 'GET', headers: this.headers });

        if (req.status === 404) {
            throw new Error(`Can not get service's info : ${this.rancherServiceUrl}`)
        }

        const data = await req.json() as Service;

        if (!data.upgrade) {
            throw new Error(`Can not upgrade service: ${this.rancherServiceUrl}`)
        }

        const { actions } = data;
        const newImageName = 'docker:' + dockerImage

        try {
            if (data.upgrade.inServiceStrategy.launchConfig.imageUuid.split(":")[1] !== newImageName.split(":")[1]) {
                throw new Error(`Can't upgrade service which image registry has been changed:${this.rancherServiceUrl},Please upgrade Mannal`)
            }
        } catch (error) {
            throw error
        }

        data.upgrade.inServiceStrategy.launchConfig.imageUuid = newImageName

        const req2 = await fetch(actions.upgrade, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                inServiceStrategy: data.upgrade.inServiceStrategy,
                toServiceStrategy: data.upgrade.toServiceStrategy || null
            } as ServiceUpgrade)
        })

        if (req2.status >= 200 && req2.status < 400) {
            return req2.json() as Promise<Service>;
        }

        try {
            const r = await req2.json() as any
            if (r.code) {
                throw new Error(`Service Upgrade failed: ${r.code}`)
            }
        } catch (error) {

        }
        throw new Error(`Service Upgrade failed: ${await req2.text()}`)
    }
}

export default Rancher;
