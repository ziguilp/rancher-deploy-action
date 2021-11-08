# Action for Github to deploy image in Rancher using Rancher API

## Inputs

### `rancherUrlApi`

**Required** API Url of your rancher project workload.

### `rancherAccessKey`

**Required** API Access key created in Rancher.

### `rancherSecretKey`

**Required** API Secret key created in Rancher.

### `serviceName`

**Required** NAME OF YOUR SERVICE ON RANCHER CLUSTER WHAT YOU WANT DEPLOY.

### `namespaceId`

**Optional** ID OF THE NAMESPACE.

## Example usage

```yml
- name: Rancher Deploy
  uses: giautm/rancher-deploy-action@v0.1.3
  with:
    rancherUrlApi: ${{ secrets.RANCHER_URL_API }}
    rancherAccessKey: ${{ secrets.RANCHER_ACCESS_KEY}}
    rancherSecretKey: ${{ secrets.RANCHER_SECRET_KEY }}
    dockerImage: ${{ fromJSON(steps.docker-meta.outputs.json).tags[0] }}
    serviceName: 'myProject'
    namespaceId: 'xxxxxxxx'
```
