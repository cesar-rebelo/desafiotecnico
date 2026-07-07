import { useState, useEffect } from 'react';
import { Building2, ListChecks, Plus, Trash2, Edit2, Save, X, ToggleLeft, ToggleRight, Check, Pencil, FileText } from 'lucide-react';
import { api } from '../services/api';

export default function BackofficeView({ data, onCreateJE, newJE, setNewJE, onUpdateJE, onDeleteJE, onAuditChange }) {
  const [activeTab, setActiveTab] = useState('organizations');
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', required: true });
  const [censuses, setCensuses] = useState([]);
  const [loadingCensuses, setLoadingCensuses] = useState(false);

  // Estado para edição em linha de JEs
  const [editingOrgId, setEditingOrgId] = useState(null);
  const [editingOrgForm, setEditingOrgForm] = useState({ name: '', status: 'JUNIOR_INITIATIVE', members: 0 });

  const startEditOrg = (org) => {
    setEditingOrgId(org.id);
    setEditingOrgForm({ name: org.name, status: org.status, members: org.members || 0 });
  };

  const cancelEditOrg = () => setEditingOrgId(null);

  const saveEditOrg = (id) => {
    onUpdateJE(id, editingOrgForm.name, editingOrgForm.status, editingOrgForm.members);
    setEditingOrgId(null);
  };

  // Estado para edição em linha de tópicos
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editingTopicValue, setEditingTopicValue] = useState({ name: '', required: true });

  const fetchTopics = async () => {
    setLoadingTopics(true);
    try {
      const res = await api.getAuditTopics();
      setTopics(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTopics(false);
    }
  };

  const fetchCensuses = async () => {
    setLoadingCensuses(true);
    try {
      const res = await api.getCensuses();
      setCensuses(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCensuses(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'topics') {
      fetchTopics();
    } else if (activeTab === 'censuses') {
      fetchCensuses();
    }
  }, [activeTab]);

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    const name = newTopic.name.trim();
    if (!name) return;
    try {
      await api.createAuditTopic({ name, required: newTopic.required });
      setNewTopic({ name: '', required: true });
      await fetchTopics();
      if (onAuditChange) onAuditChange();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditTopic = (topic) => {
    setEditingTopicId(topic.id);
    setEditingTopicValue({ name: topic.name, required: topic.required });
  };

  const handleSaveTopic = async (id) => {
    const name = editingTopicValue.name.trim();
    if (!name) return;
    try {
      await api.updateAuditTopic(id, { name, required: editingTopicValue.required });
      setEditingTopicId(null);
      await fetchTopics();
      if (onAuditChange) onAuditChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTopic = async (id, name) => {
    if (confirm(`Tem a certeza que deseja eliminar o tópico "${name}"? Isto removerá o respetivo documento de todas as auditorias das organizações.`)) {
      try {
        await api.deleteAuditTopic(id);
        await fetchTopics();
        if (onAuditChange) onAuditChange();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-10 animate-fadeUp">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Painel de Backoffice</h1>
        <p className="text-sm text-gray-400 mt-1.5">Configuração administrativa da plataforma unificada da rede.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 gap-6">
        <button
          onClick={() => setActiveTab('organizations')}
          className={`pb-3 text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all focus:outline-none ${activeTab === 'organizations'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
        >
          <Building2 className="w-4 h-4" />
          Júnior Empresas & Iniciativas
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`pb-3 text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all focus:outline-none ${activeTab === 'topics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
        >
          <ListChecks className="w-4 h-4" />
          Tópicos de Auditoria
        </button>
        <button
          onClick={() => setActiveTab('censuses')}
          className={`pb-3 text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all focus:outline-none ${activeTab === 'censuses'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
        >
          <FileText className="w-4 h-4" />
          Censos Anuais
        </button>
      </div>

      {activeTab === 'organizations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listagem */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-[14px] font-semibold text-gray-700">Organizações Registadas</h2>
            <div className="bg-white/75 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">Tipo</th>
                    <th className="px-6 py-3">Membros</th>
                    <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.organizationsStatus.map((org) => {
                    const isEditing = editingOrgId === org.id;
                    return (
                      <tr key={org.id} className="hover:bg-gray-50/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingOrgForm.name}
                              onChange={(e) => setEditingOrgForm(p => ({ ...p, name: e.target.value }))}
                              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all text-gray-700"
                            />
                          ) : (
                            org.name
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <select
                              value={editingOrgForm.status}
                              onChange={(e) => setEditingOrgForm(p => ({ ...p, status: e.target.value }))}
                              className="px-2 py-1.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all text-gray-600 bg-white"
                            >
                              <option value="JUNIOR_INITIATIVE">Júnior Iniciativa</option>
                              <option value="JUNIOR_ENTERPRISE">Júnior Empresa</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${org.status === 'JUNIOR_ENTERPRISE'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                              {org.status === 'JUNIOR_ENTERPRISE' ? 'Júnior Empresa' : 'Júnior Iniciativa'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editingOrgForm.members}
                              onChange={(e) => setEditingOrgForm(p => ({ ...p, members: parseInt(e.target.value) || 0 }))}
                              className="w-20 px-2.5 py-1.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all text-gray-700 font-semibold"
                            />
                          ) : (
                            <span className="text-[13px] text-gray-600 font-semibold">{org.members || 0}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEditOrg(org.id)}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                  title="Guardar"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditOrg}
                                  className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-all"
                                  title="Cancelar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditOrg(org)}
                                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-all"
                                  title="Editar Organização"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteJE(org.id, org.name)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all"
                                  title="Eliminar Organização"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form de Criação de JEs */}
          <div>
            <h2 className="text-[14px] font-semibold text-gray-700 mb-4">Adicionar Organização</h2>
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
              <form onSubmit={onCreateJE} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Nome da Organização</label>
                  <input
                    type="text" value={newJE.name} required
                    onChange={(e) => setNewJE(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ex: EPIC Júnior"
                    className="w-full text-[13px] px-3.5 py-2 bg-white border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Tipo de Organização</label>
                  <select
                    value={newJE.status}
                    onChange={(e) => setNewJE(p => ({ ...p, status: e.target.value }))}
                    className="w-full text-[13px] px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all text-gray-600"
                  >
                    <option value="JUNIOR_INITIATIVE">Júnior Iniciativa</option>
                    <option value="JUNIOR_ENTERPRISE">Júnior Empresa</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Membros Ativos</label>
                  <input
                    type="number" value={newJE.members}
                    onChange={(e) => setNewJE(p => ({ ...p, members: e.target.value }))}
                    placeholder="Ex: 35"
                    className="w-full text-[13px] px-3.5 py-2 bg-white border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all text-gray-700"
                  />
                </div>
                <button type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-200 focus:outline-none">
                  <Plus className="w-4 h-4" />
                  Registar Organização
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listagem */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-[14px] font-semibold text-gray-700">Tópicos de Auditoria Definidos</h2>
            {loadingTopics ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-white/75 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                      <th className="px-6 py-3">Documento Exigido</th>
                      <th className="px-6 py-3">Certificação</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topics.map((topic) => {
                      const isEditing = editingTopicId === topic.id;
                      return (
                        <tr key={topic.id} className="hover:bg-gray-50/40 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingTopicValue.name}
                                onChange={(e) => setEditingTopicValue(p => ({ ...p, name: e.target.value }))}
                                className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all text-gray-700"
                              />
                            ) : (
                              topic.name
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => setEditingTopicValue(p => ({ ...p, required: !p.required }))}
                                className="focus:outline-none"
                              >
                                {editingTopicValue.required ? (
                                  <ToggleRight className="w-8 h-8 text-indigo-500" />
                                ) : (
                                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                                )}
                              </button>
                            ) : (
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${topic.required
                                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                  : 'bg-gray-50 text-gray-500 border border-gray-100'
                                }`}>
                                {topic.required ? 'Obrigatório' : 'Opcional'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveTopic(topic.id)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                    title="Guardar"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingTopicId(null)}
                                    className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-all"
                                    title="Cancelar"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditTopic(topic)}
                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-all"
                                    title="Editar Tópico"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTopic(topic.id, topic.name)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all"
                                    title="Eliminar Tópico"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Form de Criação de Tópicos */}
          <div>
            <h2 className="text-[14px] font-semibold text-gray-700 mb-4">Adicionar Tópico</h2>
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Nome do Documento</label>
                  <input
                    type="text" value={newTopic.name} required
                    onChange={(e) => setNewTopic(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ex: Regulamento Interno"
                    className="w-full text-[13px] px-3.5 py-2 bg-white border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all text-gray-700"
                  />
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[12px] font-semibold text-gray-600">Requerido para Certificação</span>
                  <button
                    type="button"
                    onClick={() => setNewTopic(p => ({ ...p, required: !p.required }))}
                    className="focus:outline-none"
                  >
                    {newTopic.required ? (
                      <ToggleRight className="w-8 h-8 text-indigo-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                </div>
                <button type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-200 focus:outline-none">
                  <Plus className="w-4 h-4" />
                  Adicionar Tópico
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'censuses' && (
        <div className="space-y-4">
          <h2 className="text-[14px] font-semibold text-gray-700">Censos Submetidos</h2>
          {loadingCensuses ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : censuses.length === 0 ? (
            <p className="text-[13px] text-gray-400 italic bg-white/75 border border-gray-200/50 rounded-2xl p-6 shadow-sm text-center">Nenhum censo submetido ainda.</p>
          ) : (
            <div className="bg-white/75 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                    <th className="px-6 py-3">Júnior Empresa</th>
                    <th className="px-6 py-3">Ano Fundação</th>
                    <th className="px-6 py-3">Sede</th>
                    <th className="px-6 py-3">Membros</th>
                    <th className="px-6 py-3">Projetos</th>
                    <th className="px-6 py-3">Faturamento</th>
                    <th className="px-6 py-3 text-right">Data Submissão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[13px] text-gray-600">
                  {censuses.map((c) => {
                    const d = c.data || {};
                    return (
                      <tr key={c.id} className="hover:bg-gray-50/40">
                        <td className="px-6 py-4 font-semibold text-gray-800">{d.jeName || 'N/A'}</td>
                        <td className="px-6 py-4">{d.foundationYear || 'N/A'}</td>
                        <td className="px-6 py-4">{d.headquarters || 'N/A'}</td>
                        <td className="px-6 py-4">{d.membersCount || '0'}</td>
                        <td className="px-6 py-4">{d.projectsCount || '0'}</td>
                        <td className="px-6 py-4">{Number(d.faturamentoAnual || 0).toLocaleString('pt-PT')}€</td>
                        <td className="px-6 py-4 text-right text-gray-400 text-[11px]">
                          {new Date(c.createdAt).toLocaleDateString('pt-PT')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
