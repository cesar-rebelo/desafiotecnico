import { 
  LayoutDashboard, TrendingUp, ClipboardCheck, 
  FileText, Mail, ShieldCheck 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, dbStatus }) {
  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'acompanhamento', label: 'Acompanhamento', icon: TrendingUp },
    { id: 'auditoria', label: 'Auditoria & Certificação', icon: ClipboardCheck },
    { id: 'censos', label: 'Censos Anuais', icon: FileText },
    { id: 'comunicacao', label: 'Comunicação', icon: Mail },
  ];

  return (
    <aside className="w-64 bg-[#0b0f19] border-r border-slate-800/60 flex flex-col justify-between h-screen sticky top-0">
      <div className="flex flex-col gap-6 py-6 px-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">JE PORTUGAL</h2>
            <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Portal MJP</p>
          </div>
        </div>

        {/* Separador */}
        <hr className="border-slate-800/80 mx-2" />

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600/15 to-indigo-600/10 text-violet-400 border border-violet-500/25 shadow-md shadow-violet-500/5' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/10 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-violet-400">
            IT
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Equipa IT</h4>
            <p className="text-[10px] text-slate-400">itmanager@jeportugal.pt</p>
          </div>
        </div>
        
        {/* Network Status Badge */}
        <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-800/60">
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Servidor API</span>
          <span className={`flex items-center gap-1.5 text-[10px] font-bold ${dbStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`}>
            <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {dbStatus === 'connected' ? 'Online' : 'Simulado'}
          </span>
        </div>
      </div>
    </aside>
  );
}
