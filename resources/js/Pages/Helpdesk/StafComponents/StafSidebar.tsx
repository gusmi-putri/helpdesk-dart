import React from 'react';
import { AlertTriangle, CheckCircle, Database, LogOut } from 'lucide-react';

interface StafSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeMenu: 'MASUK' | 'SELESAI' | 'INVENTARIS';
  setActiveMenu: (menu: 'MASUK' | 'SELESAI' | 'INVENTARIS') => void;
  handleLogout: () => void;
  pendingCount?: number;
}

const StafSidebar: React.FC<StafSidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeMenu,
  setActiveMenu,
  handleLogout,
  pendingCount = 0
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
          onClick={() => { setActiveMenu('MASUK'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center justify-between px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-4
            ${activeMenu === 'MASUK' ? 'bg-slate-50 dark:bg-navy/80 text-targetred border-targetred shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-gunmetal/20'}
          `}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" /> LAPORAN MASUK
          </div>
          {pendingCount > 0 && (
            <span className="bg-targetred text-sand text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveMenu('SELESAI'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-4
            ${activeMenu === 'SELESAI' ? 'bg-slate-50 dark:bg-navy/80 text-targetred border-targetred shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-gunmetal/20'}
          `}
        >
          <CheckCircle className="w-5 h-5" /> ARSIP PERBAIKAN SELESAI
        </button>

        <button
          onClick={() => { setActiveMenu('INVENTARIS'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-4
            ${activeMenu === 'INVENTARIS' ? 'bg-slate-50 dark:bg-navy/80 text-targetred border-targetred shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-gunmetal/20'}
          `}
        >
          <Database className="w-5 h-5" /> INVENTARIS UNIT DART
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

export default StafSidebar;
