import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

const mockCyclesByOrg = {};

router.post('/indicadores', async (req, res) => {
  const { organizationId, faturamento, membros, nps, semester } = req.body;
  if (!organizationId) return res.status(400).json({ error: 'ID da organização é obrigatório' });

  const sem = semester || '2026.1';

  if (!prisma) {
    mockCyclesByOrg[organizationId] = {
      id: `mock-cycle-${organizationId}`,
      semester: sem,
      status: 'SUBMITTED',
      organizationId,
      indicators: [
        { key: 'Faturamento', value: parseFloat(faturamento) || 0 },
        { key: 'NumeroMembros', value: parseFloat(membros) || 0 },
        { key: 'NPS', value: parseFloat(nps) || 0 }
      ]
    };
    return res.json({ message: 'Indicadores simulados com sucesso!', cycle: mockCyclesByOrg[organizationId] });
  }

  try {
    // 1. Procurar por ciclo existente para a mesma organização e semestre
    const existingCycle = await prisma.indicatorCycle.findFirst({
      where: { organizationId, semester: sem }
    });

    if (existingCycle) {
      // Atualizar o ciclo e associar os novos indicadores (deletando os antigos aninhadamente para garantir atomicidade)
      const cycle = await prisma.indicatorCycle.update({
        where: { id: existingCycle.id },
        data: {
          status: 'SUBMITTED',
          indicators: {
            deleteMany: {},
            create: [
              { key: 'Faturamento', value: parseFloat(faturamento) || 0 },
              { key: 'NumeroMembros', value: parseFloat(membros) || 0 },
              { key: 'NPS', value: parseFloat(nps) || 0 }
            ]
          }
        },
        include: { indicators: true }
      });
      
      // Sincronizar o número de membros no perfil da organização
      await prisma.organization.update({
        where: { id: organizationId },
        data: { members: parseInt(membros) || 0 }
      });

      return res.json({ message: 'Indicadores atualizados com sucesso!', cycle });
    }

    // 2. Se não existir, criar novo ciclo
    const cycle = await prisma.indicatorCycle.create({
      data: {
        semester: sem,
        status: 'SUBMITTED',
        organizationId,
        indicators: {
          create: [
            { key: 'Faturamento', value: parseFloat(faturamento) || 0 },
            { key: 'NumeroMembros', value: parseFloat(membros) || 0 },
            { key: 'NPS', value: parseFloat(nps) || 0 }
          ]
        }
      },
      include: { indicators: true }
    });

    // Sincronizar o número de membros no perfil da organização
    await prisma.organization.update({
      where: { id: organizationId },
      data: { members: parseInt(membros) || 0 }
    });

    res.json({ message: 'Indicadores salvos com sucesso!', cycle });
  } catch (error) {
    console.error("Database error saving indicators, falling back to mock:", error.message);
    mockCyclesByOrg[organizationId] = {
      id: `mock-cycle-${organizationId}`,
      semester: sem,
      status: 'SUBMITTED',
      organizationId,
      indicators: [
        { key: 'Faturamento', value: parseFloat(faturamento) || 0 },
        { key: 'NumeroMembros', value: parseFloat(membros) || 0 },
        { key: 'NPS', value: parseFloat(nps) || 0 }
      ]
    };
    res.json({ message: 'Indicadores salvos com sucesso! (Modo Simulação)', cycle: mockCyclesByOrg[organizationId] });
  }
});

router.get('/:orgId', async (req, res) => {
  const { orgId } = req.params;
  if (!prisma) {
    return res.json(mockCyclesByOrg[orgId] || null);
  }

  try {
    const cycle = await prisma.indicatorCycle.findFirst({
      where: { organizationId: orgId },
      orderBy: { updatedAt: 'desc' },
      include: { indicators: true }
    });
    res.json(cycle);
  } catch (error) {
    console.error("Database error fetching cycle, falling back to mock:", error.message);
    res.json(mockCyclesByOrg[orgId] || null);
  }
});

export default router;
