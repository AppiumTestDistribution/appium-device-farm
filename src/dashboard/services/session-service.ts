import { prisma } from '../../prisma';
import { DEVICE_FARM_CAPABILITIES } from '../../CapabilityManager';
import log from '../../logger';

interface Capabilities {
  [key: string]: string;
}

export async function getOrCreateNewBuild(capabilities: Capabilities) {
  const buildName = capabilities[DEVICE_FARM_CAPABILITIES.BUILD_NAME] || 'Unknown Build';

  const build = await prisma.build.findFirst({
    where: {
      name: buildName,
    },
  });
  if (!build) {
    return prisma.build.create({
      data: {
        name: buildName,
      },
    });
  }

  return build;
}

export async function getSessionById(sessionId: string) {
  return prisma.session.findUnique({
    where: { id: sessionId },
  });
}

export async function updateSessionDetails(sessionId: string, data: any) {
  log.info(`Updating session ${sessionId} with data: ${JSON.stringify(data)}`);
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (session) {
    return prisma.session
      .update({
        where: { id: sessionId },
        data,
      })
      .catch((error) => {
        log.error('Failed to update session:', error);
        throw error;
      });
  } else {
    log.error(`Session with id ${sessionId} not found`);
  }
}
