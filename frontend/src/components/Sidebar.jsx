import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, ClipboardCheck, FileText, Mail, LogOut, X, Sliders } from 'lucide-react';

const items = [
  { to: '/dashboard',      label: 'Visão Geral',   icon: LayoutDashboard },
  { to: '/acompanhamento', label: 'Acompanhamento', icon: TrendingUp },
  { to: '/auditoria',      label: 'Auditoria',      icon: ClipboardCheck },
  { to: '/censos',         label: 'Censos Anuais',  icon: FileText },
  { to: '/comunicacao',    label: 'Comunicação',    icon: Mail },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Backdrop overlay para telemóveis */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-gray-900/35 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
        />
      )}

      {/* Aside container */}
      <aside
        className={`w-56 shrink-0 bg-white border-r border-gray-200/60 flex flex-col h-screen fixed lg:sticky top-0 left-0 z-50 lg:z-30 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & Close Button */}
        <div className="px-7 pt-7 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/je-logo.png" className="w-8 h-8 object-contain shrink-0" alt="JE Portugal" />
            <div>
              <p className="text-[13px] font-bold text-gray-900 leading-none">JE Portugal</p>
              <p className="text-[10px] text-gray-400 font-medium mt-1">Plataforma Unificada</p>
            </div>
          </div>
          {/* Botão fechar apenas para telemóveis */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            title="Fechar Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mx-5 border-t border-gray-100 mb-3" />

        {/* Nav com NavLinks da react-router-dom */}
        <nav className="flex-1 px-4 space-y-px overflow-y-auto">
          {items.map(({ to, label, icon: Icon }) => {
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-6 pt-4">
          <NavLink
            to="/backoffice"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 text-left mb-2.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Sliders className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                Backoffice
              </>
            )}
          </NavLink>

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
    </>
  );
}
