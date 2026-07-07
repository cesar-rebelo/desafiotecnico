import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

const mockOrgs = [];

router.get('/', async (req, res) => {
  if (!prisma) {
    return res.json(mockOrgs);
  }
  try {
    const orgs = await prisma.organization.findMany({
      include: {
        indicatorCycles: { orderBy: { updatedAt: 'asc' } },
        audits: { orderBy: { updatedAt: 'asc' } }
      }
    });
    
    const formatted = orgs.map(org => {
      const latestAudit = org.audits[org.audits.length - 1];
      const latestCycle = org.indicatorCycles[org.indicatorCycles.length - 1];
      return {
        id: org.id,
        name: org.name,
        status: org.status,
        members: org.members,
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
  const { name, status, members } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

  if (!prisma) {
    const newOrg = {
      id: String(mockOrgs.length + 1),
      name,
      status,
      members: parseInt(members) || 0,
      auditStatus: 'SCHEDULED',
      cycleStatus: 'DRAFT',
      score: null
    };
    mockOrgs.push(newOrg);
    return res.status(201).json(newOrg);
  }

  try {
    const org = await prisma.organization.create({
      data: { name, status, members: parseInt(members) || 0 }
    });
    res.status(201).json({
      id: org.id,
      name: org.name,
      status: org.status,
      members: org.members,
      auditStatus: 'SCHEDULED',
      cycleStatus: 'DRAFT',
      score: null
    });
  } catch (error) {
    console.error("Database error creating organization, falling back to mock:", error.message);
    const newOrg = {
      id: String(mockOrgs.length + 1),
      name,
      status: status || 'JUNIOR_INITIATIVE',
      members: parseInt(members) || 0,
      auditStatus: 'SCHEDULED',
      cycleStatus: 'DRAFT',
      score: null
    };
    mockOrgs.push(newOrg);
    res.status(201).json(newOrg);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, status, members } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

  if (!prisma) {
    const idx = mockOrgs.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Organização não encontrada' });
    mockOrgs[idx] = { ...mockOrgs[idx], name, status, members: parseInt(members) || 0 };
    return res.json(mockOrgs[idx]);
  }

  try {
    const org = await prisma.organization.update({
      where: { id },
      data: { name, status, members: parseInt(members) || 0 }
    });
    res.json(org);
  } catch (error) {
    console.error("Database error updating organization, falling back to mock:", error.message);
    const idx = mockOrgs.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Organização não encontrada' });
    mockOrgs[idx] = { ...mockOrgs[idx], name, status, members: parseInt(members) || 0 };
    res.json(mockOrgs[idx]);
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
      prisma.organization.delete({ where: { id } })
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Database error deleting organization, falling back to mock:", error.message);
    const idx = mockOrgs.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Organização não encontrada' });
    mockOrgs.splice(idx, 1);
    res.json({ success: true });
  }
});

export default router;
