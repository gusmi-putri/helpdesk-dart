import React from 'react';
import { Send, History, LogOut } from 'lucide-react';

interface PelaporSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeMenu: 'FORM' | 'HISTORY';
  setActiveMenu: (menu: 'FORM' | 'HISTORY') => void;
  handleLogout: () => void;
}

const PelaporSidebar: React.FC<PelaporSidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeMenu,
  setActiveMenu,
  handleLogout
}) => {
  return (
    <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-slate-50 dark:bg-navy border-r border-slate-200 dark:border-slate-700 z-50 flex-shrink-0 flex flex-col shadow-2xl`}>
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4 bg-slate-50 dark:bg-gunmetal/60">
        <div className="relative">
          <img src="/logo.png" alt="DART Logo" className="w-12 h-14 object-contain" />
        </div>
        <div>
          <h1 className="font-stencil text-2xl tracking-widest text-slate-800 dark:text-white leading-none">HELPDESK-DART</h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6">
        <button
          onClick={() => { setActiveMenu('FORM'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
            ${activeMenu === 'FORM' ? 'bg-slate-50 dark:bg-navy/80 text-targetred border-targetred shadow-inner' : 'border-transparent text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gunmetal/20'}
          `}
        >
          <Send size={18} /> BUAT LAPORAN
        </button>

        <button
          onClick={() => { setActiveMenu('HISTORY'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
            ${activeMenu === 'HISTORY' ? 'bg-slate-50 dark:bg-navy/80 text-targetred border-targetred shadow-inner' : 'border-transparent text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gunmetal/20'}
          `}
        >
          <History size={18} /> RIWAYAT LAPORAN
        </button>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-gunmetal/60">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-300 hover:text-targetred hover:bg-targetred/10 font-tactical text-sm tracking-wider transition-all rounded-sm border border-transparent hover:border-targetred/30">
          <LogOut className="w-5 h-5" /> KELUAR SISTEM
        </button>
      </div>
    </aside>
  );
};

export default PelaporSidebar;
