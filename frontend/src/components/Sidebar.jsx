import {
  LayoutDashboard, TrendingUp, ClipboardCheck,
  FileText, Mail, ShieldCheck, LogOut
} from 'lucide-react';

const items = [
  { id: 'dashboard',     label: 'Visão Geral',      icon: LayoutDashboard },
  { id: 'acompanhamento',label: 'Acompanhamento',   icon: TrendingUp },
  { id: 'auditoria',     label: 'Auditoria',        icon: ClipboardCheck },
  { id: 'censos',        label: 'Censos Anuais',    icon: FileText },
  { id: 'comunicacao',   label: 'Comunicação',      icon: Mail },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900 leading-tight">JE Portugal</p>
            <p className="text-[10px] text-gray-400 font-medium">Plataforma Unificada</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 text-left ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-all group">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-600">
            IT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-gray-700 truncate">IT Manager</p>
            <p className="text-[10px] text-gray-400 truncate">Mandato 2026/2027</p>
          </div>
          <LogOut className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
