import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// Mock data in memory for audits and topics when database is offline
const mockTopics = [
  { id: '1', name: 'Registo de Atividade Semestral', required: true },
  { id: '2', name: 'Relatório de Contas', required: true },
  { id: '3', name: 'Estatutos Atualizados', required: true },
  { id: '4', name: 'Ata da Assembleia Geral', required: true }
];

const mockAuditsByOrg = {};

function getMockAudit(orgId) {
  if (!mockAuditsByOrg[orgId]) {
    mockAuditsByOrg[orgId] = {
      id: `mock-audit-${orgId}`,
      year: 2026,
      status: 'SCHEDULED',
      score: 0,
      organizationId: orgId,
      documents: mockTopics.map((topic, i) => ({
        id: `mock-doc-${orgId}-${i + 1}`,
        name: topic.name,
        isApproved: null,
        feedback: null,
        fileUrl: null
      }))
    };
  }
  return mockAuditsByOrg[orgId];
}

// Obter todos os tópicos de auditoria globais
router.get('/topics', async (req, res) => {
  if (!prisma) {
    return res.json(mockTopics);
  }
  try {
    const topics = await prisma.auditTopic.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(topics);
  } catch (err) {
    console.error("Database error fetching audit topics, falling back to mock:", err.message);
    res.json(mockTopics);
  }
});

// Adicionar um novo tópico de auditoria global
router.post('/topics', async (req, res) => {
  const { name, required } = req.body;
  if (!name) return res.status(400).json({ error: 'O nome do tópico é obrigatório' });

  if (!prisma) {
    const newTopic = {
      id: String(mockTopics.length + 1),
      name: name.trim(),
      required: required !== false
    };
    mockTopics.push(newTopic);
    // Sincronizar com as auditorias simuladas existentes
    for (const audit of Object.values(mockAuditsByOrg)) {
      audit.documents.push({
        id: `mock-doc-${audit.organizationId}-${Date.now()}`,
        name: newTopic.name,
        isApproved: null,
        feedback: null,
        fileUrl: null
      });
      // Recalcular score
      const total = audit.documents.length;
      const approved = audit.documents.filter(d => d.isApproved === true).length;
      audit.score = total > 0 ? (approved / total) * 100 : 0;
    }
    return res.json(newTopic);
  }

  try {
    const topic = await prisma.auditTopic.create({
      data: { name: name.trim(), required: required !== false }
    });

    // Sincronizar: Criar documento correspondente como Pendente em todas as auditorias de 2026 existentes
    const audits = await prisma.audit.findMany({ where: { year: 2026 } });
    for (const audit of audits) {
      await prisma.auditDocument.create({
        data: {
          auditId: audit.id,
          name: topic.name,
          isApproved: null,
          feedback: null,
          fileUrl: null
        }
      });
      
      // Recalcular score/status para esta auditoria
      const allDocs = await prisma.auditDocument.findMany({ where: { auditId: audit.id } });
      const total = allDocs.length;
      const approved = allDocs.filter(d => d.isApproved === true).length;
      const score = total > 0 ? (approved / total) * 100 : 0;
      await prisma.audit.update({
        where: { id: audit.id },
        data: { score }
      });
    }

    res.json(topic);
  } catch (err) {
    console.error("Database error creating audit topic, falling back to mock:", err.message);
    const newTopic = {
      id: String(mockTopics.length + 1),
      name: name.trim(),
      required: required !== false
    };
    mockTopics.push(newTopic);
    res.json(newTopic);
  }
});

// Alterar um tópico de auditoria global
router.put('/topics/:id', async (req, res) => {
  const { id } = req.params;
  const { name, required } = req.body;

  if (!prisma) {
    const idx = mockTopics.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Tópico de auditoria não encontrado' });
    
    const oldName = mockTopics[idx].name;
    mockTopics[idx].name = name !== undefined ? name.trim() : mockTopics[idx].name;
    mockTopics[idx].required = required !== undefined ? Boolean(required) : mockTopics[idx].required;

    if (name && name.trim() !== oldName) {
      for (const audit of Object.values(mockAuditsByOrg)) {
        for (const doc of audit.documents) {
          if (doc.name === oldName) doc.name = name.trim();
        }
      }
    }
    return res.json(mockTopics[idx]);
  }

  try {
    const oldTopic = await prisma.auditTopic.findUnique({ where: { id } });
    if (!oldTopic) return res.status(404).json({ error: 'Tópico de auditoria não encontrado' });

    const topic = await prisma.auditTopic.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : oldTopic.name,
        required: required !== undefined ? Boolean(required) : oldTopic.required
      }
    });

    // Sincronizar: Se o nome mudou, atualizar o nome de todos os documentos correspondentes nas JEs
    if (name && name.trim() !== oldTopic.name) {
      await prisma.auditDocument.updateMany({
        where: { name: oldTopic.name },
        data: { name: name.trim() }
      });
    }

    res.json(topic);
  } catch (err) {
    console.error("Database error updating audit topic, falling back to mock:", err.message);
    const idx = mockTopics.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Tópico de auditoria não encontrado' });
    mockTopics[idx].name = name !== undefined ? name.trim() : mockTopics[idx].name;
    mockTopics[idx].required = required !== undefined ? Boolean(required) : mockTopics[idx].required;
    res.json(mockTopics[idx]);
  }
});

// Remover um tópico de auditoria global
router.delete('/topics/:id', async (req, res) => {
  const { id } = req.params;

  if (!prisma) {
    const idx = mockTopics.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Tópico de auditoria não encontrado' });
    
    const topicName = mockTopics[idx].name;
    mockTopics.splice(idx, 1);

    for (const audit of Object.values(mockAuditsByOrg)) {
      audit.documents = audit.documents.filter(d => d.name !== topicName);
      // Recalcular
      const total = audit.documents.length;
      const approved = audit.documents.filter(d => d.isApproved === true).length;
      const rejected = audit.documents.filter(d => d.isApproved === false).length;
      const hasFiles = audit.documents.filter(d => d.fileUrl !== null).length;
      audit.score = total > 0 ? (approved / total) * 100 : 0;
      
      if (approved === total) {
        audit.status = 'APPROVED';
      } else if (rejected > 0) {
        audit.status = 'REJECTED';
      } else if (hasFiles > 0) {
        audit.status = 'DOCUMENTS_SUBMITTED';
      } else {
        audit.status = 'SCHEDULED';
      }
    }
    return res.json({ message: 'Tópico de auditoria removido com sucesso' });
  }

  try {
    const topic = await prisma.auditTopic.findUnique({ where: { id } });
    if (!topic) return res.status(404).json({ error: 'Tópico de auditoria não encontrado' });

    // Sincronizar: Remover os documentos correspondentes de todas as JEs
    await prisma.auditDocument.deleteMany({
      where: { name: topic.name }
    });

    // Remover o tópico global
    await prisma.auditTopic.delete({ where: { id } });

    // Recalcular as pontuações e status de todas as JEs agora que um tópico foi removido
    const audits = await prisma.audit.findMany({
      include: { documents: true }
    });
    for (const audit of audits) {
      const total = audit.documents.length;
      const approved = audit.documents.filter(d => d.isApproved === true).length;
      const rejected = audit.documents.filter(d => d.isApproved === false).length;
      const hasFiles = audit.documents.filter(d => d.fileUrl !== null).length;

      const score = total > 0 ? (approved / total) * 100 : 0;

      let status = 'SCHEDULED';
      if (approved === total) {
        status = 'APPROVED';
      } else if (rejected > 0) {
        status = 'REJECTED';
      } else if (hasFiles > 0) {
        status = 'DOCUMENTS_SUBMITTED';
      }

      await prisma.audit.update({
        where: { id: audit.id },
        data: { score, status }
      });
    }

    res.json({ message: 'Tópico de auditoria removido com sucesso' });
  } catch (err) {
    console.error("Database error deleting audit topic, falling back to mock:", err.message);
    const idx = mockTopics.findIndex(t => t.id === id);
    if (idx !== -1) mockTopics.splice(idx, 1);
    res.json({ message: 'Tópico de auditoria removido com sucesso (Modo Simulação)' });
  }
});

// Obter auditoria de uma organização (cria se não existir)
router.get('/:orgId', async (req, res) => {
  const { orgId } = req.params;
  const currentYear = 2026;

  if (!prisma) {
    return res.json(getMockAudit(orgId));
  }

  try {
    // 1. Procurar auditoria existente para 2026
    let audit = await prisma.audit.findFirst({
      where: { organizationId: orgId, year: currentYear },
      include: { documents: true }
    });

    // 2. Se não existir, criar carregando os tópicos dinâmicos do banco
    if (!audit) {
      let dbTopics = await prisma.auditTopic.findMany();
      
      // Fallback para seed dinâmico se a tabela estiver vazia
      if (dbTopics.length === 0) {
        const defaultTopics = [
          { name: "Registo de Atividade Semestral", required: true },
          { name: "Relatório de Contas", required: true },
          { name: "Estatutos Atualizados", required: true },
          { name: "Ata da Assembleia Geral", required: true }
        ];
        for (const t of defaultTopics) {
          await prisma.auditTopic.create({ data: t });
        }
        dbTopics = await prisma.auditTopic.findMany();
      }

      audit = await prisma.audit.create({
        data: {
          year: currentYear,
          status: 'SCHEDULED',
          score: null,
          organizationId: orgId,
          documents: {
            create: dbTopics.map(topic => ({
              name: topic.name,
              isApproved: null,
              feedback: null,
              fileUrl: null
            }))
          }
        },
        include: { documents: true }
      });
    }

    res.json(audit);
  } catch (error) {
    console.error("Database error fetching audit, falling back to mock:", error.message);
    res.json(getMockAudit(orgId));
  }
});

// Atualizar aprovação e feedback de um documento de auditoria
router.put('/documents/:docId', async (req, res) => {
  const { docId } = req.params;
  const { isApproved, feedback } = req.body;

  if (!prisma) {
    let foundDoc = null;
    let foundAudit = null;
    for (const audit of Object.values(mockAuditsByOrg)) {
      foundDoc = audit.documents.find(d => d.id === docId);
      if (foundDoc) {
        foundAudit = audit;
        break;
      }
    }
    if (!foundDoc) return res.status(404).json({ error: 'Documento não encontrado' });

    foundDoc.isApproved = isApproved === null ? null : Boolean(isApproved);
    foundDoc.feedback = feedback || null;

    const total = foundAudit.documents.length;
    const approved = foundAudit.documents.filter(d => d.isApproved === true).length;
    const rejected = foundAudit.documents.filter(d => d.isApproved === false).length;
    const hasFiles = foundAudit.documents.filter(d => d.fileUrl !== null).length;
    
    foundAudit.score = total > 0 ? (approved / total) * 100 : 0;
    
    if (approved === total) {
      foundAudit.status = 'APPROVED';
    } else if (rejected > 0) {
      foundAudit.status = 'REJECTED';
    } else if (hasFiles > 0) {
      foundAudit.status = 'DOCUMENTS_SUBMITTED';
    } else {
      foundAudit.status = 'SCHEDULED';
    }

    return res.json({ document: foundDoc, audit: foundAudit });
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
    console.error("Database error updating audit document, falling back to mock:", error.message);
    let foundDoc = null;
    let foundAudit = null;
    for (const audit of Object.values(mockAuditsByOrg)) {
      foundDoc = audit.documents.find(d => d.id === docId);
      if (foundDoc) {
        foundAudit = audit;
        break;
      }
    }
    if (foundDoc) {
      foundDoc.isApproved = isApproved === null ? null : Boolean(isApproved);
      foundDoc.feedback = feedback || null;
      res.json({ document: foundDoc, audit: foundAudit });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar documento de auditoria' });
    }
  }
});

// Submeter/Simular upload de um ficheiro de auditoria
router.post('/documents/:docId/submit', async (req, res) => {
  const { docId } = req.params;

  if (!prisma) {
    let foundDoc = null;
    let foundAudit = null;
    for (const audit of Object.values(mockAuditsByOrg)) {
      foundDoc = audit.documents.find(d => d.id === docId);
      if (foundDoc) {
        foundAudit = audit;
        break;
      }
    }
    if (!foundDoc) return res.status(404).json({ error: 'Documento não encontrado' });

    foundDoc.fileUrl = `/uploads/simulado_${Date.now()}.pdf`;
    foundDoc.isApproved = null; // Volta a pendente de análise
    foundDoc.feedback = null;

    const total = foundAudit.documents.length;
    const approved = foundAudit.documents.filter(d => d.isApproved === true).length;
    const rejected = foundAudit.documents.filter(d => d.isApproved === false).length;
    const hasFiles = foundAudit.documents.filter(d => d.fileUrl !== null).length;

    foundAudit.score = total > 0 ? (approved / total) * 100 : 0;

    if (approved === total) {
      foundAudit.status = 'APPROVED';
    } else if (rejected > 0) {
      foundAudit.status = 'REJECTED';
    } else if (hasFiles > 0) {
      foundAudit.status = 'DOCUMENTS_SUBMITTED';
    } else {
      foundAudit.status = 'SCHEDULED';
    }

    return res.json({ document: foundDoc, audit: foundAudit });
  }

  try {
    // 1. Atualizar o documento marcando como enviado e reiniciando a avaliação do auditor
    const doc = await prisma.auditDocument.update({
      where: { id: docId },
      data: {
        fileUrl: `/uploads/simulado_${Date.now()}.pdf`,
        isApproved: null, // Volta a pendente de análise
        feedback: null
      }
    });

    // 2. Buscar todos os documentos da mesma auditoria para recalcular score/status
    const allDocs = await prisma.auditDocument.findMany({
      where: { auditId: doc.auditId }
    });

    const total = allDocs.length;
    const approved = allDocs.filter(d => d.isApproved === true).length;
    const rejected = allDocs.filter(d => d.isApproved === false).length;
    const hasFiles = allDocs.filter(d => d.fileUrl !== null).length;

    // Calcular score
    const score = total > 0 ? (approved / total) * 100 : 0;

    // Calcular status geral da auditoria
    let status = 'SCHEDULED';
    if (approved === total) {
      status = 'APPROVED';
    } else if (rejected > 0) {
      status = 'REJECTED';
    } else if (hasFiles > 0) {
      status = 'DOCUMENTS_SUBMITTED';
    }

    // 3. Atualizar a auditoria
    const updatedAudit = await prisma.audit.update({
      where: { id: doc.auditId },
      data: { score, status },
      include: { documents: true }
    });

    res.json({ document: doc, audit: updatedAudit });
  } catch (error) {
    console.error("Database error submitting document, falling back to mock:", error.message);
    let foundDoc = null;
    let foundAudit = null;
    for (const audit of Object.values(mockAuditsByOrg)) {
      foundDoc = audit.documents.find(d => d.id === docId);
      if (foundDoc) {
        foundAudit = audit;
        break;
      }
    }
    if (foundDoc) {
      foundDoc.fileUrl = `/uploads/simulado_${Date.now()}.pdf`;
      foundDoc.isApproved = null;
      foundDoc.feedback = null;
      res.json({ document: foundDoc, audit: foundAudit });
    } else {
      res.status(500).json({ error: 'Erro ao submeter documento' });
    }
  }
});

export default router;
