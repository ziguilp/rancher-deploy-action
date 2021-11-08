import {getInputs} from './context';
import Rancher from './rancher';

(async () => {
  const {rancher, dockerImage, serviceName, namespaceId} = await getInputs();

  const client = new Rancher(rancher.urlApi, rancher.accessKey, rancher.secretKey);

  const {data: projects}: any = await client.fetchProjectsAsync();
  for (const project of projects) {
    const {data: workloads}: any = await client.fetchProjectWorkloadsAsync(project.id);
    const workload = workloads.find(({name, namespaceId: nsId}) => name === serviceName && (!namespaceId || namespaceId === nsId));
    if (workload) {
      const {links, namespaceId} = workload;
      await client.changeImageAsync(links.self, namespaceId, {
        name: serviceName,
        image: dockerImage
      });

      return;
    }
  }
})().catch(console.error);
