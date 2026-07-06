import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

const mockOrgs = [
  { id: '1', name: 'JE Porto', status: 'JUNIOR_ENTERPRISE', auditStatus: 'APPROVED', cycleStatus: 'CLOSED', score: 94.5 },
  { id: '2', name: 'JE Lisboa', status: 'JUNIOR_ENTERPRISE', auditStatus: 'DOCUMENTS_SUBMITTED', cycleStatus: 'UNDER_REVIEW', score: null },
  { id: '3', name: 'Júnior Minho', status: 'JUNIOR_INITIATIVE', auditStatus: 'SCHEDULED', cycleStatus: 'DRAFT', score: null },
  { id: '4', name: 'Coimbra Júnior', status: 'JUNIOR_ENTERPRISE', auditStatus: 'REJECTED', cycleStatus: 'UNDER_REVIEW', score: 45.0 }
];

router.get('/', async (req, res) => {
  if (!prisma) {
    return res.json(mockOrgs);
  }
  try {
    const orgs = await prisma.organization.findMany({
      include: {
        indicatorCycles: true,
        audits: true
      }
    });
    if (orgs.length === 0) return res.json(mockOrgs);
    
    const formatted = orgs.map(org => {
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
    res.json(formatted);
  } catch (error) {
    console.error("Database error fetching organizations:", error.message);
    res.json(mockOrgs);
  }
});

router.post('/', async (req, res) => {
  const { name, status } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

  if (!prisma) {
    const newOrg = {
      id: String(mockOrgs.length + 1),
      name,
      status,
      auditStatus: 'SCHEDULED',
      cycleStatus: 'DRAFT',
      score: null
    };
    mockOrgs.push(newOrg);
    return res.status(201).json(newOrg);
  }

  try {
    const org = await prisma.organization.create({
      data: { name, status }
    });
    res.status(201).json({
      id: org.id,
      name: org.name,
      status: org.status,
      auditStatus: 'SCHEDULED',
      cycleStatus: 'DRAFT',
      score: null
    });
  } catch (error) {
    console.error("Database error creating organization:", error.message);
    res.status(500).json({ error: 'Erro ao criar organização no banco' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

  if (!prisma) {
    const idx = mockOrgs.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Organização não encontrada' });
    mockOrgs[idx] = { ...mockOrgs[idx], name, status };
    return res.json(mockOrgs[idx]);
  }

  try {
    const org = await prisma.organization.update({
      where: { id },
      data: { name, status }
    });
    res.json(org);
  } catch (error) {
    console.error("Database error updating organization:", error.message);
    res.status(500).json({ error: 'Erro ao atualizar organização no banco' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!prisma) {
    const idx = mockOrgs.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Organização não encontrada' });
    mockOrgs.splice(idx, 1);
    return res.json({ success: true });
  }

  try {
    await prisma.$transaction([
      prisma.indicator.deleteMany({ where: { cycle: { organizationId: id } } }),
      prisma.indicatorCycle.deleteMany({ where: { organizationId: id } }),
      prisma.auditDocument.deleteMany({ where: { audit: { organizationId: id } } }),
      prisma.audit.deleteMany({ where: { organizationId: id } }),
      prisma.user.deleteMany({ where: { organizationId: id } }),
      prisma.organization.delete({ where: { id } })
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Database error deleting organization:", error.message);
    res.status(500).json({ error: 'Erro ao eliminar organização no banco' });
  }
});

export default router;
