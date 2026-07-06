import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  await prisma.announcementRead.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.objective.deleteMany({});
  await prisma.auditDocument.deleteMany({});
  await prisma.audit.deleteMany({});
  await prisma.auditTopic.deleteMany({});
  await prisma.indicator.deleteMany({});
  await prisma.indicatorCycle.deleteMany({});
  await prisma.user.deleteMany({});
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

  console.log('Seeding organizations...');
  
  // JE Porto (APPROVED - 100% score)
  await prisma.organization.create({
    data: {
      name: 'JE Porto',
      status: 'JUNIOR_ENTERPRISE',
      audits: {
        create: [
          {
            year: 2026,
            status: 'APPROVED',
            score: 100.0,
            documents: {
              create: [
                { name: 'Registo de Atividade Semestral', isApproved: true, fileUrl: '/uploads/registo_atividade.pdf' },
                { name: 'Relatório de Contas', isApproved: true, fileUrl: '/uploads/relatorio_contas.pdf' },
                { name: 'Estatutos Atualizados', isApproved: true, fileUrl: '/uploads/estatutos.pdf' },
                { name: 'Ata da Assembleia Geral', isApproved: true, fileUrl: '/uploads/ata_ag.pdf' }
              ]
            }
          }
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

  // JE Lisboa (DOCUMENTS_SUBMITTED - 50% score)
  await prisma.organization.create({
    data: {
      name: 'JE Lisboa',
      status: 'JUNIOR_ENTERPRISE',
      audits: {
        create: [
          {
            year: 2026,
            status: 'DOCUMENTS_SUBMITTED',
            score: 50.0,
            documents: {
              create: [
                { name: 'Registo de Atividade Semestral', isApproved: true, fileUrl: '/uploads/registo_atividade.pdf' },
                { name: 'Relatório de Contas', isApproved: true, fileUrl: '/uploads/relatorio_contas.pdf' },
                { name: 'Estatutos Atualizados', isApproved: null, fileUrl: '/uploads/estatutos.pdf' },
                { name: 'Ata da Assembleia Geral', isApproved: null, fileUrl: '/uploads/ata_ag.pdf' }
              ]
            }
          }
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

  // Júnior Minho (SCHEDULED - 0% score)
  await prisma.organization.create({
    data: {
      name: 'Júnior Minho',
      status: 'JUNIOR_INITIATIVE',
      audits: {
        create: [
          {
            year: 2026,
            status: 'SCHEDULED',
            score: 0.0,
            documents: {
              create: [
                { name: 'Registo de Atividade Semestral', isApproved: null, fileUrl: null },
                { name: 'Relatório de Contas', isApproved: null, fileUrl: null },
                { name: 'Estatutos Atualizados', isApproved: null, fileUrl: null },
                { name: 'Ata da Assembleia Geral', isApproved: null, fileUrl: null }
              ]
            }
          }
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

  // Coimbra Júnior (REJECTED - 25% score)
  await prisma.organization.create({
    data: {
      name: 'Coimbra Júnior',
      status: 'JUNIOR_ENTERPRISE',
      audits: {
        create: [
          {
            year: 2026,
            status: 'REJECTED',
            score: 25.0,
            documents: {
              create: [
                { name: 'Registo de Atividade Semestral', isApproved: true, fileUrl: '/uploads/registo_atividade.pdf' },
                { name: 'Relatório de Contas', isApproved: false, fileUrl: '/uploads/relatorio_contas.pdf', feedback: 'Relatório de contas incompleto, falta assinatura do conselho fiscal.' },
                { name: 'Estatutos Atualizados', isApproved: null, fileUrl: '/uploads/estatutos.pdf' },
                { name: 'Ata da Assembleia Geral', isApproved: null, fileUrl: '/uploads/ata_ag.pdf' }
              ]
            }
          }
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
