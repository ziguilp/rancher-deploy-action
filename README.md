
# Action for Github to deploy image in Rancher1.6 using Rancher API

## Inputs

### `rancherUrlApi`

**Required** API Url of your rancher project workload.

### `rancherAccessKey`

**Required** API Access key created in Rancher.

### `rancherSecretKey`

**Required** API Secret key created in Rancher.

### `serviceName`

**Required** NAME OF YOUR SERVICE ON RANCHER CLUSTER WHAT YOU WANT DEPLOY.

### `projectName`

**Optional** 应用名称.

## Example usage

```yml
- name: Rancher Deploy
  uses: ziguilp/docker-image-deploy-in-rancher1.6@v0.1
  with:
    rancherUrlApi: ${{ secrets.RANCHER_URL_API }}
    rancherAccessKey: ${{ secrets.RANCHER_ACCESS_KEY}}
    rancherSecretKey: ${{ secrets.RANCHER_SECRET_KEY }}
    dockerImage: ${{ fromJSON(steps.docker-meta.outputs.json).tags[0] }}
    serviceName: 'server'
    projectName: 'myProject'
```
