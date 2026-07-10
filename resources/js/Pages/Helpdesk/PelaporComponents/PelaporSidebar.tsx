import React from 'react';
import { Send, History, Video } from 'lucide-react';

interface PelaporSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeMenu: 'FORM' | 'HISTORY' | 'WIZARD' | 'VIDEO';
  setActiveMenu: (menu: 'FORM' | 'HISTORY' | 'WIZARD' | 'VIDEO') => void;
}

const PelaporSidebar: React.FC<PelaporSidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeMenu,
  setActiveMenu
}) => {
  return (
    <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-white dark:bg-cighra-dark border-r border-slate-200 dark:border-slate-600 z-50 flex-shrink-0 flex flex-col shadow-2xl`}>
      <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex items-center gap-4 bg-cighra-light dark:bg-cighra-dark/60">
        <div className="relative">
          <img src="/logo.png" alt="DART Logo" fetchPriority="high" loading="eager" className="w-12 h-14 object-contain" />
        </div>
        <div>
          <h1 className="font-stencil text-2xl tracking-widest text-slate-800 dark:text-white leading-none">SISFO DART</h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6">
        <button
          onClick={() => { setActiveMenu('FORM'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider uppercase transition-all duration-300 border-l-4
            ${activeMenu === 'FORM' ? 'bg-cighra-primary/10 text-cighra-primary dark:bg-cighra-gold/10 dark:text-cighra-gold border-cighra-primary dark:border-cighra-gold shadow-inner' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-cighra-darkcard/50 hover:text-cighra-primary dark:hover:text-cighra-gold'}
          `}
        >
          <Send size={18} className={activeMenu === 'FORM' ? 'text-cighra-primary dark:text-cighra-gold' : ''} /> BUAT LAPORAN
        </button>

        <button
          onClick={() => { setActiveMenu('HISTORY'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider uppercase transition-all duration-300 border-l-4
            ${activeMenu === 'HISTORY' ? 'bg-cighra-primary/10 text-cighra-primary dark:bg-cighra-gold/10 dark:text-cighra-gold border-cighra-primary dark:border-cighra-gold shadow-inner' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-cighra-darkcard/50 hover:text-cighra-primary dark:hover:text-cighra-gold'}
          `}
        >
          <History size={18} className={activeMenu === 'HISTORY' ? 'text-cighra-primary dark:text-cighra-gold' : ''} /> RIWAYAT LAPORAN
        </button>
        
        <button
          onClick={() => { setActiveMenu('VIDEO'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider uppercase transition-all duration-300 border-l-4
            ${activeMenu === 'VIDEO' ? 'bg-cighra-primary/10 text-cighra-primary dark:bg-cighra-gold/10 dark:text-cighra-gold border-cighra-primary dark:border-cighra-gold shadow-inner' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-cighra-darkcard/50 hover:text-cighra-primary dark:hover:text-cighra-gold'}
          `}
        >
          <Video size={18} className={activeMenu === 'VIDEO' ? 'text-cighra-primary dark:text-cighra-gold' : ''} /> BANK VIDEO
        </button>
      </nav>
    </aside>
  );
};

export default PelaporSidebar;
