
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Zap, LogIn, FileText, Send, Laptop, MousePointer2, ClipboardCheck } from 'lucide-react';

const About = () => {
  return (
    <section id="PANDUAN" className="py-24 bg-cighra-light dark:bg-cighra-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-stencil text-slate-800 dark:text-white mb-4 uppercase">PANDUAN PELAPORAN</h2>
          <p className="text-slate-600 dark:text-slate-300 font-mono text-sm tracking-widest uppercase">Ikuti langkah-langkah di bawah ini untuk melaporkan kerusakan perangkat.</p>
          <div className="w-24 h-1 bg-cighra-gold text-slate-900 mx-auto mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: <Laptop className="w-12 h-12 text-cighra-gold" />,
              title: "MASUK KE SISTEM",
              desc: "Masuk menggunakan Nama Pengguna dan Kata Sandi Anda. Jika belum memiliki akun, silakan melakukan registrasi terlebih dahulu."
            },
            {
              step: "02",
              icon: <MousePointer2 className="w-12 h-12 text-cighra-gold" />,
              title: "PILIH MENU LAPORAN",
              desc: "Setelah masuk ke Dashboard Utama, pilih tombol 'Buat Laporan Baru' untuk memulai proses pengajuan perbaikan perangkat."
            },
            {
              step: "03",
              icon: <ClipboardCheck className="w-12 h-12 text-cighra-gold" />,
              title: "ISI DATA & KIRIM",
              desc: "Lengkapi informasi perangkat, jelaskan kendala yang dialami, sertakan foto bukti kerusakan, lalu tekan 'Kirim Laporan'."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="glass-panel p-8 tactical-border group overflow-hidden relative shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cighra-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="bg-white dark:bg-cighra-darkcard p-4 rounded-sm border border-slate-200 dark:border-white/10 group-hover:border-cighra-primary dark:border-cighra-gold transition-all">
                  {item.icon}
                </div>
                <span className="font-stencil text-2xl text-slate-400/20 dark:text-white/20 group-hover:text-cighra-gold transition-colors">{item.step}</span>
              </div>
              <h3 className="text-xl font-tactical font-bold text-slate-800 dark:text-white mb-3 tracking-wider">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-200 leading-relaxed font-sans text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
