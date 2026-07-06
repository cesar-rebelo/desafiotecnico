import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Instanciar o Prisma com o adaptador pg (necessário no Prisma 7)
let prisma;
try {
  if (process.env.DATABASE_URL) {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } else {
    console.warn("DATABASE_URL não configurada no ambiente. Prisma Client não inicializado.");
  }
} catch (err) {
  console.error("Erro ao inicializar Prisma Client:", err.message);
}

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Node.js + Express (ESM) + Prisma 7!' });
});

// Endpoint para listar organizações (retorna mock se DB falhar ou vazio)
app.get('/api/organizations', async (req, res) => {
  if (!prisma) {
    return res.json([
      { id: '1', name: 'JE Porto', status: 'JUNIOR_ENTERPRISE' },
      { id: '2', name: 'JE Lisboa', status: 'JUNIOR_ENTERPRISE' },
      { id: '3', name: 'Júnior Minho', status: 'JUNIOR_INITIATIVE' }
    ]);
  }
  try {
    const orgs = await prisma.organization.findMany();
    if (orgs.length === 0) {
      // Se estiver vazio, retorna alguns mocks para visualização fácil no front
      return res.json([
        { id: '1', name: 'JE Porto (Mock)', status: 'JUNIOR_ENTERPRISE' },
        { id: '2', name: 'JE Lisboa (Mock)', status: 'JUNIOR_ENTERPRISE' },
        { id: '3', name: 'Júnior Minho (Mock)', status: 'JUNIOR_INITIATIVE' }
      ]);
    }
    res.json(orgs);
  } catch (error) {
    console.error("Erro ao buscar organizações:", error.message);
    res.json([
      { id: '1', name: 'JE Porto (Mock - Erro DB)', status: 'JUNIOR_ENTERPRISE' },
      { id: '2', name: 'JE Lisboa (Mock - Erro DB)', status: 'JUNIOR_ENTERPRISE' },
      { id: '3', name: 'Júnior Minho (Mock - Erro DB)', status: 'JUNIOR_INITIATIVE' }
    ]);
  }
});

// Endpoint para obter resumo do dashboard (Acompanhamento e Auditoria)
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
