
import { motion } from 'framer-motion';

const Features = () => {
  const assets = [
    { title: "SISTEM RADAR", stat: "100%", desc: "Pemantauan zona real-time." },
    { title: "UNIT TAKTIS", stat: "Siaga 1", desc: "Regu respons cepat terpadu." },
    { title: "ENKRIPSI DATA", stat: "AES-256", desc: "Keamanan tingkat militer tertinggi." },
    { title: "SATPAM SIBER", stat: "Aktif", desc: "Deteksi ancaman digital 24/7." }
  ];

  return (
    <section id="aset" className="py-24 bg-cighra-light dark:bg-cighra-dark relative overflow-hidden">
      {/* Background Camo / Tech pattern placeholder */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#c3b091 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex items-center justify-between border-b-2 border-cighra-primary dark:border-cighra-gold pb-4"
        >
          <h2 className="text-3xl md:text-5xl font-stencil text-slate-800 dark:text-white flex items-center gap-4">
            <span className="text-cighra-primary dark:text-cighra-gold">/</span> GUDANG ASET
          </h2>
          <span className="font-tactical text-cighra-primary dark:text-cighra-gold font-bold tracking-widest hidden md:inline">AUTHORIZATION: GRANTED</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-cighra-darkcard p-6 border-l-4 border-cighra-primary dark:border-cighra-gold hover:border-cighra-primary dark:border-cighra-gold transition-all shadow-xl relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cighra-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cighra-primary dark:bg-cighra-gold animate-pulse"></div>
              <h4 className="text-slate-500 dark:text-slate-400 font-tactical text-sm tracking-widest mb-2 uppercase">DATA {index + 1}</h4>
              <h3 className="text-slate-800 dark:text-white font-stencil text-2xl mb-4 uppercase">{asset.title}</h3>
              <div className="text-3xl font-tactical font-bold text-cighra-primary dark:text-cighra-gold mb-2">{asset.stat}</div>
              <p className="text-sm text-slate-600 dark:text-slate-200 font-sans border-t border-slate-200 dark:border-slate-700/50 pt-4">{asset.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
