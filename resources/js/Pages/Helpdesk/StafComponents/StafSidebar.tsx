import React from 'react';
import { AlertTriangle, CheckCircle, Database, LogOut, GitPullRequest, Users } from 'lucide-react';

interface StafSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeMenu: 'MASUK' | 'SELESAI' | 'INVENTARIS' | 'MUTASI' | 'PERSONEL';
  setActiveMenu: (menu: 'MASUK' | 'SELESAI' | 'INVENTARIS' | 'MUTASI' | 'PERSONEL') => void;
  handleLogout: () => void;
  pendingCount?: number;
  mutationPendingCount?: number;
}

const StafSidebar: React.FC<StafSidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeMenu,
  setActiveMenu,
  handleLogout,
  pendingCount = 0,
  mutationPendingCount = 0
}) => {
  const menuClass = (menu: string) =>
    `w-full flex items-center justify-between px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-4
    ${activeMenu === menu ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}`;

  return (
    <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-white dark:bg-cighra-dark border-r border-slate-200 dark:border-slate-600 z-50 flex-shrink-0 flex flex-col shadow-2xl`}>
      <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex items-center gap-4 bg-cighra-light dark:bg-cighra-darkcard/80">
        <div className="relative">
          <img src="/logo.png" alt="DART Logo" className="w-12 h-14 object-contain" />
        </div>
        <div>
          <h1 className="font-stencil text-2xl tracking-widest text-slate-800 dark:text-white leading-none">SISFO DART</h1>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <button
          onClick={() => { setActiveMenu('MASUK'); setIsMobileMenuOpen(false); }}
          className={menuClass('MASUK')}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" /> LAPORAN MASUK
          </div>
          {pendingCount > 0 && (
            <span className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveMenu('SELESAI'); setIsMobileMenuOpen(false); }}
          className={menuClass('SELESAI')}
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" /> ARSIP PERBAIKAN SELESAI
          </div>
        </button>

        <button
          onClick={() => { setActiveMenu('INVENTARIS'); setIsMobileMenuOpen(false); }}
          className={menuClass('INVENTARIS')}
        >
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5" /> INVENTARIS UNIT DART
          </div>
        </button>

        <button
          onClick={() => { setActiveMenu('MUTASI'); setIsMobileMenuOpen(false); }}
          className={menuClass('MUTASI')}
        >
          <div className="flex items-center gap-3">
            <GitPullRequest className="w-5 h-5" /> MUTASI INVENTARIS
          </div>
          {mutationPendingCount > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {mutationPendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveMenu('PERSONEL'); setIsMobileMenuOpen(false); }}
          className={menuClass('PERSONEL')}
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5" /> DATA PERSONEL
          </div>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-600 bg-cighra-light dark:bg-cighra-darkcard/80">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 font-tactical text-sm tracking-wider transition-all rounded-sm border border-transparent hover:border-cighra-primary dark:hover:border-cighra-gold/30">
          <LogOut className="w-5 h-5" /> KELUAR SISTEM
        </button>
      </div>
    </aside>
  );
};

export default StafSidebar;
