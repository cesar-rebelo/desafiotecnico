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
      content: ann.content,
      date: ann.createdAt.toISOString().split('T')[0]
    })));
  } catch (error) {
    console.error("Database error fetching announcements:", error.message);
    res.json(mockAnnouncements);
  }
});

router.post('/', async (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ error: 'Título é obrigatório' });

  if (!prisma) {
    const newAnn = {
      id: String(mockAnnouncements.length + 1),
      title,
      content,
      date: new Date().toISOString().split('T')[0]
    };
    mockAnnouncements.unshift(newAnn);
    return res.status(201).json(newAnn);
  }

  try {
    const ann = await prisma.announcement.create({
      data: { title, content: content || '' }
    });
    res.status(201).json({
      id: ann.id,
      title: ann.title,
      content: ann.content,
      date: ann.createdAt.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error("Database error creating announcement:", error.message);
    res.status(500).json({ error: 'Erro ao criar comunicado no banco' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!prisma) {
    const idx = mockAnnouncements.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Comunicado não encontrado' });
    mockAnnouncements.splice(idx, 1);
    return res.json({ success: true });
  }

  try {
    await prisma.announcement.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Database error deleting announcement:", error.message);
    res.status(500).json({ error: 'Erro ao eliminar comunicado no banco' });
  }
});

export default router;
