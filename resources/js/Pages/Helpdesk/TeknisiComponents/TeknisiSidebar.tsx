import React from 'react';
import { Activity } from 'lucide-react';

interface TeknisiSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeMenu: 'TUGAS';
  activeTasksCount?: number;
}

const TeknisiSidebar: React.FC<TeknisiSidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen: _,
  activeMenu,
  activeTasksCount = 0
}) => {
  return (
    <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-white dark:bg-cighra-dark border-r border-slate-200 dark:border-slate-600 z-50 flex-shrink-0 flex flex-col shadow-2xl`}>
      

      <nav className="flex-1 py-6 space-y-1">
        <button
          id="tour-tugas-perbaikan"
          className={`w-full flex items-center justify-between px-6 py-3.5 font-tactical text-sm tracking-wider transition-all duration-300 border-l-4 group
            ${activeMenu === 'TUGAS' ? 'bg-cighra-gold/10 text-cighra-gold border-cighra-gold shadow-inner' : 'border-transparent text-slate-500 dark:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50 hover:text-cighra-gold dark:hover:text-cighra-gold'}
          `}
        >
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5" /> TUGAS PERBAIKAN
          </div>
          {activeTasksCount > 0 && (
            <span className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white text-xs w-5 h-5 flex items-center justify-center font-bold font-mono animate-pulse rounded-full">
              {activeTasksCount}
            </span>
          )}
        </button>
      </nav>

    </aside>
  );
};

export default TeknisiSidebar;

