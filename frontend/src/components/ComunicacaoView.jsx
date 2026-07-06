import { useState } from 'react';
import { Mail, Send, CheckCircle2, Circle } from 'lucide-react';

export default function ComunicacaoView({ announcements: initial }) {
  const [items, setItems]     = useState(initial.map(a => ({ ...a, read: false })));
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');

  const toggle  = (id) => setItems(p => p.map(a => a.id === id ? { ...a, read: !a.read } : a));
  const publish = (e) => {
    e.preventDefault();
    setItems(p => [{ id: Date.now().toString(), title, content, date: new Date().toISOString().split('T')[0], read: false }, ...p]);
    setTitle(''); setContent('');
  };

  const unread = items.filter(a => !a.read).length;

  return (
    <div className="space-y-7 animate-fadeUp">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Comunicação Oficial</h1>
          <p className="text-sm text-gray-400 mt-0.5">Canal de comunicados da federação para a rede MJP.</p>
        </div>
        {unread > 0 && (
          <span className="text-[11px] font-bold bg-red-50 text-red-500 border border-red-100 px-2.5 py-1 rounded-full">
            {unread} por ler
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed de comunicados */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-[14px] font-semibold text-gray-800">Mural de Avisos</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {items.length === 0 && (
              <p className="px-6 py-8 text-center text-[13px] text-gray-300">Sem comunicados de momento.</p>
            )}
            {items.map((ann) => (
              <div key={ann.id} className={`px-6 py-4 flex items-start gap-4 transition-all hover:bg-gray-50/40 ${ann.read ? 'opacity-60' : ''}`}>
                <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${ann.read ? 'bg-gray-200' : 'bg-indigo-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800">{ann.title}</p>
                  {ann.content && <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2">{ann.content}</p>}
                  <p className="text-[10px] text-gray-300 mt-1">{ann.date}</p>
                </div>
                <button onClick={() => toggle(ann.id)} title={ann.read ? 'Marcar como não lido' : 'Marcar como lido'}
                  className="shrink-0 mt-0.5 text-gray-300 hover:text-indigo-500 transition-colors">
                  {ann.read
                    ? <Circle className="w-4 h-4" />
                    : <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  }
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Publicar comunicado */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 self-start">
          <h3 className="text-[13px] font-semibold text-gray-800">Novo Comunicado</h3>
          <form onSubmit={publish} className="space-y-3">
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="Título do comunicado"
              className="w-full text-[13px] px-3.5 py-2.5 border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
            />
            <textarea
              rows={4} value={content} onChange={e => setContent(e.target.value)} required
              placeholder="Detalhe o conteúdo do comunicado..."
              className="w-full text-[13px] px-3.5 py-2.5 border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all resize-none"
            />
            <button type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Publicar para a Rede
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
