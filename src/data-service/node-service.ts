import { Node } from '@prisma/client';
import { IPluginArgs } from '../interfaces/IPluginArgs';
import os from 'os';
import { prisma } from '../prisma';
import { JWT_SECRET } from '../auth/middleware/auth.middleware';
import { DevicePlugin } from '../plugin';
import log from '../logger';

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
      isHub,
    };

    await NodeService.addNode(nodeId, nodeDetails as any);
    if (!isHub) {
      delete nodeDetails.isHub;
      await DevicePlugin.apiClient.registerNode(nodeDetails);
    }
  }

  static async addNode(nodeId: string, node: Node, userId?: string) {
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
      addedBy: userId ?? null,
    };

    if (isNodeExists) {
      log.info('Node already exists. So updating..');
      await prisma.node.update({
        data,
        where: {
          id: nodeId,
        },
      });
    } else {
      log.info('Node not exists. So creating..');
      await prisma.node.create({
        data: {
          ...data,
          id: nodeId,
        },
      });
    }
  }

  static async getAllNodes(secure = true) {
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
        addedByUser: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
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
