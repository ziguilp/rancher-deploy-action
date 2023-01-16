
# Action for Github to deploy image in Rancher1.6 using Rancher API

## Inputs

### `serviceInfoApiUrl`

**Required** Service API Url of your rancher service, you can get it in Rancher UI ,like: https://rancher.test.com/v2-beta/projects/1a22/services/1s33.

### `rancherAccessKey`

**Required** API Access key created in Rancher.

### `rancherSecretKey`

**Required** API Secret key created in Rancher.


### `dockerImage`

**Optional** docker image, like: test/nginx:latest

## Example usage

```yml
- name: Rancher Deploy
  uses: ziguilp/rancher-deploy-action@v0.3
  with:
    serviceInfoApiUrl: ${{ secrets.RANCHER_SERVICE_INFO_API_URL }} #通过rancherUI查看服务的API信息, 例如： 'https://rancher.test.com/v2-beta/projects/1a22/services/1s33' #
    rancherAccessKey: ${{ secrets.RANCHER_ACCESS_KEY}}
    rancherSecretKey: ${{ secrets.RANCHER_SECRET_KEY }}
    dockerImage: ${{ fromJSON(steps.docker-meta.outputs.json).tags[0] }}
```
