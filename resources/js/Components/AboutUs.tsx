import { motion } from 'framer-motion';
import { Target, Shield, CheckCircle2 } from 'lucide-react';

const AboutUs = () => {
  return (
    <section id="tentang kami" className="py-24 bg-cighra-light dark:bg-cighra-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-stencil text-slate-800 dark:text-white mb-4 uppercase">TENTANG KAMI</h2>
          <p className="text-slate-600 dark:text-slate-300 font-mono text-sm tracking-widest uppercase">Mengenal Lebih Dekat Pusat Layanan SISFO DART (Dynamic Autonomous Retaliatory Target)</p>
          <div className="w-24 h-1 bg-cighra-gold mx-auto mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-wider uppercase">MISI KAMI</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Kami berkomitmen untuk memberikan layanan dukungan teknis yang cepat, tepat, dan andal demi menjamin kelancaran operasional latihan menembak menggunakan sistem DART (Dynamic Autonomous Retaliatory Target).
              </p>
              <div className="space-y-4">
                {[
                  "Respons cepat terhadap setiap kendala teknis.",
                  "Transparansi proses perbaikan perangkat.",
                  "Peningkatan kualitas layanan secara berkelanjutan."
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-cighra-gold" />
                    <span className="text-slate-600 dark:text-slate-300/80 font-mono text-sm uppercase">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="bg-white dark:bg-cighra-darkcard/80 p-8 border-2 border-cighra-gold relative group shadow-xl">
            <div className="absolute -top-4 -right-4 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white p-3 font-stencil text-xl shadow-lg">BENGPUSPUSKOMLEKAD</div>
            <h3 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white mb-6 tracking-wider uppercase">PUSAT KOMANDO</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-cighra-gold/10 p-3 h-fit border border-cighra-gold/30">
                  <Shield className="w-6 h-6 text-cighra-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white uppercase text-sm">Pemeliharaan Terpadu</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Pengelolaan aset dan perbaikan dilakukan oleh personel ahli Bengpuskomlekad.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-cighra-gold/10 p-3 h-fit border border-cighra-gold/30">
                  <CheckCircle2 className="w-6 h-6 text-cighra-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white uppercase text-sm">Dukungan Operasional</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Siap siaga memberikan dukungan teknis di setiap medan latihan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
