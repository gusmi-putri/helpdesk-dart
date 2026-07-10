import React from 'react';
import { Menu as MenuIcon, CircleUser, LogOut, Settings } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';

interface TopbarProps {
  setIsMobileMenuOpen: (open: boolean) => void;
  currentUser: any;
  isMobileMenuOpen?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ setIsMobileMenuOpen, currentUser, isMobileMenuOpen = false }) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-600 bg-cighra-primary dark:bg-cighra-darkcard/60 backdrop-blur-md flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-50 relative">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Buka menu navigasi"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden p-2 text-slate-200 dark:text-slate-400 hover:text-gunmetal dark:hover:text-white transition-colors focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none rounded"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <Menu as="div" className="relative ml-auto">
        <Menu.Button 
          className="flex items-center gap-0 border border-slate-200/20 dark:border-slate-600 rounded shadow-sm bg-black/10 dark:bg-cighra-darkcard/80 overflow-hidden focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none hover:bg-black/20 dark:hover:bg-cighra-darkcard transition-all active:scale-95 duration-300 cursor-pointer text-left"
        >
          <div className="bg-cighra-dark/40 dark:bg-cighra-darkcard/80 px-4 py-1.5 text-right flex flex-col justify-center border-r border-slate-200/20 dark:border-slate-600">
            <span className="block text-xs font-bold text-white dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Administrator'}</span>
            <span className="block text-[11px] font-mono tracking-widest text-cighra-gold dark:text-cighra-gold uppercase">{currentUser?.role || 'Admin'}</span>
          </div>
          <div className="w-10 h-full bg-black/20 dark:bg-cighra-darkcard/70 flex items-center justify-center p-2">
            <CircleUser className="w-6 h-6 text-slate-200 dark:text-slate-400" />
          </div>
        </Menu.Button>
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-slate-100 dark:divide-slate-700 rounded-sm bg-white dark:bg-cighra-darkcard shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/profile"
                    className={`${
                      active ? 'bg-cighra-primary/10 dark:bg-slate-800 text-cighra-primary dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    } group flex w-full items-center rounded-sm px-2 py-2 text-sm font-sans uppercase tracking-wider`}
                  >
                    <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                    Pengaturan Profil
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className={`${
                      active ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'
                    } group flex w-full items-center rounded-sm px-2 py-2 text-sm font-sans uppercase tracking-wider`}
                  >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Keluar / Logout
                  </Link>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </header>
  );
};

export default Topbar;

