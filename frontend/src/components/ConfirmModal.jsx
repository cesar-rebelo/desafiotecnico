import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
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
      <div className="relative bg-white border border-gray-200/50 rounded-2xl w-full max-w-[360px] p-6 shadow-2xl animate-scaleUp z-10">
        <div className="flex flex-col items-center text-center">
          {/* Ícone de alerta vermelho */}
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100/50">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{title || 'Confirmar Ação'}</h3>
          <p className="text-[12px] text-gray-400 mt-2.5 leading-relaxed">{message}</p>
          
          <div className="flex items-center gap-2.5 w-full mt-6">
            <button
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all focus:outline-none"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[12px] font-semibold transition-all shadow-sm shadow-red-200 focus:outline-none"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
