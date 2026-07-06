import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

const mockAnnouncements = [
  { id: '1', title: 'Abertura das candidaturas jeniAL 2026', date: '2026-07-01' },
  { id: '2', title: 'Submissão de Censos Anuais até 31 de Julho', date: '2026-07-05' }
];

router.get('/', async (req, res) => {
  if (!prisma) {
    return res.json(mockAnnouncements);
  }
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    if (announcements.length === 0) return res.json(mockAnnouncements);
    res.json(announcements.map(ann => ({
      id: ann.id,
      title: ann.title,
      date: ann.createdAt.toISOString().split('T')[0]
    })));
  } catch (error) {
    console.error("Database error fetching announcements:", error.message);
    res.json(mockAnnouncements);
  }
});

export default router;
