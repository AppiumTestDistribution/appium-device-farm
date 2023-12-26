import { prisma } from '../../prisma';

export async function getOrCreateNewBuild(buildName: string) {
  const build = await prisma.build.findFirst({
    where: {
      name: buildName,
    },
  });

  if (!build) {
    return await prisma.build.create({
      data: {
        name: buildName,
      },
    });
  }

  return build;
}

export async function getSessionById(sessionId: string) {
  return await prisma.session.findFirst({
    where: {
      id: sessionId,
    },
  });
}

export async function updateSessionDetails(sessionId: string, data: any) {
  return await prisma.session.update({
    where: {
      id: sessionId,
    },
    data,
  });
}
