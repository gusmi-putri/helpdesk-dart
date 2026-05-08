import { useState } from 'react';
import { Menu, X, ShieldAlert, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';
import { useStore } from '../store/useStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { url } = usePage();
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

  const handleNavClick = (item: string) => {
    setIsOpen(false);
    if (item === 'DASHBOARD') {
      router.visit('/login');
    } else {
      // Jika saat ini bukan di beranda, arahkan ke beranda dulu
      if (url !== '/') {
        router.visit('/');
      }
      // Beri jeda sedikit agar halaman beranda termuat
      setTimeout(() => {
        let targetId = item === 'BERANDA' ? 'hero' : item.toLowerCase();
        let element = document.getElementById(targetId);

        // Fallback jika ID menggunakan huruf besar (seperti PANDUAN)
        if (!element && item !== 'BERANDA') {
          element = document.getElementById(item);
        }

        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (item === 'BERANDA') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-olive">
      <div className="w-full px-4 sm:px-8 xl:px-16">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavClick('BERANDA')}
          >
            <img src="/logo.png" alt="DART Logo" className="w-9 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
            <span className="font-stencil text-2xl tracking-widest text-gunmetal dark:text-white">Helpdesk DART</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['BERANDA', 'PANDUAN', 'FEEDBACK', 'TENTANG KAMI', 'MASUK PANEL'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item === 'MASUK PANEL' ? 'DASHBOARD' : item)}
                  className={`px-3 py-2 text-sm font-tactical font-bold tracking-wider transition-all border-b-2 
                    ${((item === 'MASUK PANEL' || item === 'DASHBOARD') && url === '/login')
                      ? 'text-targetred border-targetred'
                      : 'text-soft-gunmetal dark:text-soft-sand hover:text-targetred hover:border-targetred border-transparent'
                    }
                  `}
                >
                  {item}
                </button>
              ))}
              <button
                onClick={toggleTheme}
                className="text-soft-gunmetal dark:text-soft-sand hover:text-targetred transition-colors ml-4"
                title="Ganti Tema"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-soft-gunmetal dark:text-soft-sand hover:text-gunmetal dark:hover:text-white ml-4"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-sand dark:bg-gunmetal border-b border-olive"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['BERANDA', 'PANDUAN', 'FEEDBACK', 'TENTANG KAMI', 'MASUK PANEL'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item === 'MASUK PANEL' ? 'DASHBOARD' : item)}
                className={`w-full text-left block px-3 py-2 text-base font-tactical font-bold tracking-wider transition-colors
                  ${((item === 'MASUK PANEL' || item === 'DASHBOARD') && url === '/login')
                    ? 'text-targetred bg-sand/50 dark:bg-black/40'
                    : 'text-soft-gunmetal dark:text-soft-sand hover:text-targetred hover:bg-sand/30 dark:hover:bg-black/20'
                  }
                `}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => { toggleTheme(); setIsOpen(false); }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-base font-tactical font-bold tracking-wider text-soft-gunmetal dark:text-soft-sand hover:text-targetred transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {theme === 'dark' ? 'MODE TERANG' : 'MODE GELAP'}
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
