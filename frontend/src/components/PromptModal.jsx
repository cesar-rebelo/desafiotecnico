import { useEffect, useState } from 'react';

export default function PromptModal({ isOpen, title, message, placeholder, defaultValue, onConfirm, onCancel }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue || '');
    }
  }, [isOpen, defaultValue]);

  // Fechar ao pressionar a tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop com desfoque de fundo */}
      <div 
        className="absolute inset-0 bg-gray-900/35 backdrop-blur-md animate-fadeIn" 
        onClick={onCancel}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white border border-gray-200/50 rounded-2xl w-full max-w-[380px] p-6 shadow-2xl animate-scaleUp z-10">
        <div>
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{title || 'Feedback'}</h3>
          <p className="text-[12px] text-gray-400 mt-2 leading-relaxed">{message}</p>
          
          <div className="mt-4">
            <textarea
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full text-[12px] px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none text-gray-700"
              autoFocus
            />
          </div>
          
          <div className="flex items-center gap-2.5 w-full mt-5">
            <button
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all focus:outline-none"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm(value);
                onCancel();
              }}
              disabled={!value.trim()}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:hover:bg-red-600 text-white rounded-xl text-[12px] font-semibold transition-all shadow-sm shadow-red-200 focus:outline-none"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
