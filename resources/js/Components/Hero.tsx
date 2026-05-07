import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';
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
    <section id="beranda" className="relative h-screen flex items-center justify-center overflow-hidden bg-sand dark:bg-gunmetal">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-olive/40 via-gunmetal to-gunmetal z-10 pointer-events-none"></div>

        <div
          className="absolute inset-0 bg-cover bg-center grayscale mix-blend-overlay opacity-30 z-10 pointer-events-none scale-110"
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
          <Crosshair className="text-targetred w-16 h-16 animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-stencil font-bold text-gunmetal dark:text-white mb-4 tracking-wider uppercase"
        >
          SISTEM PELAPORAN <br /> <span className="text-targetred">HELPDESK DART</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-tactical mb-8 max-w-2xl mx-auto border-l-4 border-olive pl-4 text-left"
        >
          <span className="typewriter-text text-camogreen font-bold">BENGPUSKOMLEKAD</span>
          <br />
          Pusat Layanan Perbaikan DART: Penanganan Cepat untuk Jamin Kesiapan, Keamanan, dan Kelancaran Latihan Menembak.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex justify-center gap-4"
        >
          <Link href="/login" className="px-8 py-4 bg-targetred hover:bg-red-700 text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest uppercase transition-all tactical-border border-targetred hover:border-red-500 shadow-[0_0_15px_rgba(255,36,0,0.4)] hover:shadow-[0_0_25px_rgba(255,36,0,0.6)]">
            Lapor Sekarang
          </Link>
          <a href="#PANDUAN" className="px-8 py-4 bg-transparent border-2 border-olive hover:bg-olive/20 text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest uppercase transition-all">
            Panduan Laporan
          </a>
        </motion.div>
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#4b5320 1px, transparent 1px), linear-gradient(90deg, #4b5320 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
    </section>
  );
};

export default Hero;

