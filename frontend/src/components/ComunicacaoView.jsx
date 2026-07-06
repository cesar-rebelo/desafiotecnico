import { useState } from 'react';
import { Mail, CheckCircle2, Circle, AlertCircle, Plus, Send } from 'lucide-react';

export default function ComunicacaoView({ announcements: initialAnnouncements }) {
  const [announcements, setAnnouncements] = useState(
    initialAnnouncements.map(ann => ({ ...ann, read: false }))
  );
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const toggleRead = (id) => {
    setAnnouncements(prev => prev.map(ann => 
      ann.id === id ? { ...ann, read: !ann.read } : ann
    ));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newAnn = {
      id: String(announcements.length + 1),
      title: newTitle,
      content: newContent,
      date: new Date().toISOString().split('T')[0],
      read: false
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    setNewTitle('');
    setNewContent('');
  };

  const unreadCount = announcements.filter(a => !a.read).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-indigo-400" />
            Módulo 6: Comunicação Oficial
          </h2>
          <p className="text-sm text-slate-400">Canal oficial de transmissão de comunicados e diretivas entre a federação e as Júnior Empresas.</p>
        </div>
        <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl">
          {unreadCount} Por Ler
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel de Comunicados */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
            <h3 className="text-md font-bold text-white">Mural de Avisos</h3>
            
            <div className="space-y-3.5">
              {announcements.map((ann) => (
                <div 
                  key={ann.id} 
                  className={`p-5 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 ${
                    ann.read 
                      ? 'bg-slate-900/15 border-slate-850 opacity-70' 
                      : 'bg-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {!ann.read && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                      <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      {ann.content || 'Este comunicado detalha as novas diretrizes operacionais do mandato 2026/2027.'}
                    </p>
                    <span className="text-[10px] text-slate-500 font-semibold block">{ann.date} • Enviado por Direção IT</span>
                  </div>

                  <button
                    onClick={() => toggleRead(ann.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 self-end md:self-center border ${
                      ann.read 
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' 
                        : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-750'
                    }`}
                  >
                    {ann.read ? (
                      <>
                        <Circle className="w-3.5 h-3.5 text-slate-400" />
                        Marcar como Não Lido
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        Lido
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Publicar Comunicado (Apenas Federation Admins na teoria, mas simulado aqui) */}
        <div className="space-y-6">
          <div className="bg-[#111827]/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
            <div>
              <h3 className="text-md font-bold text-white">Publicar Comunicado</h3>
              <p className="text-xs text-slate-400">Envie um comunicado oficial para toda a rede do MJP com confirmação de leitura obrigatória.</p>
            </div>
            
            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Título do Comunicado</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all" 
                  placeholder="Ex: Prazos Finais de Auditorias" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Conteúdo</label>
                <textarea 
                  rows="4"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all resize-none" 
                  placeholder="Descreva o conteúdo do comunicado detalhadamente..."
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Disparar Comunicado
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
