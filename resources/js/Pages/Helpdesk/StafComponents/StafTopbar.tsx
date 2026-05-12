import React from 'react';
import { Menu, CircleUser } from 'lucide-react';

interface StafTopbarProps {
  setIsMobileMenuOpen: (open: boolean) => void;
  currentUser: any;
}

const StafTopbar: React.FC<StafTopbarProps> = ({ setIsMobileMenuOpen, currentUser }) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-600 bg-cighra-primary text-white dark:bg-cighra-darkcard/60 backdrop-blur-md flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 text-slate-200 dark:text-slate-400 dark:text-slate-300 hover:text-gunmetal dark:hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-0 border border-slate-200/20 dark:border-slate-600 rounded shadow-sm bg-black/10 dark:bg-cighra-darkcard/80 ml-auto overflow-hidden">
        <div className="bg-cighra-dark/40 dark:bg-cighra-darkcard/80 px-4 py-1.5 text-right flex flex-col justify-center border-r border-slate-200/20 dark:border-slate-600">
          <span className="block text-xs font-bold text-white dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Staf Admin'}</span>
          <span className="block text-[9px] font-mono tracking-widest text-cighra-gold dark:text-cighra-gold">OPERATOR DASHBOARD</span>
        </div>
        <div className="w-10 h-full bg-black/20 dark:bg-cighra-darkcard/70 flex items-center justify-center p-2">
          <CircleUser className="w-6 h-6 text-slate-200 dark:text-slate-400" />
        </div>
      </div>
    </header>
  );
};

export default StafTopbar;
