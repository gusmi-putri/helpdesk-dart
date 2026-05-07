import { motion } from 'framer-motion';
import { Building2, Crosshair, Shield } from 'lucide-react';

const AboutUs = () => {
  return (
    <section id="tentang kami" className="py-24 bg-sand dark:bg-[#1a2024] relative overflow-hidden">
      {/* Background Camo Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4B5320 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-stencil text-gunmetal dark:text-white mb-4 uppercase">TENTANG BENGPUSKOMLEKAD</h2>
          <div className="w-24 h-1 bg-olive mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-400 font-mono text-sm tracking-widest max-w-2xl mx-auto uppercase">
            PUSAT PELAYANAN DAN PERBAIKAN PERALATAN DIGITAL ADVANCED RIFLE TARGET (DART)
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white mb-6 uppercase tracking-wider flex items-center gap-3">
              <Building2 className="text-olive w-6 h-6" /> SEJARAH & MISI KAMI
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 font-sans leading-relaxed text-justify">
              <p>
                BENGPUSKOMLEKAD (Bengkel Pusat Komunikasi dan Elektronika Angkatan Darat) merupakan satuan pelaksana pusat yang bertanggung jawab langsung dalam memelihara dan memperbaiki peralatan komunikasi dan elektronika taktis, termasuk sistem <span className="font-bold text-olive">Digital Advanced Rifle Target (DART)</span>.
              </p>
              <p>
                Sistem DART sangat krusial dalam mendukung kelancaran dan akurasi latihan menembak prajurit. Oleh karena itu, Bengpuskomlekad mendirikan Helpdesk DART sebagai pusat pelayanan cepat (Fast Response Center) untuk menerima, menganalisa, dan menindaklanjuti setiap laporan kerusakan hardware maupun software secara real-time.
              </p>
              <p>
                Misi utama kami adalah menjamin kesiapan operasional seluruh peralatan elektronik latihan, meminimalisir waktu tunggu (downtime), dan memastikan standar akurasi alat tetap presisi di setiap medan latihan.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {[
              { title: "RESPON CEPAT", desc: "Penanganan teknis dalam waktu singkat setelah laporan diterima.", icon: <Crosshair className="w-8 h-8 text-targetred" /> },
              { title: "TEKNISI TERLATIH", desc: "Ditangani langsung oleh prajurit teknisi spesialis bersertifikasi.", icon: <Shield className="w-8 h-8 text-blue-500" /> }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white/60 dark:bg-black/40 border-l-4 border-olive p-6 flex gap-4 items-start shadow-md backdrop-blur-sm"
              >
                <div className="bg-sand dark:bg-gunmetal p-3 shrink-0 border border-gray-300 dark:border-gray-700">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-tactical font-bold text-lg text-gunmetal dark:text-white uppercase tracking-wider mb-2">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-sans">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
