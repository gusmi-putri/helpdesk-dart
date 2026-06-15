import React from 'react';
import {
  Radar, Users, UserCheck, Package, FileArchive,
  ChevronDown, ChevronRight, Database, MessageSquare,
  Activity, LogOut, Map as MapIcon, GitPullRequest
} from 'lucide-react';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeMenu: 'ANALYTICS' | 'MAP' | 'USERS' | 'LOGS' | 'REPORTS' | 'UNITS' | 'SETTINGS' | 'APPROVAL' | 'FEEDBACK' | 'MUTATIONS';
  handleMenuClick: (menu: 'ANALYTICS' | 'MAP' | 'USERS' | 'LOGS' | 'REPORTS' | 'UNITS' | 'SETTINGS' | 'APPROVAL' | 'FEEDBACK' | 'MUTATIONS') => void;
  isReportsExpanded: boolean;
  setIsReportsExpanded: (expanded: boolean) => void;
  setActiveSubReport: (sub: 'KERUSAKAN' | 'PERBAIKAN') => void;
  activeSubReport: 'KERUSAKAN' | 'PERBAIKAN';
  dbUsers: any[];
  dbMutations?: any[];
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeMenu,
  handleMenuClick,
  isReportsExpanded,
  setIsReportsExpanded,
  setActiveSubReport,
  activeSubReport,
  dbUsers,
  dbMutations = [],
  handleLogout
}) => {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAN SIDEBAR - TACTICAL */}
      <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-white dark:bg-cighra-dark border-r border-slate-200 dark:border-slate-600 z-50 flex-shrink-0 flex flex-col shadow-2xl`}>
        {/* Brand */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex items-center gap-4 bg-cighra-light dark:bg-cighra-dark/60">
          <div className="relative">
            <img src="/logo.png" alt="DART Logo" className="w-12 h-14 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
          </div>
          <div>
            <h1 className="font-stencil text-2xl tracking-widest text-slate-800 dark:text-white leading-none">SISFO DART</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 space-y-1">
          <button
            onClick={() => handleMenuClick('ANALYTICS')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'ANALYTICS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}}
            `}
          >
            <Activity size={18} /> ANALISIS DATA
          </button>

          <button
            onClick={() => handleMenuClick('MAP')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'MAP' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}}
            `}
          >
            <MapIcon size={18} /> PETA MONITORING
          </button>

          <button
            onClick={() => handleMenuClick('UNITS')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'UNITS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}}
            `}
          >
            <Package size={18} /> DATA INVENTARIS
          </button>

          <button
            onClick={() => handleMenuClick('MUTATIONS')}
            className={`w-full flex items-center justify-between px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'MUTATIONS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}}
            `}
          >
            <div className="flex items-center gap-3">
              <GitPullRequest size={18} /> MUTASI INVENTARIS
            </div>
            {dbMutations.filter((m: any) => m.status === 'pending').length > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                {dbMutations.filter((m: any) => m.status === 'pending').length}
              </span>
            )}
          </button>

          <div className="mt-4">
            <button
              onClick={() => setIsReportsExpanded(!isReportsExpanded)}
              className={`w-full flex items-center justify-between px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
                ${activeMenu === 'REPORTS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}}
              `}
            >
              <div className="flex items-center gap-3">
                <Radar size={18} /> DATA LAPORAN
              </div>
              {isReportsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {isReportsExpanded && (
              <div className="bg-slate-50 dark:bg-cighra-darkcard/20 py-2 border-l-4 border-cighra-primary dark:border-cighra-gold/20">
                <button
                  onClick={() => { handleMenuClick('REPORTS'); setActiveSubReport('KERUSAKAN'); }}
                  className={`w-full text-left pl-14 py-2 text-xs font-tactical tracking-widest transition-colors ${activeMenu === 'REPORTS' && activeSubReport === 'KERUSAKAN' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  » KERUSAKAN
                </button>
                <button
                  onClick={() => { handleMenuClick('REPORTS'); setActiveSubReport('PERBAIKAN'); }}
                  className={`w-full text-left pl-14 py-2 text-xs font-tactical tracking-widest transition-colors ${activeMenu === 'REPORTS' && activeSubReport === 'PERBAIKAN' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  » PERBAIKAN
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleMenuClick('USERS')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'USERS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}}
            `}
          >
            <Users size={18} /> DATA PERSONEL
          </button>
          <button
            onClick={() => handleMenuClick('APPROVAL')}
            className={`w-full flex items-center justify-between px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4 mt-4
              ${activeMenu === 'APPROVAL' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}}
            `}
          >
            <div className="flex items-center gap-3">
              <UserCheck size={18} /> PERSETUJUAN
            </div>
            {dbUsers.filter((u: any) => !u.is_approved).length > 0 && (
              <span className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                {dbUsers.filter((u: any) => !u.is_approved).length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleMenuClick('FEEDBACK')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'FEEDBACK' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}}
            `}
          >
            <MessageSquare size={18} /> UMPAN BALIK
          </button>

          <button
            onClick={() => handleMenuClick('LOGS')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'LOGS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}}
            `}
          >
            <Database size={18} /> LOG AKTIVITAS
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-600 bg-cighra-light dark:bg-cighra-dark/60">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 font-tactical text-sm tracking-wider transition-all rounded-sm border border-transparent hover:border-cighra-primary dark:hover:border-cighra-gold/30">
            <LogOut className="w-5 h-5" /> KELUAR SISTEM
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
