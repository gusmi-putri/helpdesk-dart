import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Package, LogOut, GitPullRequest, Users, Layers, ChevronDown, ChevronRight, MapPin } from 'lucide-react';

interface StafSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeMenu: 'MASUK' | 'SELESAI' | 'INVENTARIS' | 'MUTASI' | 'PERSONEL' | 'SATUANS';
  setActiveMenu: (menu: 'MASUK' | 'SELESAI' | 'INVENTARIS' | 'MUTASI' | 'PERSONEL' | 'SATUANS') => void;
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
  const [isDataMasterExpanded, setIsDataMasterExpanded] = useState<boolean>(true);

  const isMasterDataActive = activeMenu === 'PERSONEL' || activeMenu === 'INVENTARIS' || activeMenu === 'SATUANS' || activeMenu === 'MUTASI';

  const menuClass = (menu: string) =>
    `w-full flex items-center justify-between px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-4 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none
    ${activeMenu === menu ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}`;

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
      
      <aside 
        className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-white dark:bg-cighra-dark border-r border-slate-200 dark:border-slate-600 z-50 flex-shrink-0 flex flex-col shadow-2xl`}
        aria-label="Navigasi Utama Staf"
      >
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
            aria-current={activeMenu === 'MASUK' ? 'page' : undefined}
            className={menuClass('MASUK')}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" /> LAPORAN MASUK
            </div>
            {pendingCount > 0 && (
              <span 
                className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                aria-label={`${pendingCount} laporan masuk belum diverifikasi`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveMenu('SELESAI'); setIsMobileMenuOpen(false); }}
            aria-current={activeMenu === 'SELESAI' ? 'page' : undefined}
            className={menuClass('SELESAI')}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" /> ARSIP PERBAIKAN
            </div>
          </button>

          {/* DATA MASTER (Collapsible) */}
          <div>
            <button
              onClick={() => setIsDataMasterExpanded(!isDataMasterExpanded)}
              aria-expanded={isDataMasterExpanded}
              aria-controls="staf-data-master-submenu"
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
                id="staf-data-master-submenu"
                role="region"
                aria-label="Submenu Data Master Staf"
                className="bg-slate-50 dark:bg-cighra-darkcard/20 py-1 border-l-4 border-cighra-primary dark:border-cighra-gold/20"
              >
                <button
                  onClick={() => { setActiveMenu('PERSONEL'); setIsMobileMenuOpen(false); }}
                  aria-current={activeMenu === 'PERSONEL' ? 'page' : undefined}
                  className={`w-full text-left pl-[54px] py-2.5 flex items-center gap-2 text-xs font-tactical tracking-widest transition-colors focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none ${activeMenu === 'PERSONEL' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  <Users size={14} /> » PERSONEL
                </button>
                <button
                  onClick={() => { setActiveMenu('INVENTARIS'); setIsMobileMenuOpen(false); }}
                  aria-current={activeMenu === 'INVENTARIS' ? 'page' : undefined}
                  className={`w-full text-left pl-[54px] py-2.5 flex items-center gap-2 text-xs font-tactical tracking-widest transition-colors focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none ${activeMenu === 'INVENTARIS' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  <Package size={14} /> » INVENTARIS
                </button>
                <button
                  onClick={() => { setActiveMenu('SATUANS'); setIsMobileMenuOpen(false); }}
                  aria-current={activeMenu === 'SATUANS' ? 'page' : undefined}
                  className={`w-full text-left pl-[54px] py-2.5 flex items-center gap-2 text-xs font-tactical tracking-widest transition-colors focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none ${activeMenu === 'SATUANS' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  <MapPin size={14} /> » SATUAN
                </button>
                <button
                  onClick={() => { setActiveMenu('MUTASI'); setIsMobileMenuOpen(false); }}
                  aria-current={activeMenu === 'MUTASI' ? 'page' : undefined}
                  className={`w-full text-left pl-[54px] pr-4 py-2.5 flex items-center justify-between text-xs font-tactical tracking-widest transition-colors focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none ${activeMenu === 'MUTASI' ? 'text-cighra-primary dark:text-cighra-gold font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <GitPullRequest size={14} /> » RIWAYAT PENGAJUAN
                  </div>
                  {mutationPendingCount > 0 && (
                    <span 
                      className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-2 shrink-0"
                      aria-label={`${mutationPendingCount} mutasi tertunda`}
                    >
                      {mutationPendingCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-600 bg-cighra-light dark:bg-cighra-darkcard/80">
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

export default StafSidebar;
