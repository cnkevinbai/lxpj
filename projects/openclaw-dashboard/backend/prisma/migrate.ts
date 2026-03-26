import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // This file is for manual migrations if needed
  console.log('Migration setup complete');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });