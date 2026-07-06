import express from 'express';
import cors from 'cors';
import organizacoesRouter from './routes/organizacoes.js';
import comunicacaoRouter from './routes/comunicacao.js';
import acompanhamentoRouter from './routes/acompanhamento.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/organizations', organizacoesRouter);
app.use('/api/announcements', comunicacaoRouter);
app.use('/api/acompanhamento', acompanhamentoRouter);

app.get('/api/dashboard/summary', async (req, res) => {
  res.json({
    metrics: {
      totalOrganizations: 24,
      pendingAudits: 5,
      activeCycles: 2,
      comunicadosNaoLidos: 3
    },
    organizationsStatus: [
      { id: '1', name: 'JE Porto', auditStatus: 'APPROVED', cycleStatus: 'CLOSED', score: 94.5 },
      { id: '2', name: 'JE Lisboa', auditStatus: 'DOCUMENTS_SUBMITTED', cycleStatus: 'UNDER_REVIEW', score: null },
      { id: '3', name: 'Júnior Minho', auditStatus: 'SCHEDULED', cycleStatus: 'DRAFT', score: null },
      { id: '4', name: 'Coimbra Júnior', auditStatus: 'REJECTED', cycleStatus: 'UNDER_REVIEW', score: 45.0 }
    ],
    announcements: [
      { id: '1', title: 'Abertura das candidaturas jeniAL 2026', date: '2026-07-01' },
      { id: '2', title: 'Submissão de Censos Anuais até 31 de Julho', date: '2026-07-05' }
    ]
  });
});

export default app;
