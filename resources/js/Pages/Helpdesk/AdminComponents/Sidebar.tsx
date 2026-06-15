import React, { useState } from 'react';
import {
  Radar, Users, UserCheck, Package,
  ChevronDown, ChevronRight, Database, MessageSquare,
  Activity, LogOut, Map as MapIcon, GitPullRequest
} from 'lucide-react';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeMenu: 'ANALYTICS' | 'MAP' | 'USERS' | 'LOGS' | 'REPORTS' | 'UNITS' | 'SETTINGS' | 'APPROVAL' | 'FEEDBACK' | 'MUTATIONS';
  handleMenuClick: (menu: 'ANALYTICS' | 'MAP' | 'USERS' | 'LOGS' | 'REPORTS' | 'UNITS' | 'SETTINGS' | 'APPROVAL' | 'FEEDBACK' | 'MUTATIONS') => void;
  dbUsers: any[];
  dbMutations?: any[];
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeMenu,
  handleMenuClick,
  dbUsers,
  dbMutations = [],
  handleLogout
}) => {
  // Collapsible menu states
  const [isPersonelExpanded, setIsPersonelExpanded] = useState<boolean>(true);
  const [isInventarisExpanded, setIsInventarisExpanded] = useState<boolean>(true);

  const pendingApprovalsCount = dbUsers.filter((u: any) => !u.is_approved).length;
  const pendingMutationsCount = dbMutations.filter((m: any) => m.status === 'pending').length;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAIN SIDEBAR - TACTICAL */}
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
          {/* 1. PETA MONITORING */}
          <button
            onClick={() => handleMenuClick('MAP')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'MAP' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <MapIcon size={18} /> PETA MONITORING
          </button>

          {/* 2. ANALISIS DATA */}
          <button
            onClick={() => handleMenuClick('ANALYTICS')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'ANALYTICS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <Activity size={18} /> ANALISIS DATA
          </button>

          {/* 3. DATA PERSONEL (Collapsible) */}
          <div>
            <button
              onClick={() => {
                handleMenuClick('USERS');
                setIsPersonelExpanded(!isPersonelExpanded);
              }}
              className={`w-full flex items-center justify-between px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
                ${activeMenu === 'USERS' || activeMenu === 'APPROVAL' ? 'bg-cighra-gold/5 text-cighra-gold border-cighra-gold/40' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
              `}
            >
              <div className="flex items-center gap-3">
                <Users size={18} /> DATA PERSONEL
              </div>
              <div className="flex items-center gap-2">
                {pendingApprovalsCount > 0 && (
                  <span className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {pendingApprovalsCount}
                  </span>
                )}
                {isPersonelExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
            </button>

            {isPersonelExpanded && (
              <div className="bg-slate-50 dark:bg-cighra-darkcard/20 py-1 border-l-4 border-cighra-primary dark:border-cighra-gold/20">
                <button
                  onClick={() => handleMenuClick('USERS')}
                  className={`w-full text-left pl-[54px] py-2.5 text-xs font-tactical tracking-widest transition-colors ${activeMenu === 'USERS' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  » DAFTAR PERSONEL
                </button>
                <button
                  onClick={() => handleMenuClick('APPROVAL')}
                  className={`w-full text-left flex items-center justify-between pl-[54px] pr-4 py-2.5 text-xs font-tactical tracking-widest transition-colors ${activeMenu === 'APPROVAL' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  <span className="truncate mr-2">» PERSETUJUAN BARU</span>
                  {pendingApprovalsCount > 0 && (
                    <span className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {pendingApprovalsCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 4. DATA INVENTARIS (Collapsible) */}
          <div>
            <button
              onClick={() => {
                handleMenuClick('UNITS');
                setIsInventarisExpanded(!isInventarisExpanded);
              }}
              className={`w-full flex items-center justify-between px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
                ${activeMenu === 'UNITS' || activeMenu === 'MUTATIONS' ? 'bg-cighra-gold/5 text-cighra-gold border-cighra-gold/40' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
              `}
            >
              <div className="flex items-center gap-3">
                <Package size={18} /> DATA INVENTARIS
              </div>
              <div className="flex items-center gap-2">
                {pendingMutationsCount > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {pendingMutationsCount}
                  </span>
                )}
                {isInventarisExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
            </button>

            {isInventarisExpanded && (
              <div className="bg-slate-50 dark:bg-cighra-darkcard/20 py-1 border-l-4 border-cighra-primary dark:border-cighra-gold/20">
                <button
                  onClick={() => handleMenuClick('UNITS')}
                  className={`w-full text-left pl-[54px] py-2.5 text-xs font-tactical tracking-widest transition-colors ${activeMenu === 'UNITS' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  » DAFTAR INVENTARIS
                </button>
                <button
                  onClick={() => handleMenuClick('MUTATIONS')}
                  className={`w-full text-left flex items-center justify-between pl-[54px] pr-4 py-2.5 text-xs font-tactical tracking-widest transition-colors ${activeMenu === 'MUTATIONS' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  <span className="truncate mr-2">» MUTASI INVENTARIS</span>
                  {pendingMutationsCount > 0 && (
                    <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {pendingMutationsCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 5. DATA LAPORAN */}
          <button
            onClick={() => handleMenuClick('REPORTS')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'REPORTS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <Radar size={18} /> DATA LAPORAN
          </button>

          {/* 6. UMPAN BALIK */}
          <button
            onClick={() => handleMenuClick('FEEDBACK')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'FEEDBACK' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <MessageSquare size={18} /> UMPAN BALIK
          </button>

          {/* 7. LOG AKTIVITAS */}
          <button
            onClick={() => handleMenuClick('LOGS')}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4
              ${activeMenu === 'LOGS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <Database size={18} /> LOG AKTIVITAS
          </button>
        </nav>

        {/* 8. KELUAR SISTEM */}
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
