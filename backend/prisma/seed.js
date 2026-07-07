import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  await prisma.announcement.deleteMany({});
  await prisma.auditDocument.deleteMany({});
  await prisma.audit.deleteMany({});
  await prisma.auditTopic.deleteMany({});
  await prisma.indicator.deleteMany({});
  await prisma.indicatorCycle.deleteMany({});
  await prisma.organization.deleteMany({});

  console.log('Seeding audit topics...');
  const topics = [
    { name: 'Registo de Atividade Semestral', required: true },
    { name: 'Relatório de Contas', required: true },
    { name: 'Estatutos Atualizados', required: true },
    { name: 'Ata da Assembleia Geral', required: true }
  ];
  for (const t of topics) {
    await prisma.auditTopic.create({
      data: t
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
