
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Zap, LogIn, FileText, Send, Laptop, MousePointer2, ClipboardCheck } from 'lucide-react';

const About = () => {
  return (
    <section id="PANDUAN" className="py-24 bg-gunmetal relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-stencil text-white mb-4 uppercase">PANDUAN PELAPORAN</h2>
          <p className="text-soft-sand/60 font-mono text-sm tracking-widest uppercase">Ikuti langkah-langkah di bawah ini untuk melaporkan kerusakan perangkat.</p>
          <div className="w-24 h-1 bg-targetred mx-auto mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: <Laptop className="w-12 h-12 text-olive" />,
              title: "MASUK KE SISTEM",
              desc: "Masuk menggunakan Nama Pengguna dan Kata Sandi Anda. Jika belum memiliki akun, silakan melakukan registrasi terlebih dahulu."
            },
            {
              step: "02",
              icon: <MousePointer2 className="w-12 h-12 text-olive" />,
              title: "PILIH MENU LAPORAN",
              desc: "Setelah masuk ke Dashboard Utama, pilih tombol 'Buat Laporan Baru' untuk memulai proses pengajuan perbaikan perangkat."
            },
            {
              step: "03",
              icon: <ClipboardCheck className="w-12 h-12 text-olive" />,
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
              className="glass-panel p-8 tactical-border group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-sand/30 dark:bg-black/40 p-4 rounded-sm border border-soft-gunmetal/10 dark:border-soft-sand/5 group-hover:border-olive transition-all">
                  {item.icon}
                </div>
                <span className="font-stencil text-2xl text-soft-gunmetal/20 dark:text-soft-sand/10 group-hover:text-olive transition-colors">{item.step}</span>
              </div>
              <h3 className="text-xl font-tactical font-bold text-gunmetal dark:text-white mb-3 tracking-wider">{item.title}</h3>
              <p className="text-soft-gunmetal/70 dark:text-soft-sand/60 leading-relaxed font-sans text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
