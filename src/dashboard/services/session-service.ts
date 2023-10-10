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
