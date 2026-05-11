import React from 'react';
import { Activity, LogOut } from 'lucide-react';

interface TeknisiSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeMenu: 'TUGAS';
  activeTasksCount: number;
  handleLogout: () => void;
}

const TeknisiSidebar: React.FC<TeknisiSidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeMenu,
  activeTasksCount,
  handleLogout
}) => {
  return (
    <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-white dark:bg-navy border-r border-slate-200 dark:border-slate-700 z-50 flex-shrink-0 flex flex-col shadow-2xl`}>
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4 bg-slate-50 dark:bg-navy/80">
        <div className="relative">
          <img src="/logo.png" alt="DART Logo" className="w-12 h-14 object-contain" />
        </div>
        <div>
          <h1 className="font-stencil text-2xl tracking-widest text-slate-800 dark:text-white leading-none">HELPDESK-DART</h1>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        <button
          className={`w-full flex items-center justify-between px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-4
            ${activeMenu === 'TUGAS' ? 'bg-slate-50 dark:bg-navy/80 text-targetred border-targetred shadow-inner' : 'border-transparent text-slate-500 dark:text-slate-300 hover:bg-white dark:hover:bg-gunmetal/20'}
          `}
        >
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5" /> TUGAS PERBAIKAN
          </div>
          {activeTasksCount > 0 && (
            <span className="bg-targetred text-sand text-[10px] w-5 h-5 flex items-center justify-center font-bold font-mono animate-pulse rounded-full">
              {activeTasksCount}
            </span>
          )}
        </button>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy/80">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:text-targetred hover:bg-targetred/10 font-tactical text-sm tracking-wider transition-all rounded-sm border border-transparent hover:border-targetred/30">
          <LogOut className="w-5 h-5" /> KELUAR SISTEM
        </button>
      </div>
    </aside>
  );
};

export default TeknisiSidebar;
