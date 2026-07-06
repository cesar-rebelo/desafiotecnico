import { 
  Building2, Scale, RefreshCw, AlertCircle, Plus, 
  ArrowUpRight, ExternalLink, ShieldCheck, CheckCircle2, 
  TrendingUp, Users, Award 
} from 'lucide-react';
import CardMetrica from './CardMetrica';

export default function DashboardGeral({ data, getStatusBadge, onSelectJE, newJE, setNewJE, onCreateJE }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header com Boas-vindas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Dashboard Principal</h2>
          <p className="text-sm text-slate-400">Bem-vindo ao centro de operações do Movimento Júnior Português.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1e293b]/60 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Mandato 2026/2027 Ativo
        </div>
      </div>

      {/* Grid de Cartões de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <CardMetrica 
          label="Júnior Empresas" 
          value={data.metrics.totalOrganizations} 
          icon={<Building2 className="w-5 h-5" />} 
          color="from-blue-600/10 to-indigo-600/5 text-blue-400 border-blue-500/15" 
        />
        <CardMetrica 
          label="Auditorias Pendentes" 
          value={data.metrics.pendingAudits} 
          icon={<Scale className="w-5 h-5" />} 
          color="from-amber-600/10 to-orange-600/5 text-amber-400 border-amber-500/15" 
        />
        <CardMetrica 
          label="Ciclos Ativos" 
          value={data.metrics.activeCycles} 
          icon={<RefreshCw className="w-5 h-5" />} 
          color="from-emerald-600/10 to-teal-600/5 text-emerald-400 border-emerald-500/15" 
        />
        <CardMetrica 
          label="Avisos Importantes" 
          value={data.metrics.comunicadosNaoLidos} 
          icon={<AlertCircle className="w-5 h-5" />} 
          color="from-rose-600/10 to-red-600/5 text-rose-400 border-rose-500/15" 
        />
      </div>

      {/* Grid Central: Tabela & Gráfico + Sidebar rápida */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tabela de Organizações (2/3 de largura no LG) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/30">
              <div>
                <h3 className="text-md font-bold text-white">Estado da Rede MJP</h3>
                <p className="text-xs text-slate-400">Verifique a situação de cada organização da rede.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#0f172a]/70 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800/80">
                  <tr>
                    <th className="px-6 py-4">Organização</th>
                    <th className="px-6 py-4">Auditoria</th>
                    <th className="px-6 py-4">Acompanhamento</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.organizationsStatus.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-800/20 transition-all duration-150">
                      <td className="px-6 py-4 font-semibold text-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {org.name}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(org.auditStatus, 'audit')}</td>
                      <td className="px-6 py-4">{getStatusBadge(org.cycleStatus, 'cycle')}</td>
                      <td className="px-6 py-4 font-mono font-bold text-indigo-400">
                        {org.score ? `${org.score}%` : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => onSelectJE(org)}
                          className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-violet-600 hover:text-white border border-slate-700 hover:border-violet-500 rounded-lg font-medium transition-all flex items-center gap-1 ml-auto"
                        >
                          Detalhes
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráfico Estilizado do Faturamento da Rede (Interativo em SVG) */}
          <div className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Evolução de Projetos e Faturamento
                </h3>
                <p className="text-xs text-slate-400">Valores consolidados da rede por semestre fiscal (€).</p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                +14.3% Este Semestre
              </span>
            </div>

            {/* SVG Chart */}
            <div className="relative">
              <svg viewBox="0 0 500 150" className="w-full h-36 overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Linhas de Grade de Fundo */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Preenchimento do Gráfico */}
                <path 
                  d="M 0,110 Q 100,60 200,90 T 400,40 T 500,70 L 500,150 L 0,150 Z" 
                  fill="url(#chartGradient)" 
                />

                {/* Linha Principal */}
                <path 
                  d="M 0,110 Q 100,60 200,90 T 400,40 T 500,70" 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Pontos de Destaque */}
                <circle cx="200" cy="90" r="4.5" fill="#6366f1" stroke="#0f172a" strokeWidth="2" />
                <circle cx="400" cy="40" r="4.5" fill="#6366f1" stroke="#0f172a" strokeWidth="2" />

                {/* Rótulos */}
                <text x="200" y="145" fill="#64748b" fontSize="8" textAnchor="middle" fontWeight="bold">S1 2025</text>
                <text x="400" y="145" fill="#64748b" fontSize="8" textAnchor="middle" fontWeight="bold">S2 2025</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Sidebar Rápida - Coluna da Direita (1/3) */}
        <div className="space-y-6">
          {/* Adicionar JE */}
          <div className="bg-[#111827]/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
            <h3 className="text-md font-bold text-white mb-1">Registar Nova Organização</h3>
            <p className="text-xs text-slate-400 mb-4">Adicione uma Júnior Empresa ou Júnior Iniciativa ao ecossistema.</p>
            
            <form onSubmit={onCreateJE} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nome da Organização</label>
                <input 
                  type="text" 
                  value={newJE.name}
                  onChange={(e) => setNewJE(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all" 
                  placeholder="Ex: Minho Júnior" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tipo Legal</label>
                <select 
                  value={newJE.status}
                  onChange={(e) => setNewJE(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl text-sm text-slate-100 focus:outline-none transition-all"
                >
                  <option value="JUNIOR_INITIATIVE">Júnior Iniciativa</option>
                  <option value="JUNIOR_ENTERPRISE">Júnior Empresa</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Criar Organização
              </button>
            </form>
          </div>

          {/* Links Rápidos do MJP */}
          <div className="bg-[#111827]/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
            <h3 className="text-md font-bold text-white">Atalhos Críticos</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { title: 'Submeter Documentos', desc: 'Certificação de qualidade', link: '#', icon: <Award className="w-4 h-4 text-violet-400" /> },
                { title: 'Censo de Recursos', desc: 'Estruturação anual', link: '#', icon: <Users className="w-4 h-4 text-blue-400" /> }
              ].map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.link}
                  className="p-3 bg-slate-900/30 border border-slate-800/60 rounded-xl flex items-center justify-between hover:border-violet-500/40 hover:bg-violet-600/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-850 rounded-lg">
                      {link.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{link.title}</h4>
                      <p className="text-[10px] text-slate-400">{link.desc}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
