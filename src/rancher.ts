type DeploymentConfig = {
  image: string;
  name: string;
};

class Rancher {
  private readonly headers: any;

  constructor(private readonly rancherUrlApi: string, rancherAccessKey: string, rancherSecretKey: string) {
    const token = Buffer.from(rancherAccessKey + ':' + rancherSecretKey).toString('base64');
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + token
    };
  }

  async fetchProjectsAsync() {
    const req = await fetch(`${this.rancherUrlApi}/projects`, {
      method: 'GET',
      headers: this.headers
    });

    return req.json();
  }

  async fetchProjectWorkloadsAsync(projectId: string) {
    const req = await fetch(`${this.rancherUrlApi}/projects/${projectId}/workloads`, {
      method: 'GET',
      headers: this.headers
    });

    return req.json();
  }

  async changeImageAsync(workloadURL: string, namespaceId: string, config: DeploymentConfig) {
    const req = await fetch(workloadURL, {method: 'GET', headers: this.headers});
    if (req.status === 404) {
      const data = {
        containers: [
          {
            ...config,
            imagePullPolicy: 'Always'
          }
        ],
        namespaceId,
        name: config.name
      };

      await fetch(workloadURL, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });
    } else {
      const data: any = await req.json();
      data.containers[0].image = config.image;

      await fetch(workloadURL + '?action=redeploy', {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data)
      });
    }
  }
}

export default Rancher;
