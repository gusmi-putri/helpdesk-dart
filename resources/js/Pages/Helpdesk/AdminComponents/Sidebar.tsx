import React, { useState } from 'react';
import {
  Radar, Users, Package, MapPin, CheckSquare,
  ChevronDown, ChevronRight, Database, MessageSquare,
  Activity, LogOut, Map as MapIcon, Layers
} from 'lucide-react';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeMenu: 'ANALYTICS' | 'MAP' | 'USERS' | 'LOGS' | 'REPORTS' | 'UNITS' | 'SATUANS' | 'APPROVAL_CENTER' | 'FEEDBACK';
  handleMenuClick: (menu: 'ANALYTICS' | 'MAP' | 'USERS' | 'LOGS' | 'REPORTS' | 'UNITS' | 'SATUANS' | 'APPROVAL_CENTER' | 'FEEDBACK') => void;
  dbUsers: any[];
  dbMutations?: any[];
  dbSatuans?: any[];
  dbFeedbackUnreadCount?: number;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeMenu,
  handleMenuClick,
  dbUsers,
  dbMutations = [],
  dbSatuans = [],
  dbFeedbackUnreadCount = 0,
  handleLogout
}) => {
  // Collapsible menu states
  const [isDataMasterExpanded, setIsDataMasterExpanded] = useState<boolean>(true);

  const pendingPersonelCount = dbUsers.filter((u: any) => !u.is_approved).length; // Keep this, but we need to pass dbUserMutations or just use dbUsers.
  const pendingMutationsCount = dbMutations.filter((m: any) => m.status === 'pending').length;
  const pendingSatuansCount = dbSatuans.filter((s: any) => s.pending_action !== null).length;
  const totalPending = pendingPersonelCount + pendingMutationsCount + pendingSatuansCount;

  const isMasterDataActive = activeMenu === 'USERS' || activeMenu === 'UNITS' || activeMenu === 'SATUANS';

  const baseButtonClass = "w-full flex items-center justify-between px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none";

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <button
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm w-full cursor-default border-none focus-visible:outline-none"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Tutup navigasi seluler"
          tabIndex={0}
        />
      )}

      {/* MAIN SIDEBAR - TACTICAL */}
      <aside 
        className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-white dark:bg-cighra-dark border-r border-slate-200 dark:border-slate-600 z-50 flex-shrink-0 flex flex-col shadow-2xl`}
        aria-label="Navigasi Utama Admin"
      >
        {/* Brand */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex items-center gap-4 bg-cighra-light dark:bg-cighra-dark/60">
          <div className="relative">
            <img src="/logo.png" alt="DART Logo" fetchPriority="high" loading="eager" className="w-12 h-14 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
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
            aria-current={activeMenu === 'MAP' ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none
              ${activeMenu === 'MAP' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <MapIcon size={18} /> PETA MONITORING
          </button>

          {/* 2. ANALISIS DATA */}
          <button
            onClick={() => handleMenuClick('ANALYTICS')}
            aria-current={activeMenu === 'ANALYTICS' ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none
              ${activeMenu === 'ANALYTICS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <Activity size={18} /> ANALISIS DATA
          </button>

          {/* 3. DATA MASTER (Collapsible) */}
          <div>
            <button
              onClick={() => setIsDataMasterExpanded(!isDataMasterExpanded)}
              aria-expanded={isDataMasterExpanded}
              aria-controls="data-master-submenu"
              className={`w-full flex items-center justify-between px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none
                ${isMasterDataActive ? 'bg-cighra-gold/5 text-cighra-gold border-cighra-gold/40' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
              `}
            >
              <div className="flex items-center gap-3">
                <Layers size={18} /> DATA MASTER
              </div>
              <div className="flex items-center gap-2">
                {isDataMasterExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
            </button>

            {isDataMasterExpanded && (
              <div 
                id="data-master-submenu" 
                role="region" 
                aria-label="Submenu Data Master"
                className="bg-slate-50 dark:bg-cighra-darkcard/20 py-1 border-l-4 border-cighra-primary dark:border-cighra-gold/20"
              >
                <button
                  onClick={() => handleMenuClick('USERS')}
                  aria-current={activeMenu === 'USERS' ? 'page' : undefined}
                  className={`w-full text-left pl-[54px] py-2.5 flex items-center gap-2 text-xs font-tactical tracking-widest transition-colors focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none ${activeMenu === 'USERS' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  <Users size={14} /> » PERSONEL
                </button>
                <button
                  onClick={() => handleMenuClick('UNITS')}
                  aria-current={activeMenu === 'UNITS' ? 'page' : undefined}
                  className={`w-full text-left pl-[54px] py-2.5 flex items-center gap-2 text-xs font-tactical tracking-widest transition-colors focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none ${activeMenu === 'UNITS' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  <Package size={14} /> » INVENTARIS
                </button>
                <button
                  onClick={() => handleMenuClick('SATUANS')}
                  aria-current={activeMenu === 'SATUANS' ? 'page' : undefined}
                  className={`w-full text-left pl-[54px] py-2.5 flex items-center gap-2 text-xs font-tactical tracking-widest transition-colors focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none ${activeMenu === 'SATUANS' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  <MapPin size={14} /> » SATUAN
                </button>
              </div>
            )}
          </div>

          {/* 4. PUSAT PERSETUJUAN */}
          <button
            onClick={() => handleMenuClick('APPROVAL_CENTER')}
            aria-current={activeMenu === 'APPROVAL_CENTER' ? 'page' : undefined}
            className={`w-full flex items-center justify-between px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none
              ${activeMenu === 'APPROVAL_CENTER' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <div className="flex items-center gap-3">
              <CheckSquare size={18} /> PUSAT PERSETUJUAN
            </div>
            {totalPending > 0 && (
              <span 
                className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-md"
                aria-label={`${totalPending} pengajuan tertunda`}
              >
                {totalPending}
              </span>
            )}
          </button>

          {/* 5. DATA LAPORAN */}
          <button
            onClick={() => handleMenuClick('REPORTS')}
            aria-current={activeMenu === 'REPORTS' ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none
              ${activeMenu === 'REPORTS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <Radar size={18} /> DATA LAPORAN
          </button>

          {/* 6. UMPAN BALIK */}
          <button
            onClick={() => handleMenuClick('FEEDBACK')}
            aria-current={activeMenu === 'FEEDBACK' ? 'page' : undefined}
            className={`w-full flex items-center justify-between gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none
              ${activeMenu === 'FEEDBACK' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={18} /> UMPAN BALIK
            </div>
            {dbFeedbackUnreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {dbFeedbackUnreadCount}
              </span>
            )}
          </button>

          {/* 7. LOG AKTIVITAS */}
          <button
            onClick={() => handleMenuClick('LOGS')}
            aria-current={activeMenu === 'LOGS' ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-4 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none
              ${activeMenu === 'LOGS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
            `}
          >
            <Database size={18} /> LOG AKTIVITAS
          </button>
        </nav>

        {/* 8. KELUAR SISTEM */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-600 bg-cighra-light dark:bg-cighra-dark/60">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 font-tactical text-sm tracking-wider transition-all rounded-sm border border-transparent hover:border-cighra-primary dark:hover:border-cighra-gold/30 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none"
            aria-label="Keluar dari sistem"
          >
            <LogOut className="w-5 h-5" /> KELUAR SISTEM
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
