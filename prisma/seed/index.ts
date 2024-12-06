import { PrismaClient } from '@prisma/client';
import { join } from 'node:path';
import { promises as fsp } from 'node:fs';

const prisma = new PrismaClient();

async function seed() {
  try {
    const path = join(process.cwd(), '/prisma/seed');

    const seedFiles = (await fsp.readdir(path)).filter((item) =>
      item.endsWith('.seed.ts'),
    );

    const resp = await Promise.all(
      seedFiles.map(async (file) => {
        const data = await (await import(join(path, file))).seed(prisma);

        return data;
      }),
    );

    console.log(resp);
  } catch (error) {
    console.log(error);
  }
}

seed()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
