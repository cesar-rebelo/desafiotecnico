import express from 'express';
import cors from 'cors';
import organizacoesRouter from './routes/organizacoes.js';
import comunicacaoRouter from './routes/comunicacao.js';
import acompanhamentoRouter from './routes/acompanhamento.js';
import prisma from './lib/prisma.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/organizations', organizacoesRouter);
app.use('/api/announcements', comunicacaoRouter);
app.use('/api/acompanhamento', acompanhamentoRouter);

app.get('/api/dashboard/summary', async (req, res) => {
  if (!prisma) {
    return res.json({
      metrics: { totalOrganizations: 0, pendingAudits: 0, activeCycles: 0, comunicadosNaoLidos: 0 },
      organizationsStatus: [],
      announcements: []
    });
  }
  try {
    const [totalOrgs, pendingAudits, activeCycles, announcements] = await Promise.all([
      prisma.organization.count(),
      prisma.audit.count({
        where: {
          status: { in: ['SCHEDULED', 'DOCUMENTS_SUBMITTED'] }
        }
      }),
      prisma.indicatorCycle.count({
        where: {
          status: { in: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW'] }
        }
      }),
      prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const indicators = await prisma.indicator.findMany();
    let totalFaturamento = 0;
    let totalMembros = 0;
    let npsSum = 0;
    let npsCount = 0;

    indicators.forEach(ind => {
      if (ind.key === 'Faturamento') {
        totalFaturamento += ind.value;
      } else if (ind.key === 'NumeroMembros') {
        totalMembros += ind.value;
      } else if (ind.key === 'NPS') {
        npsSum += ind.value;
        npsCount++;
      }
    });

    const averageNps = npsCount > 0 ? Math.round(npsSum / npsCount) : 0;

    const orgs = await prisma.organization.findMany({
      include: {
        audits: true,
        indicatorCycles: true
      },
      orderBy: { name: 'asc' }
    });

    const formattedOrgs = orgs.map(org => {
      const latestAudit = org.audits[org.audits.length - 1];
      const latestCycle = org.indicatorCycles[org.indicatorCycles.length - 1];
      return {
        id: org.id,
        name: org.name,
        status: org.status,
        auditStatus: latestAudit ? latestAudit.status : 'SCHEDULED',
        cycleStatus: latestCycle ? latestCycle.status : 'DRAFT',
        score: latestAudit ? latestAudit.score : null
      };
    });

    const formattedAnns = announcements.map(ann => ({
      id: ann.id,
      title: ann.title,
      content: ann.content,
      date: ann.createdAt.toISOString().split('T')[0]
    }));

    res.json({
      metrics: {
        totalOrganizations: totalOrgs,
        pendingAudits,
        activeCycles,
        comunicadosNaoLidos: formattedAnns.length,
        totalFaturamento,
        totalMembros,
        averageNps
      },
      organizationsStatus: formattedOrgs,
      announcements: formattedAnns
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error.message);
    res.status(500).json({ error: 'Erro ao calcular sumário do dashboard' });
  }
});

export default app;
