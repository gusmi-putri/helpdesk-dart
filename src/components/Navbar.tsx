import { useState } from 'react';
import { Menu, X, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (item: string) => {
    setIsOpen(false);
    if (item === 'DASHBOARD') {
      navigate('/login');
    } else {
      // Jika saat ini bukan di beranda, arahkan ke beranda dulu
      if (location.pathname !== '/') {
        navigate('/');
      }
      // Beri jeda sedikit agar halaman beranda termuat
      setTimeout(() => {
        const element = document.getElementById(item === 'BERANDA' ? 'hero' : item.toLowerCase());
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
            <ShieldAlert className="text-targetred w-8 h-8" />
            <span className="font-stencil text-2xl tracking-widest text-white">LAPOR-PAK</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['BERANDA', 'INTEL', 'ASET', 'KONTAK', 'DASHBOARD'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-2 text-sm font-tactical font-bold tracking-wider transition-all border-b-2 
                    ${
                      (item === 'DASHBOARD' && location.pathname === '/login') 
                        ? 'text-targetred border-targetred' 
                        : 'text-gray-300 hover:text-targetred hover:border-targetred border-transparent'
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
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
          className="md:hidden bg-gunmetal border-b border-olive"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['BERANDA', 'INTEL', 'ASET', 'KONTAK', 'DASHBOARD'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`w-full text-left block px-3 py-2 text-base font-tactical font-bold tracking-wider transition-colors
                  ${
                    (item === 'DASHBOARD' && location.pathname === '/login')
                    ? 'text-targetred bg-black/40'
                    : 'text-gray-300 hover:text-targetred hover:bg-black/20'
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
