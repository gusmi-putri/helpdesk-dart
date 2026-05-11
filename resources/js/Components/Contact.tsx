import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Star } from 'lucide-react';
import { useForm } from '@inertiajs/react';

const Contact = () => {
  const { data, setData, post, processing, wasSuccessful, reset } = useForm({
    nama_pengirim: '',
    rating: 5,
    kategori: 'Saran Sistem',
    pesan: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/feedback', {
      onSuccess: () => reset()
    });
  };

  return (
    <section id="feedback" className="py-24 bg-gunmetal relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-8 md:p-12 border-t-4 border-targetred relative overflow-hidden"
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-targetred/30 mt-4 mr-4 pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl md:text-4xl font-stencil text-white uppercase">UMPAN BALIK</h2>
          </div>
          <p className="text-slate-300/60 mb-8 font-mono text-sm">BERIKAN SARAN ATAU PENILAIAN ANDA UNTUK MEMBANTU KAMI MENINGKATKAN LAYANAN HELPDESK DART.</p>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-600 dark:text-slate-300/70 font-tactical text-sm tracking-wider mb-2 uppercase">Nama Pengirim</label>
                <input
                  type="text"
                  required
                  value={data.nama_pengirim}
                  onChange={e => setData('nama_pengirim', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-navy/80 border border-slate-300 dark:border-slate-600 p-3 text-slate-800 dark:text-white focus:outline-none focus:border-olive transition-all font-sans"
                  placeholder="Masukkan nama Anda..."
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-300/70 font-tactical text-sm tracking-wider mb-2 uppercase">Kategori</label>
                <select
                  value={data.kategori}
                  onChange={e => setData('kategori', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-navy/80 border border-slate-300 dark:border-slate-600 p-3 text-slate-800 dark:text-white focus:outline-none focus:border-olive transition-all cursor-pointer"
                >
                  <option className="bg-slate-50 dark:bg-gunmetal">Saran Sistem</option>
                  <option className="bg-slate-50 dark:bg-gunmetal">Laporan Bug / Error</option>
                  <option className="bg-slate-50 dark:bg-gunmetal">Pengaduan Layanan</option>
                  <option className="bg-slate-50 dark:bg-gunmetal">Lainnya</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300/70 font-tactical text-sm tracking-wider mb-2 uppercase">Kepuasan Layanan</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setData('rating', star)}
                    className={`p-2 transition-all ${data.rating >= star ? 'text-yellow-500 scale-110' : 'text-slate-600/30 dark:text-slate-400 hover:text-yellow-500/50'}`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300/70 font-tactical text-sm tracking-wider mb-2 uppercase">Pesan / Saran</label>
              <textarea
                required
                rows={4}
                value={data.pesan}
                onChange={e => setData('pesan', e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy/80 border border-slate-300 dark:border-slate-600 p-3 text-slate-800 dark:text-white focus:outline-none focus:border-olive transition-all font-sans resize-none"
                placeholder="Tuliskan saran, kritik, atau pengaduan Anda di sini..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full md:w-auto px-8 py-4 bg-olive hover:bg-camogreen text-sand font-tactical font-bold text-lg tracking-widest uppercase transition-all flex items-center justify-center gap-2 group border border-olive disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {!processing && !wasSuccessful && <><Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> KIRIM SEKARANG</>}
              {processing && <span className="typewriter-text">MENGIRIM...</span>}
              {wasSuccessful && <span className="text-sand font-bold">TERKIRIM</span>}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
