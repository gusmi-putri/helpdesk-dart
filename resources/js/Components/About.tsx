
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Zap, LogIn, FileText, Send, Laptop, MousePointer2, ClipboardCheck } from 'lucide-react';

const About = () => {
  return (
    <section id="PANDUAN" className="py-24 bg-[#1e2528] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-stencil text-gunmetal dark:text-white mb-4 uppercase">ALUR PELAPORAN KERUSAKAN</h2>
          <p className="text-gray-600 dark:text-gray-400 font-mono text-sm tracking-widest uppercase">PROSEDUR PELAPORAN KERUSAKAN PERANGKAT DART</p>
          <div className="w-24 h-1 bg-targetred mx-auto mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "STEP 1",
              icon: <Laptop className="w-12 h-12 text-olive" />,
              title: "AKSES & LOGIN SISTEM",
              desc: "Gunakan User ID dan Password Anda melalui menu login yang telah disediakan,jika belum terdaftar silahkan daftar terlebih dahulu dengan mengeklik tombol daftar."
            },
            {
              step: "STEP 2",
              icon: <MousePointer2 className="w-12 h-12 text-olive" />,
              title: "PILIH MENU LAPORAN",
              desc: "Masuk ke Dashboard Utama dan pilih menu 'LAPORAN KERUSAKAN' untuk memulai pengajuan perbaikan perangkat DART."
            },
            {
              step: "STEP 3",
              icon: <ClipboardCheck className="w-12 h-12 text-olive" />,
              title: "INPUT DATA & KIRIM",
              desc: "Masukkan Nomor Seri DART, deskripsi detail kerusakan, serta lokasi kejadian, lalu tekan tombol 'KIRIM LAPORAN'."
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
                <div className="bg-sand dark:bg-gunmetal p-4 rounded-sm border border-gray-300 dark:border-gray-700 group-hover:border-camogreen transition-all">
                  {item.icon}
                </div>
                <span className="font-stencil text-2xl text-gray-300 dark:text-gray-800 group-hover:text-olive transition-colors">{item.step}</span>
              </div>
              <h3 className="text-xl font-tactical font-bold text-gunmetal dark:text-white mb-3 tracking-wider">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-sans text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
