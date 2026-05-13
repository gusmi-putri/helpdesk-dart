import React from 'react';
import { PlaySquare, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoBank: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="glass-panel border-t-4 border-t-olive overflow-hidden bg-white dark:bg-cighra-darkcard/80 shadow-xl border border-slate-200 dark:border-slate-600">
        <div className="p-6 md:p-8 flex items-center gap-4">
          <div className="p-4 bg-olive/10 text-olive rounded-sm">
            <Video size={32} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-tactical font-bold text-slate-800 dark:text-white tracking-wider uppercase mb-1">
              BANK VIDEO PANDUAN
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Pusat pembelajaran visual untuk perbaikan mandiri dan penanganan dasar sistem DART.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Video 1 */}
        <motion.div whileHover={{ y: -5 }} className="glass-panel border border-slate-200 dark:border-slate-600 bg-white dark:bg-cighra-darkcard/80 rounded-sm overflow-hidden group cursor-pointer shadow-lg hover:shadow-olive/20 transition-all">
          <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity mix-blend-overlay"></div>
            <PlaySquare className="w-16 h-16 text-white/50 group-hover:text-cighra-gold transition-colors z-10" />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 font-mono rounded-sm">03:45</div>
          </div>
          <div className="p-5 border-t-2 border-transparent group-hover:border-cighra-primary transition-colors">
            <h4 className="font-tactical font-bold text-lg text-slate-800 dark:text-white uppercase leading-tight mb-2">Pengecekan Kabel Utama & Sensor</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Langkah awal memastikan konektivitas antara target dan terminal command center.</p>
          </div>
        </motion.div>

        {/* Placeholder Video 2 */}
        <motion.div whileHover={{ y: -5 }} className="glass-panel border border-slate-200 dark:border-slate-600 bg-white dark:bg-cighra-darkcard/80 rounded-sm overflow-hidden group cursor-pointer shadow-lg hover:shadow-olive/20 transition-all">
          <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity mix-blend-overlay"></div>
            <PlaySquare className="w-16 h-16 text-white/50 group-hover:text-cighra-gold transition-colors z-10" />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 font-mono rounded-sm">05:20</div>
          </div>
          <div className="p-5 border-t-2 border-transparent group-hover:border-cighra-primary transition-colors">
            <h4 className="font-tactical font-bold text-lg text-slate-800 dark:text-white uppercase leading-tight mb-2">Reset Sistem Motor Mekanik DART</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Cara aman me-reset dinamo penggerak jika target macet atau tidak merespons perintah jatuh/bangun.</p>
          </div>
        </motion.div>
        
        {/* Placeholder Video 3 */}
        <motion.div whileHover={{ y: -5 }} className="glass-panel border border-slate-200 dark:border-slate-600 bg-white dark:bg-cighra-darkcard/80 rounded-sm overflow-hidden group cursor-pointer shadow-lg hover:shadow-olive/20 transition-all">
          <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631557348983-4db0b8ce1eb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity mix-blend-overlay"></div>
            <PlaySquare className="w-16 h-16 text-white/50 group-hover:text-cighra-gold transition-colors z-10" />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 font-mono rounded-sm">02:15</div>
          </div>
          <div className="p-5 border-t-2 border-transparent group-hover:border-cighra-primary transition-colors">
            <h4 className="font-tactical font-bold text-lg text-slate-800 dark:text-white uppercase leading-tight mb-2">Kalibrasi Aki & Power Supply</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Pengecekan tegangan standar pada aki lapangan untuk mencegah drop tiba-tiba.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoBank;
