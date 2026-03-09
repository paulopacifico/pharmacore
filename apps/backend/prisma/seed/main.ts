import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { seedAuthModule } from './auth-module';
import { seedBranchModule } from './branch-module';
import { seedProductModule } from './product-module';

const adapter = new PrismaPg({
  connectionString: 'postgresql://docker:docker@localhost:5432',
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('Start seeding...');

  await seedAuthModule(prisma);
  await seedBranchModule(prisma);
  await seedProductModule(prisma);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
