
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Zap } from 'lucide-react';

const About = () => {
  return (
    <section id="intel" className="py-24 bg-[#1e2528] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-stencil text-white mb-4 uppercase">INTEL BRIEFING</h2>
          <div className="w-24 h-1 bg-targetred mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-12 h-12 text-olive" />,
              title: "KEAMANAN TERJAMIN",
              desc: "Setiap laporan dienkripsi dengan protokol militer tingkat tinggi. Identitas pelapor dilindungi sepenuhnya."
            },
            {
              icon: <Zap className="w-12 h-12 text-olive" />,
              title: "RESPON CEPAT",
              desc: "Tim taktis komando siap merespons laporan dalam hitungan menit setelah data terverifikasi di sistem."
            },
            {
              icon: <Target className="w-12 h-12 text-olive" />,
              title: "TINDAKAN AKURAT",
              desc: "Penanganan tepat sasaran dengan pengerahan unit khusus sesuai dengan eskalasi dan kategori laporan."
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
              <div className="mb-4 bg-gunmetal inline-block p-4 rounded-sm border border-gray-700 group-hover:border-camogreen transition-all">
                {item.icon}
              </div>
              <h3 className="text-xl font-tactical font-bold text-white mb-3 tracking-wider">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed font-sans">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
