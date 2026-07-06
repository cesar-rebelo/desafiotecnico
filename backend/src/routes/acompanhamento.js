import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

router.post('/indicadores', async (req, res) => {
  const { organizationId, faturamento, membros, nps, semester } = req.body;
  if (!organizationId) return res.status(400).json({ error: 'ID da organização é obrigatório' });

  if (!prisma) {
    return res.json({ message: 'Indicadores simulados com sucesso!' });
  }

  try {
    const cycle = await prisma.indicatorCycle.create({
      data: {
        semester: semester || '2026.1',
        status: 'SUBMITTED',
        organizationId,
        indicators: {
          create: [
            { key: 'Faturamento', value: parseFloat(faturamento) || 0 },
            { key: 'NumeroMembros', value: parseFloat(membros) || 0 },
            { key: 'NPS', value: parseFloat(nps) || 0 }
          ]
        }
      }
    });
    res.json({ message: 'Indicadores salvos com sucesso!', cycle });
  } catch (error) {
    console.error("Database error saving indicators:", error.message);
    res.status(500).json({ error: 'Erro ao salvar indicadores no banco de dados' });
  }
});

router.get('/:orgId', async (req, res) => {
  const { orgId } = req.params;
  if (!prisma) {
    return res.json(null);
  }

  try {
    const cycle = await prisma.indicatorCycle.findFirst({
      where: { organizationId: orgId },
      orderBy: { updatedAt: 'desc' },
      include: { indicators: true }
    });
    res.json(cycle);
  } catch (error) {
    console.error("Database error fetching cycle:", error.message);
    res.status(500).json({ error: 'Erro ao buscar ciclo de acompanhamento' });
  }
});

export default router;
