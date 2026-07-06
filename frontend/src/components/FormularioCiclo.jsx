import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FormularioCiclo({ selectedJE, onSubmit, onClose, initialValues }) {
  const [form, setForm] = useState({ faturamento: '', membros: '', nps: '', semester: '2026.1' });

  useEffect(() => {
    setForm(initialValues || { faturamento: '', membros: '', nps: '', semester: '2026.1' });
  }, [initialValues, selectedJE.id]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handle = (e) => {
    e.preventDefault();
    onSubmit({ organizationId: selectedJE.id, ...form });
  };

  return (
    <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm animate-fadeUp">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[14px] font-bold text-gray-900">Grelha de Indicadores</h3>
          <p className="text-[12px] text-gray-400">{selectedJE.name}</p>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-lg leading-none transition-colors">×</button>
      </div>

      <form onSubmit={handle} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Faturamento (€)', key: 'faturamento', type: 'number', placeholder: '1500' },
          { label: 'Nº de Membros',   key: 'membros',     type: 'number', placeholder: '35' },
          { label: 'NPS (−100 a 100)',key: 'nps',         type: 'number', placeholder: '80' },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            <input
              required type={type} value={form[key]} placeholder={placeholder}
              onChange={e => set(key, e.target.value)}
              className="w-full text-[13px] px-3.5 py-2.5 border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
            />
          </div>
        ))}

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Semestre</label>
          <select
            value={form.semester} onChange={e => set('semester', e.target.value)}
            className="w-full text-[13px] px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          >
            <option>2026.1</option>
            <option>2026.2</option>
          </select>
        </div>

        <div className="sm:col-span-2 pt-1">
          <button type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-all">
            Submeter Grelha
          </button>
        </div>
      </form>
    </div>
  );
}
