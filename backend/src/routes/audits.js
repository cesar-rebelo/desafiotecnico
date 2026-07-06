import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

const DEFAULT_DOCUMENTS = [
  "Registo de Atividade Semestral",
  "Relatório de Contas",
  "Estatutos Atualizados",
  "Ata da Assembleia Geral"
];

// Obter auditoria de uma organização (cria se não existir)
router.get('/:orgId', async (req, res) => {
  const { orgId } = req.params;
  const currentYear = 2026;

  if (!prisma) {
    return res.status(500).json({ error: 'Banco de dados offline' });
  }

  try {
    // 1. Procurar auditoria existente para 2026
    let audit = await prisma.audit.findFirst({
      where: { organizationId: orgId, year: currentYear },
      include: { documents: true }
    });

    // 2. Se não existir, criar com os documentos padrão
    if (!audit) {
      audit = await prisma.audit.create({
        data: {
          year: currentYear,
          status: 'SCHEDULED',
          score: null,
          organizationId: orgId,
          documents: {
            create: DEFAULT_DOCUMENTS.map(name => ({
              name,
              isApproved: null,
              feedback: null,
              fileUrl: `/uploads/${name.toLowerCase().replace(/ /g, '_')}.pdf` // URL fictício de upload
            }))
          }
        },
        include: { documents: true }
      });
    }

    res.json(audit);
  } catch (error) {
    console.error("Database error fetching audit:", error.message);
    res.status(500).json({ error: 'Erro ao consultar auditoria no banco' });
  }
});

// Atualizar aprovação e feedback de um documento de auditoria
router.put('/documents/:docId', async (req, res) => {
  const { docId } = req.params;
  const { isApproved, feedback } = req.body;

  if (!prisma) {
    return res.status(500).json({ error: 'Banco de dados offline' });
  }

  try {
    // 1. Atualizar o documento
    const doc = await prisma.auditDocument.update({
      where: { id: docId },
      data: { 
        isApproved: isApproved === null ? null : Boolean(isApproved), 
        feedback: feedback || null 
      }
    });

    // 2. Buscar todos os documentos da mesma auditoria para recalcular score/status
    const allDocs = await prisma.auditDocument.findMany({
      where: { auditId: doc.auditId }
    });

    const total = allDocs.length;
    const approved = allDocs.filter(d => d.isApproved === true).length;
    const rejected = allDocs.filter(d => d.isApproved === false).length;

    // Calcular score
    const score = total > 0 ? (approved / total) * 100 : 0;

    // Calcular status geral da auditoria
    let status = 'DOCUMENTS_SUBMITTED';
    if (approved === total) {
      status = 'APPROVED';
    } else if (rejected > 0) {
      status = 'REJECTED';
    } else if (approved === 0 && rejected === 0) {
      status = 'SCHEDULED';
    }

    // 3. Atualizar a auditoria
    const updatedAudit = await prisma.audit.update({
      where: { id: doc.auditId },
      data: { score, status },
      include: { documents: true }
    });

    res.json({ document: doc, audit: updatedAudit });
  } catch (error) {
    console.error("Database error updating audit document:", error.message);
    res.status(500).json({ error: 'Erro ao atualizar documento de auditoria' });
  }
});

export default router;
