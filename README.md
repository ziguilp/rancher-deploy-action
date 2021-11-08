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
`````
  
- name: Rancher Deploy
  uses: giautm/rancher-deploy-action@v0.1.3
  with:
    rancherUrlApi: 'https://rancher.YOUR-DOMAIN.COM/v3'
    rancherAccessKey: 'XXXXXXX'
    rancherSecretKey: 'XXXXXXX'
    serviceName: 'myProject'
    tags:
      - helloworld:dev
    namespaceId: 'xxxxxxxx'

