const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api';

export const api = {
  getDashboardSummary: async () => {
    const res = await fetch(`${API_URL}/dashboard/summary`);
    if (!res.ok) throw new Error('API Offline');
    return res.json();
  },
  getOrganizations: async () => {
    const res = await fetch(`${API_URL}/organizations`);
    if (!res.ok) throw new Error('API Offline');
    return res.json();
  },
  createOrganization: async (orgData) => {
    const res = await fetch(`${API_URL}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orgData)
    });
    if (!res.ok) throw new Error('Erro ao criar organização');
    return res.json();
  },
  updateOrganization: async (id, orgData) => {
    const res = await fetch(`${API_URL}/organizations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orgData)
    });
    if (!res.ok) throw new Error('Erro ao editar organização');
    return res.json();
  },
  deleteOrganization: async (id) => {
    const res = await fetch(`${API_URL}/organizations/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao eliminar organização');
    return res.json();
  },
  createAnnouncement: async (annData) => {
    const res = await fetch(`${API_URL}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(annData)
    });
    if (!res.ok) throw new Error('Erro ao criar comunicado');
    return res.json();
  },
  deleteAnnouncement: async (id) => {
    const res = await fetch(`${API_URL}/announcements/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao eliminar comunicado');
    return res.json();
  },
  submitIndicators: async (data) => {
    const res = await fetch(`${API_URL}/acompanhamento/indicadores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao submeter indicadores');
    return res.json();
  },
  getAudit: async (orgId) => {
    const res = await fetch(`${API_URL}/audits/${orgId}`);
    if (!res.ok) throw new Error('Erro ao obter auditoria');
    return res.json();
  },
  updateAuditDocument: async (docId, isApproved, feedback) => {
    const res = await fetch(`${API_URL}/audits/documents/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved, feedback })
    });
    if (!res.ok) throw new Error('Erro ao atualizar documento de auditoria');
    return res.json();
  },
  getIndicatorCycles: async (orgId) => {
    const res = await fetch(`${API_URL}/acompanhamento/${orgId}`);
    if (!res.ok) throw new Error('Erro ao obter ciclos de indicadores');
    return res.json();
  },
  submitAuditDocument: async (docId) => {
    const res = await fetch(`${API_URL}/audits/documents/${docId}/submit`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Erro ao submeter documento de auditoria');
    return res.json();
  },
  getAuditTopics: async () => {
    const res = await fetch(`${API_URL}/audits/topics`);
    if (!res.ok) throw new Error('Erro ao obter tópicos de auditoria');
    return res.json();
  },
  createAuditTopic: async (topicData) => {
    const res = await fetch(`${API_URL}/audits/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData)
    });
    if (!res.ok) throw new Error('Erro ao criar tópico de auditoria');
    return res.json();
  },
  updateAuditTopic: async (id, topicData) => {
    const res = await fetch(`${API_URL}/audits/topics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData)
    });
    if (!res.ok) throw new Error('Erro ao alterar tópico de auditoria');
    return res.json();
  },
  deleteAuditTopic: async (id) => {
    const res = await fetch(`${API_URL}/audits/topics/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao remover tópico de auditoria');
    return res.json();
  },
  submitCensus: async (censusData) => {
    const res = await fetch(`${API_URL}/censos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(censusData)
    });
    if (!res.ok) throw new Error('Erro ao submeter censo anual');
    return res.json();
  },
  getCensuses: async () => {
    const res = await fetch(`${API_URL}/censos`);
    if (!res.ok) throw new Error('Erro ao obter censos');
    return res.json();
  }
};
