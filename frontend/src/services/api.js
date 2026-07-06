const API_URL = 'http://localhost:3000/api';

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
  submitIndicators: async (data) => {
    const res = await fetch(`${API_URL}/acompanhamento/indicadores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao submeter indicadores');
    return res.json();
  }
};
