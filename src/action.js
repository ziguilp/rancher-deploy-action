const { default: fetch } = require('node-fetch');
const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
  const rancherAccessKey = core.getInput('RANCHER_ACCESS_KEY');
  const rancherSecretKey = core.getInput('RANCHER_SECRET_KEY');
  const rancherUrlApi = core.getInput('RANCHER_URL_API');
  const dockerImage = core.getInput('DOCKER_IMAGE');
  const serviceName = core.getInput('SERVICE_NAME');

  const token = Buffer.from(rancherAccessKey + ':' + rancherSecretKey).toString('base64')
  const authorization = 'Basic ' + token
  async function fetchProjectsAsync() {
    const req = await fetch(`${rancherUrlApi}/projects`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
      },
    })

    return req.json()
  }

  async function fetchProjectWorkloadsAsync(projectId) {
    const req = await fetch(`${rancherUrlApi}/projects/${projectId}/workloads`, {
      method: 'GET',
      headers: { Authorization: authorization },
    })

    return req.json()
  }

  const { data: projects } = await fetchProjectsAsync()
  for (const project of projects) {
    const { data: workloads } = await fetchProjectWorkloadsAsync(project.id)
    const workload = workloads.find(({ name }) => name === serviceName)
    if (workload) {
      const {
        links: { self: rancherDeploymentPath },
        namespaceId,
      } = workload

      const req = await fetch(rancherDeploymentPath, {
        method: 'GET',
        headers: { Authorization: authorization },
      })
      if (req.status === 404) {
        const data = {
          containers: [
            {
              imagePullPolicy: 'Always',
              image: dockerImage,
              name: serviceName,
            },
          ],
          namespaceId,
          name: serviceName,
        }

        await fetch(rancherDeploymentPath, {
          method: 'POST',
          headers: { Authorization: authorization },
          body: JSON.stringify(data),
        })
      } else {
        const data = await req.json()
        data.containers[0].image = dockerImage

        await fetch(rancherDeploymentPath + '?action=redeploy', {
          method: 'PUT',
          headers: { Authorization: authorization },
          body: JSON.stringify(data),
        })
      }

      return
    }
  }
})()
