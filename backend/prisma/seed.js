import prisma from '../src/lib/prisma.js';

async function main() {
  if (!prisma) {
    throw new Error('Prisma Client failed to initialize. Check DATABASE_URL.');
  }

  console.log('Clearing database...');
  await prisma.announcementRead.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.objective.deleteMany({});
  await prisma.auditDocument.deleteMany({});
  await prisma.audit.deleteMany({});
  await prisma.indicator.deleteMany({});
  await prisma.indicatorCycle.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});

  console.log('Seeding organizations...');
  
  // JE Porto
  await prisma.organization.create({
    data: {
      name: 'JE Porto',
      status: 'JUNIOR_ENTERPRISE',
      audits: {
        create: [
          { year: 2026, status: 'APPROVED', score: 94.5 }
        ]
      },
      indicatorCycles: {
        create: [
          {
            semester: '2026.1',
            status: 'CLOSED',
            indicators: {
              create: [
                { key: 'Faturamento', value: 8240 },
                { key: 'NumeroMembros', value: 45 },
                { key: 'NPS', value: 92 }
              ]
            }
          }
        ]
      }
    }
  });

  // JE Lisboa
  await prisma.organization.create({
    data: {
      name: 'JE Lisboa',
      status: 'JUNIOR_ENTERPRISE',
      audits: {
        create: [
          { year: 2026, status: 'DOCUMENTS_SUBMITTED', score: null }
        ]
      },
      indicatorCycles: {
        create: [
          {
            semester: '2026.1',
            status: 'UNDER_REVIEW',
            indicators: {
              create: [
                { key: 'Faturamento', value: 5400 },
                { key: 'NumeroMembros', value: 38 },
                { key: 'NPS', value: 85 }
              ]
            }
          }
        ]
      }
    }
  });

  // Júnior Minho
  await prisma.organization.create({
    data: {
      name: 'Júnior Minho',
      status: 'JUNIOR_INITIATIVE',
      audits: {
        create: [
          { year: 2026, status: 'SCHEDULED', score: null }
        ]
      },
      indicatorCycles: {
        create: [
          {
            semester: '2026.1',
            status: 'DRAFT',
            indicators: {
              create: [
                { key: 'Faturamento', value: 1200 },
                { key: 'NumeroMembros', value: 20 },
                { key: 'NPS', value: 75 }
              ]
            }
          }
        ]
      }
    }
  });

  // Coimbra Júnior
  await prisma.organization.create({
    data: {
      name: 'Coimbra Júnior',
      status: 'JUNIOR_ENTERPRISE',
      audits: {
        create: [
          { year: 2026, status: 'REJECTED', score: 45.0 }
        ]
      },
      indicatorCycles: {
        create: [
          {
            semester: '2026.1',
            status: 'UNDER_REVIEW',
            indicators: {
              create: [
                { key: 'Faturamento', value: 3900 },
                { key: 'NumeroMembros', value: 28 },
                { key: 'NPS', value: 60 }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Seeding announcements...');
  await prisma.announcement.createMany({
    data: [
      { title: 'Abertura das candidaturas jeniAL 2026', content: 'As propostas para os prémios jeniAL estão oficialmente abertas a partir de hoje até 31 de Agosto.' },
      { title: 'Submissão de Censos Anuais até 31 de Julho', content: 'Certifique-se de que a sua Júnior Empresa submete o formulário completo de censos antes do final do mês.' }
    ]
  });

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
