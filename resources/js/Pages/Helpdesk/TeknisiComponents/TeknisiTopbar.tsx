import React, { useState } from 'react';
import { Menu as MenuIcon, CircleUser, LogOut, Settings, KeyRound, AlertTriangle } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Link, router } from '@inertiajs/react';
import ChangePasswordModal from '../AdminComponents/ChangePasswordModal';
import { Modal } from '@/Components/ui/Modal';
import { Button } from '@/Components/ui/Button';

interface TeknisiTopbarProps {
  setIsMobileMenuOpen: (open: boolean) => void;
  currentUser: any;
}

const TeknisiTopbar: React.FC<TeknisiTopbarProps> = ({ setIsMobileMenuOpen, currentUser }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <>
    <header className="h-16 border-b border-slate-200 dark:border-slate-600 bg-cighra-primary text-white dark:bg-cighra-darkcard/60 backdrop-blur-md flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-50 relative">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 mr-4">
          <img src="/logo.png" alt="DART Logo" className="w-8 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
          <h1 className="font-stencil text-xl tracking-widest text-white hidden sm:block leading-none mt-1">SISFO DART</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 text-slate-500 dark:text-slate-300 hover:text-gunmetal dark:hover:text-white transition-colors"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <Menu as="div" className="relative ml-auto">
        <Menu.Button 
          className="flex items-center gap-0 border border-slate-200/20 dark:border-slate-600 rounded shadow-sm bg-black/10 dark:bg-cighra-darkcard/80 hover:bg-black/20 dark:hover:bg-cighra-darkcard transition-all active:scale-95 duration-300 cursor-pointer text-left focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none"
        >
          <div className="px-4 py-1.5 text-right flex flex-col justify-center border-r border-slate-200/20 dark:border-slate-600">
            <span className="block text-xs font-bold text-white dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Teknisi DART'}</span>
            <span className="block text-[11px] font-mono tracking-widest text-cighra-gold dark:text-cighra-gold">OPERATOR DASHBOARD</span>
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
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className={`${
                      active ? 'bg-cighra-primary/10 dark:bg-slate-800 text-cighra-primary dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    } group flex w-full items-center rounded-sm px-2 py-2 text-sm font-sans uppercase tracking-wider text-left`}
                  >
                    <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
                    Ganti Kata Sandi
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className={`${
                      active ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'
                    } group flex w-full items-center rounded-sm px-2 py-2 text-sm font-sans uppercase tracking-wider text-left`}
                  >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Keluar / Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </header>
    
    <ChangePasswordModal 
       isOpen={isPasswordModalOpen} 
       onClose={() => setIsPasswordModalOpen(false)} 
    />

    {isLogoutModalOpen && (
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        maxWidth="lg"
        icon={<AlertTriangle />}
        title="KONFIRMASI KELUAR SISTEM"
        footer={
          <div className="flex gap-4 w-full">
            <Button 
              variant="danger" 
              onClick={handleLogout} 
              className="flex-[2] uppercase" 
              size="lg"
            >
              <LogOut className="w-5 h-5" /> YA, KELUAR SISTEM
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setIsLogoutModalOpen(false)} 
              className="flex-1 uppercase" 
              size="lg"
            >
              BATAL
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <h4 className="text-xl font-tactical font-bold text-slate-800 dark:text-white tracking-[0.2em] uppercase">
            AKHIRI SESI SEKARANG?
          </h4>
          <p className="text-sm font-mono text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-wider">
            ANDA AKAN MERESTART SESI PADA <span className="text-cighra-primary dark:text-cighra-gold font-bold underline decoration-2 underline-offset-4">SISFO DART</span>. ANDA HARUS LOGIN KEMBALI UNTUK MASUK KE DALAM SISTEM.
          </p>
        </div>
      </Modal>
    )}
    </>
  );
};

export default TeknisiTopbar;
