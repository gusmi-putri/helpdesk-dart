import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Terminal } from 'lucide-react';

const Contact = () => {
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 2000);
  };

  return (
    <section id="kontak" className="py-24 bg-[#1a1f22] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-8 md:p-12 border-t-4 border-targetred relative overflow-hidden"
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-targetred/50 mt-4 mr-4 pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="text-targetred w-8 h-8" />
            <h2 className="text-2xl md:text-4xl font-stencil text-gunmetal dark:text-white tracking-widest uppercase">PANEL TRANSMISI</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 font-tactical text-sm tracking-wider mb-2">IDENTITAS (CODENAME)</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-sand dark:bg-gunmetal border border-gray-600 p-3 text-gunmetal dark:text-white focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-all font-sans"
                  placeholder="Masukkan identitas..."
                />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-400 font-tactical text-sm tracking-wider mb-2">KATEGORI LAPORAN</label>
                <select className="w-full bg-sand dark:bg-gunmetal border border-gray-600 p-3 text-gunmetal dark:text-white focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-all cursor-pointer">
                  <option>Pelanggaran Keamanan</option>
                  <option>Kerusakan Infrastruktur</option>
                  <option>Aktivitas Mencurigakan</option>
                  <option>Lainnya</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-600 dark:text-gray-400 font-tactical text-sm tracking-wider mb-2">RINCIAN LAPORAN (ENCRYPTED)</label>
              <textarea 
                required
                rows={5}
                className="w-full bg-sand dark:bg-gunmetal border border-gray-600 p-3 text-gunmetal dark:text-white focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-all font-sans resize-none"
                placeholder="Jelaskan rincian kejadian dengan akurat..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status !== 'idle'}
              className="w-full md:w-auto px-8 py-4 bg-olive hover:bg-camogreen text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest uppercase transition-all flex items-center justify-center gap-2 group border border-camogreen disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'idle' && <><Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> KIRIM TRANSMISI</>}
              {status === 'sending' && <span className="typewriter-text">ENKRIPSI DATA...</span>}
              {status === 'sent' && <span className="text-khaki">TRANSMISI BERHASIL</span>}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
