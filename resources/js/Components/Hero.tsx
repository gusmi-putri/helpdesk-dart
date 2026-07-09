import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import bgHero from '../../img_1.jpeg';

const TracerBullet = ({ delay, top, duration, repeatDelay, angle = 0, origin = 'left' }: { delay: number; top: string; duration: number, repeatDelay: number, angle?: number, origin?: 'left' | 'right' }) => {
  const isRight = origin === 'right';
  return (
    <div className="absolute left-0 right-0 z-0 pointer-events-none origin-center" style={{ top, transform: `rotate(${angle}deg)` }}>
      <motion.div
        className={`absolute h-[2px] ${isRight ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-transparent via-targetred to-white opacity-80`}
        style={{ width: '250px', filter: 'drop-shadow(0 0 8px rgba(255, 36, 0, 0.8))' }}
        initial={{ x: isRight ? '120vw' : '-300px', opacity: 0 }}
        animate={{ x: isRight ? '-300px' : '120vw', opacity: [0, 1, 1, 0] }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
          delay: delay,
          repeatDelay: repeatDelay,
        }}
      />
    </div>
  );
};

const Hero = () => {
  return (
    <section id="beranda" className="relative h-screen flex items-center justify-center overflow-hidden bg-cighra-light dark:bg-cighra-dark">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cighra-gold/20 via-sky-200/40 to-cighra-light z-10 pointer-events-none dark:from-cighra-gold/5 dark:via-cighra-dark/95 dark:to-cighra-dark"></div>

        <div
          className="absolute inset-0 bg-cover bg-center grayscale mix-blend-overlay opacity-60 z-10 pointer-events-none scale-110"
          style={{ backgroundImage: `url(${bgHero})` }}
        ></div>

        {/* Placeholder for tactical background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none z-10"></div>

        {/* Bullet Tracers Effect */}
        <TracerBullet delay={0} top="15%" duration={0.8} repeatDelay={2} />
        <TracerBullet delay={1.2} top="35%" duration={0.6} repeatDelay={3} origin="right" />
        <TracerBullet delay={2.5} top="60%" duration={0.9} repeatDelay={1.5} angle={15} />
        <TracerBullet delay={0.8} top="80%" duration={0.7} repeatDelay={2.5} origin="right" />
        <TracerBullet delay={3.1} top="40%" duration={1.0} repeatDelay={2} angle={-25} origin="right" />
        <TracerBullet delay={1.5} top="70%" duration={0.8} repeatDelay={3.5} angle={10} origin="right" />
        <TracerBullet delay={0.5} top="25%" duration={0.7} repeatDelay={2.8} angle={-15} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex justify-center"
        >
          <img src="/logo.png" fetchPriority="high" loading="eager" className="w-24 h-24 object-contain animate-pulse" alt="Logo" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-stencil font-bold text-slate-800 dark:text-white mb-4 tracking-wider uppercase"
        >
          SISTEM INFORMASI<br /> <span className="text-cighra-gold">DART</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-mono text-xs md:text-sm tracking-[0.3em] text-cighra-primary font-bold drop-shadow-sm dark:font-normal dark:text-slate-400 uppercase mb-2"
        >
          Dynamic Autonomous Retaliatory Target
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg md:text-xl text-slate-800 font-bold dark:font-normal dark:text-slate-200 font-tactical mb-8 max-w-2xl mx-auto border-l-4 border-cighra-gold pl-4 py-3 pr-4 bg-white/40 dark:bg-black/30 backdrop-blur-md rounded-r-sm text-left drop-shadow-md"
        >
          <span className="typewriter-text text-cighra-gold font-black drop-shadow-md">BENGPUSKOMLEKAD</span>
          <br />
          Pusat Layanan Perbaikan DART (Dynamic Autonomous Retaliatory Target): Penanganan Cepat untuk Jamin Kesiapan, Keamanan, dan Kelancaran Latihan Menembak.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link href="/login" className="px-8 py-4 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white font-tactical font-bold text-lg tracking-widest uppercase transition-all tactical-border border-cighra-gold shadow-lg hover:shadow-[0_0_20px_rgba(30,49,102,0.4)] dark:hover:shadow-[0_0_20px_rgba(230,194,31,0.4)] text-center">
            Buat Laporan Baru
          </Link>
          <a href="#PANDUAN" className="px-8 py-4 bg-transparent border-2 border-cighra-gold hover:bg-cighra-primary dark:hover:bg-cighra-gold hover:text-white dark:hover:text-slate-900 text-slate-800 dark:text-white font-tactical font-bold text-lg tracking-widest uppercase transition-all text-center">
            Lihat Panduan
          </a>
        </motion.div>
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
    </section>
  );
};

export default Hero;


