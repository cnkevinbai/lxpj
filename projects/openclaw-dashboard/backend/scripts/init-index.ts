import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default RAG index if it doesn't exist
  const defaultIndex = await prisma.rAGIndex.findUnique({
    where: { name: 'default' },
  });

  if (!defaultIndex) {
    await prisma.rAGIndex.create({
      data: {
        name: 'default',
        status: 'EMPTY',
        documentCount: 0,
        chunkCount: 0,
      },
    });
    console.log('Default RAG index created');
  } else {
    console.log('Default RAG index already exists');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });