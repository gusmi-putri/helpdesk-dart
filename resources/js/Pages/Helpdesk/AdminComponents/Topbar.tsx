import React from 'react';
import { Menu, CircleUser } from 'lucide-react';

interface TopbarProps {
  setIsMobileMenuOpen: (open: boolean) => void;
  currentUser: any;
}

const Topbar: React.FC<TopbarProps> = ({ setIsMobileMenuOpen, currentUser }) => {
  return (
    <header className="h-16 border-b border-soft-gunmetal/10 dark:border-soft-sand/5 bg-sand/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 text-soft-gunmetal/60 dark:text-soft-sand/40 hover:text-gunmetal dark:hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-0 border border-soft-gunmetal/10 dark:border-soft-sand/10 rounded shadow-sm bg-sand/50 dark:bg-black/20 ml-auto">
        <div className="bg-sand/80 dark:bg-black/40 px-4 py-1.5 text-right flex flex-col justify-center">
          <span className="block text-xs font-bold text-gunmetal dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Administrator'}</span>
          <span className="block text-[9px] font-mono tracking-widest text-targetred">OPERATOR DASHBOARD</span>
        </div>
        <div className="w-10 h-full bg-sand/50 dark:bg-black/60 border-l border-soft-gunmetal/10 dark:border-soft-sand/10 flex items-center justify-center p-2">
          <CircleUser className="w-6 h-6 text-soft-gunmetal/40 dark:text-soft-sand/30" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
