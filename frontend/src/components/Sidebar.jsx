import { LayoutDashboard, TrendingUp, ClipboardCheck, FileText, Mail, LogOut } from 'lucide-react';

const items = [
  { id: 'dashboard',      label: 'Visão Geral',   icon: LayoutDashboard },
  { id: 'acompanhamento', label: 'Acompanhamento', icon: TrendingUp },
  { id: 'auditoria',      label: 'Auditoria',      icon: ClipboardCheck },
  { id: 'censos',         label: 'Censos Anuais',  icon: FileText },
  { id: 'comunicacao',    label: 'Comunicação',    icon: Mail },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-56 shrink-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/60 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-7 pt-7 pb-5">
        <div className="flex items-center gap-2.5">
          <img src="/je-logo.png" className="w-8 h-8 object-contain shrink-0" alt="JE Portugal" />
          <div>
            <p className="text-[13px] font-bold text-gray-900 leading-none">JE Portugal</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Plataforma Unificada</p>
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-gray-100 mb-3" />

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-px overflow-y-auto">
        {items.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 text-left ${
                active
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-gray-400'}`} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6 pt-4">
        <div className="mx-1 border-t border-gray-100 mb-4" />
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all group">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">IT</div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-gray-700 truncate">IT Manager</p>
            <p className="text-[10px] text-gray-400 truncate">2026 / 2027</p>
          </div>
          <LogOut className="w-3 h-3 text-gray-300 group-hover:text-gray-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
