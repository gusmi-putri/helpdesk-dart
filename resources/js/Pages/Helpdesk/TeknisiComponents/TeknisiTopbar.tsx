import React from 'react';
import { Menu, CircleUser } from 'lucide-react';

interface TeknisiTopbarProps {
  setIsMobileMenuOpen: (open: boolean) => void;
  currentUser: any;
}

const TeknisiTopbar: React.FC<TeknisiTopbarProps> = ({ setIsMobileMenuOpen, currentUser }) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-700 bg-sand/80 dark:bg-navy/60 backdrop-blur-md flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 text-slate-500 dark:text-slate-300 hover:text-gunmetal dark:hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-0 border border-slate-200 dark:border-slate-600 rounded shadow-sm bg-slate-50 dark:bg-navy/80 ml-auto">
        <div className="bg-sand/80 dark:bg-navy/80 px-4 py-1.5 text-right flex flex-col justify-center">
          <span className="block text-xs font-bold text-slate-800 dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Teknisi DART'}</span>
          <span className="block text-[9px] font-mono tracking-widest text-targetred">OPERATOR DASHBOARD</span>
        </div>
        <div className="w-10 h-full bg-slate-50 dark:bg-navy/70 border-l border-slate-200 dark:border-slate-600 flex items-center justify-center p-2">
          <CircleUser className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        </div>
      </div>
    </header>
  );
};

export default TeknisiTopbar;
