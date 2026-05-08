import { motion } from 'framer-motion';
import { Target, Shield, CheckCircle2 } from 'lucide-react';

const AboutUs = () => {
  return (
    <section id="tentang kami" className="py-24 bg-sand dark:bg-gunmetal relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-stencil text-gunmetal dark:text-white mb-4 uppercase">TENTANG KAMI</h2>
          <p className="text-soft-gunmetal/70 dark:text-soft-sand/60 font-mono text-sm tracking-widest uppercase">Mengenal Lebih Dekat Pusat Layanan Helpdesk DART</p>
          <div className="w-24 h-1 bg-targetred mx-auto mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white tracking-wider uppercase">MISI KAMI</h3>
              <p className="text-soft-gunmetal/80 dark:text-soft-sand leading-relaxed">
                Kami berkomitmen untuk memberikan layanan dukungan teknis yang cepat, tepat, dan andal demi menjamin kelancaran operasional latihan menembak menggunakan sistem DART.
              </p>
              <div className="space-y-4">
                {[
                  "Respons cepat terhadap setiap kendala teknis.",
                  "Transparansi proses perbaikan perangkat.",
                  "Peningkatan kualitas layanan secara berkelanjutan."
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-targetred" />
                    <span className="text-soft-gunmetal/70 dark:text-soft-sand/80 font-mono text-sm uppercase">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="bg-sand/30 dark:bg-black/20 p-8 border-2 border-olive relative group shadow-xl">
            <div className="absolute -top-4 -right-4 bg-olive text-sand p-3 font-stencil text-xl shadow-lg">BENGPUS</div>
            <h3 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white mb-6 tracking-wider uppercase">PUSAT KOMANDO</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-olive/10 p-3 h-fit border border-olive/30">
                  <Shield className="w-6 h-6 text-olive" />
                </div>
                <div>
                  <h4 className="font-bold text-gunmetal dark:text-white uppercase text-sm">Pemeliharaan Terpadu</h4>
                  <p className="text-soft-gunmetal/60 dark:text-soft-sand/40 text-xs mt-1">Pengelolaan aset dan perbaikan dilakukan oleh personel ahli Bengpuskomlekad.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-olive/10 p-3 h-fit border border-olive/30">
                  <CheckCircle2 className="w-6 h-6 text-olive" />
                </div>
                <div>
                  <h4 className="font-bold text-gunmetal dark:text-white uppercase text-sm">Dukungan Operasional</h4>
                  <p className="text-soft-gunmetal/60 dark:text-soft-sand/40 text-xs mt-1">Siap siaga memberikan dukungan teknis di setiap medan latihan.</p>
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
