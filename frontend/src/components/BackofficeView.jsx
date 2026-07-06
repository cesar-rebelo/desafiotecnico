import { useState, useEffect } from 'react';
import { Building2, ListChecks, Plus, Trash2, Edit2, Save, X, ToggleLeft, ToggleRight, Check, Pencil } from 'lucide-react';
import { api } from '../services/api';

export default function BackofficeView({ data, onCreateJE, newJE, setNewJE, onUpdateJE, onDeleteJE, onAuditChange }) {
  const [activeTab, setActiveTab] = useState('organizations');
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', required: true });

  // Estado para edição em linha de JEs
  const [editingOrgId, setEditingOrgId] = useState(null);
  const [editingOrgForm, setEditingOrgForm] = useState({ name: '', status: 'JUNIOR_INITIATIVE' });

  const startEditOrg = (org) => {
    setEditingOrgId(org.id);
    setEditingOrgForm({ name: org.name, status: org.status });
  };

  const cancelEditOrg = () => setEditingOrgId(null);

  const saveEditOrg = (id) => {
    onUpdateJE(id, editingOrgForm.name, editingOrgForm.status);
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

  useEffect(() => {
    if (activeTab === 'topics') {
      fetchTopics();
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
          className={`pb-3 text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all focus:outline-none ${
            activeTab === 'organizations'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Júnior Empresas & Iniciativas
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`pb-3 text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all focus:outline-none ${
            activeTab === 'topics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          Tópicos de Auditoria
        </button>
      </div>

      {activeTab === 'organizations' ? (
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
                    <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.organizationsStatus.map((org) => {
                    const isEditing = editingOrgId === org.id;
                    return (
                      <tr key={org.id} className="hover:bg-gray-50/20 transition-colors">
                        <td className="px-6 py-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingOrgForm.name}
                              onChange={(e) => setEditingOrgForm(p => ({ ...p, name: e.target.value }))}
                              className="w-full text-[12.5px] px-2.5 py-1 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-gray-700"
                            />
                          ) : (
                            <span className="text-[12.5px] font-medium text-gray-800">{org.name}</span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {isEditing ? (
                            <select
                              value={editingOrgForm.status}
                              onChange={(e) => setEditingOrgForm(p => ({ ...p, status: e.target.value }))}
                              className="text-[12px] px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 cursor-pointer"
                            >
                              <option value="JUNIOR_INITIATIVE">Júnior Iniciativa</option>
                              <option value="JUNIOR_ENTERPRISE">Júnior Empresa</option>
                            </select>
                          ) : (
                            <span className="text-[12px] font-medium text-gray-500">
                              {org.status === 'JUNIOR_ENTERPRISE' ? 'Júnior Empresa' : 'Júnior Iniciativa'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEditOrg(org.id)}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all focus:outline-none"
                                  title="Guardar Alterações"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditOrg}
                                  className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all focus:outline-none"
                                  title="Cancelar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditOrg(org)}
                                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all focus:outline-none"
                                  title="Editar Organização"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteJE(org.id, org.name)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
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

          {/* Form de Criação */}
          <div>
            <h2 className="text-[14px] font-semibold text-gray-700 mb-4">Registar Nova Entidade</h2>
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
              <form onSubmit={onCreateJE} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Nome</label>
                  <input
                    type="text" value={newJE.name} required
                    onChange={(e) => setNewJE(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ex: JE Porto"
                    className="w-full text-[13px] px-3.5 py-2 bg-white border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Tipo</label>
                  <select
                    value={newJE.status}
                    onChange={(e) => setNewJE(p => ({ ...p, status: e.target.value }))}
                    className="w-full text-[13px] px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all cursor-pointer"
                  >
                    <option value="JUNIOR_INITIATIVE">Júnior Iniciativa</option>
                    <option value="JUNIOR_ENTERPRISE">Júnior Empresa</option>
                  </select>
                </div>
                <button type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-200 focus:outline-none">
                  <Plus className="w-4 h-4" />
                  Registar Entidade
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listagem de tópicos */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-[14px] font-semibold text-gray-700">Checklist de Auditoria</h2>
            
            {loadingTopics ? (
              <div className="bg-white/75 border border-gray-200/50 rounded-2xl p-10 flex items-center justify-center h-48 shadow-sm">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : topics.length === 0 ? (
              <div className="bg-white/75 border border-gray-200/50 rounded-2xl p-10 text-center text-gray-400 shadow-sm">
                Nenhum tópico de auditoria configurado no sistema.
              </div>
            ) : (
              <div className="bg-white/75 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                      <th className="px-6 py-3">Nome do Tópico</th>
                      <th className="px-6 py-3">Obrigatoriedade</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topics.map((topic) => {
                      const isEditing = editingTopicId === topic.id;
                      return (
                        <tr key={topic.id} className="hover:bg-gray-50/20 transition-colors">
                          <td className="px-6 py-3 text-[12.5px] font-medium text-gray-800">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingTopicValue.name}
                                onChange={(e) => setEditingTopicValue(p => ({ ...p, name: e.target.value }))}
                                className="w-full text-[12.5px] px-2.5 py-1 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-gray-700"
                              />
                            ) : (
                              topic.name
                            )}
                          </td>
                          <td className="px-6 py-3 text-[12px]">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => setEditingTopicValue(p => ({ ...p, required: !p.required }))}
                                className="flex items-center gap-1.5 focus:outline-none"
                              >
                                {editingTopicValue.required ? (
                                  <ToggleRight className="w-8 h-8 text-indigo-500" />
                                ) : (
                                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                                )}
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                  {editingTopicValue.required ? 'Obrigatório' : 'Opcional'}
                                </span>
                              </button>
                            ) : (
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                topic.required 
                                  ? 'bg-indigo-50 text-indigo-600' 
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {topic.required ? 'Obrigatório' : 'Opcional'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveTopic(topic.id)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all focus:outline-none"
                                    title="Guardar Alterações"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingTopicId(null)}
                                    className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-all focus:outline-none"
                                    title="Cancelar"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditTopic(topic)}
                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all focus:outline-none"
                                    title="Editar Tópico"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTopic(topic.id, topic.name)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
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
    </div>
  );
}
