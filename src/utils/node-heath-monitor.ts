import { removeDevicesForNodes } from '../data-service/device-service';
import { NodeService } from '../data-service/node-service';
import { isDeviceFarmRunning } from '../helpers';
import log from '../logger';

export class NodeHealthMonitor {
  private interval!: NodeJS.Timeout;
  private static instance: NodeHealthMonitor;

  private constructor() {}

  public static getInstance(): NodeHealthMonitor {
    if (!NodeHealthMonitor.instance) {
      NodeHealthMonitor.instance = new NodeHealthMonitor();
    }
    return NodeHealthMonitor.instance;
  }

  public async start(intervalMs: number) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    await this.checkNodeHealth();
    this.interval = setInterval(() => {
      this.checkNodeHealth();
    }, intervalMs);
  }

  private async checkNodeHealth() {
    const nodes = await NodeService.getActiveNodes();
    const offlineNodes = [];
    for (const node of nodes) {
      if (!(await isDeviceFarmRunning(node.host))) {
        log.warn(`Node ${node.id} with host ${node.host} is not running`);
        offlineNodes.push(node.id);
      }
    }
    if (offlineNodes.length > 0) {
      await NodeService.setNodeOffline(offlineNodes);
      await removeDevicesForNodes(offlineNodes);
    }
  }
}
