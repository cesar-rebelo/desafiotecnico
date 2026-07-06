import { useState, useEffect } from 'react';
import { Send, CheckCircle2, Circle, Trash2 } from 'lucide-react';

export default function ComunicacaoView({ announcements: initial, onPublish, onDelete }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Sincronizar o estado local sempre que a lista de comunicados no pai (banco de dados) for alterada
  useEffect(() => {
    setItems(prev => {
      return initial.map(newAnn => {
        const existing = prev.find(p => p.id === newAnn.id);
        return {
          ...newAnn,
          read: existing ? existing.read : false
        };
      });
    });
  }, [initial]);

  const toggle = (id) => {
    setItems(p => p.map(a => a.id === id ? { ...a, read: !a.read } : a));
  };

  const publish = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onPublish(title.trim(), content.trim());
    setTitle('');
    setContent('');
  };

  const unread = items.filter(a => !a.read).length;

  return (
    <div className="space-y-10 animate-fadeUp">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Comunicação Oficial</h1>
          <p className="text-sm text-gray-400 mt-1.5">Canal de comunicados da federação para a rede MJP.</p>
        </div>
        {unread > 0 && (
          <span className="text-[11px] font-bold bg-red-50 text-red-500 border border-red-100 px-2.5 py-1 rounded-full">
            {unread} por ler
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed */}
        <div className="lg:col-span-2">
          <h2 className="text-[14px] font-semibold text-gray-700 mb-5">Mural de Avisos</h2>
          <div className="bg-white/75 backdrop-blur-sm border border-white/90 rounded-2xl overflow-hidden shadow-sm">
            {items.length === 0 ? (
              <p className="px-6 py-10 text-center text-[13px] text-gray-400 italic">
                Sem comunicados de momento na rede.
              </p>
            ) : (
              items.map((ann, i) => (
                <div key={ann.id}
                  className={`flex items-start gap-4 px-6 py-4.5 hover:bg-gray-50/40 transition-colors ${i < items.length - 1 ? 'border-b border-gray-50' : ''} ${ann.read ? 'opacity-55' : ''}`}
                >
                  <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${ann.read ? 'bg-gray-200' : 'bg-indigo-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-800">{ann.title}</p>
                    {ann.content && (
                      <p className="text-[12px] text-gray-500 mt-1 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                    )}
                    <p className="text-[10px] text-gray-300 mt-2">{ann.date}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggle(ann.id)}
                      className="p-1.5 text-gray-300 hover:text-indigo-500 rounded-lg transition-colors"
                      title={ann.read ? "Marcar como não lido" : "Marcar como lido"}
                    >
                      {ann.read ? <Circle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </button>
                    <button
                      onClick={() => onDelete(ann.id, ann.title)}
                      className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                      title="Eliminar Comunicado"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Publicar */}
        <div>
          <h2 className="text-[14px] font-semibold text-gray-700 mb-5">Novo Comunicado</h2>
          <form onSubmit={publish} className="space-y-4">
            <input
              type="text" value={title} required placeholder="Título do comunicado"
              onChange={e => setTitle(e.target.value)}
              className="w-full text-[13px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
            />
            <textarea
              rows={5} value={content} required placeholder="Detalhe o conteúdo do comunicado..."
              onChange={e => setContent(e.target.value)}
              className="w-full text-[13px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all resize-none"
            />
            <button type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-200">
              <Send className="w-3.5 h-3.5" /> Publicar para a Rede
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
