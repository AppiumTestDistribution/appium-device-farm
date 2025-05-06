import { Node } from '@prisma/client';
import { IPluginArgs } from '../interfaces/IPluginArgs';
import os from 'os';
import { prisma } from '../prisma';
import { JWT_SECRET } from '../auth/middleware/auth.middleware';
import { DevicePlugin } from '../plugin';

export class NodeService {
  static async register(isHub: boolean, nodeName: string, host: string, nodeId: string) {
    const nodeDetails: Partial<Node> = {
      name: nodeName || os.hostname(),
      id: nodeId,
      host,
      os: os.platform() == 'darwin' ? 'mac' : os.platform(),
      jwtSecretToken: JWT_SECRET,
      isOnline: true,
      tags: '',
    };

    if (isHub) {
      nodeDetails.isHub = true;
      await NodeService.addNode(nodeId, nodeDetails as any);
    } else {
      await DevicePlugin.apiClient.registerNode(nodeDetails);
    }
  }

  static async addNode(nodeId: string, node: Node) {
    const isNodeExists = await prisma.node.findFirst({
      where: {
        id: nodeId,
      },
    });

    const data = {
      name: node.name,
      host: node.host,
      tags: node.tags,
      os: node.os,
      jwtSecretToken: node.jwtSecretToken,
      isOnline: true,
      isHub: node.isHub,
    };
    if (isNodeExists) {
      await prisma.node.update({
        data,
        where: {
          id: nodeId,
        },
      });
    } else {
      await prisma.node.create({
        data: {
          ...data,
          id: nodeId,
        },
      });
    }
  }

  static async getAllNodes(secure: boolean = true) {
    return prisma.node.findMany({
      select: {
        id: true,
        name: true,
        host: true,
        os: true,
        isHub: true,
        isOnline: true,
        tags: true,
        jwtSecretToken: !secure,
      },
    });
  }

  static async getNodeById(id: string) {
    return prisma.node.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        host: true,
        os: true,
        isHub: true,
        isOnline: true,
        tags: true,
      },
    });
  }

  static async getActiveNodes() {
    return prisma.node.findMany({
      where: {
        isOnline: true,
        isHub: false,
      },
    });
  }

  static async setNodeOffline(nodeIds: string[]) {
    await prisma.node.updateMany({
      where: {
        id: {
          in: nodeIds,
        },
      },
      data: { isOnline: false },
    });
  }
}
