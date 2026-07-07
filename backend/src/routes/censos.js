import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();
const mockCensuses = [];

// GET /api/censos - Obter todos os censos submetidos
router.get('/', async (req, res) => {
  if (!prisma) {
    return res.json(mockCensuses);
  }
  try {
    const censuses = await prisma.census.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(censuses);
  } catch (error) {
    console.error("Database error fetching censuses, falling back to mock:", error.message);
    res.json(mockCensuses);
  }
});

// POST /api/censos - Submeter censo anual
router.post('/', async (req, res) => {
  const formData = req.body;
  if (!formData.jeName) {
    return res.status(400).json({ error: 'O nome da Júnior Empresa é obrigatório' });
  }

  const year = parseInt(formData.foundationYear) || 2026;

  if (!prisma) {
    const newCensus = {
      id: `mock-census-${Date.now()}`,
      year,
      data: formData,
      submitted: true,
      createdAt: new Date()
    };
    mockCensuses.unshift(newCensus);
    return res.status(201).json(newCensus);
  }

  try {
    const census = await prisma.census.create({
      data: {
        year,
        data: formData,
        submitted: true
      }
    });
    res.status(201).json(census);
  } catch (error) {
    console.error("Database error creating census, falling back to mock:", error.message);
    const newCensus = {
      id: `mock-census-${Date.now()}`,
      year,
      data: formData,
      submitted: true,
      createdAt: new Date()
    };
    mockCensuses.unshift(newCensus);
    res.status(201).json(newCensus);
  }
});

export default router;
