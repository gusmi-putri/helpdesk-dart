import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bot, PlaySquare, CheckCircle, ArrowRight, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PostReportWizardProps {
  reportData: {
    unit_id: string;
    deskripsi: string;
    tingkat_kerusakan: string;
  };
  onClose: () => void;
}

const PostReportWizard: React.FC<PostReportWizardProps> = ({ reportData, onClose }) => {
  const [step, setStep] = useState<'AI' | 'VIDEO'>('AI');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(true);
  const [errorAi, setErrorAi] = useState<string | null>(null);

  useEffect(() => {
    // Panggil API Gemini secara asinkronus
    const fetchDiagnosis = async () => {
      try {
        const res = await axios.post('/api/diagnose', {
          deskripsi: reportData.deskripsi,
          tingkat_kerusakan: reportData.tingkat_kerusakan,
          unit_id: reportData.unit_id
        });
        
        if (res.data.success) {
          setAiResponse(res.data.diagnosis);
        } else {
          setErrorAi("Gagal mendapatkan respons AI.");
        }
      } catch (err) {
        console.error(err);
        setErrorAi("Terjadi kesalahan jaringan atau API Key belum diatur.");
      } finally {
        setIsLoadingAi(false);
      }
    };

    fetchDiagnosis();
  }, [reportData]);

  // Fungsi untuk membersihkan teks markdown sederhana dari Gemini menjadi HTML
  const renderMarkdown = (text: string) => {
    // 1. Ganti Header ### menjadi tag <h3>
    let html = text.replace(/### (.*)/g, '<h3 class="font-tactical font-bold text-lg text-cighra-primary dark:text-cighra-gold mt-6 mb-2 uppercase tracking-wider">$1</h3>');
    
    // 2. Ganti Bold **teks** menjadi <strong>teks</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white">$1</strong>');
    
    // 3. Ganti Italic *teks* (yang bukan bullet) menjadi <em>teks</em>
    // Kita lewati dulu italic agar tidak bentrok dengan bullet list.
    
    // 4. Ganti pemisah ---
    html = html.replace(/---/g, '<hr class="my-5 border-slate-200 dark:border-slate-700" />');
    
    // 5. Ganti Bullet points * item
    html = html.replace(/^\* (.*)/gm, '<li class="ml-5 list-disc marker:text-cighra-primary dark:marker:text-cighra-gold mb-1">$1</li>');

    // 6. Ganti Numbered points 1. item
    html = html.replace(/^(\d+)\. (.*)/gm, '<li class="ml-5 list-decimal marker:font-bold marker:text-slate-500 mb-1">$2</li>');

    // 7. Ganti enter (newline) menjadi <br/> tapi jangan <br> di dalam list
    html = html.replace(/\n/g, '<br />');
    html = html.replace(/(<\/li>)<br \/>/g, '$1'); // Hapus br setelah li
    html = html.replace(/(<\/h3>)<br \/>/g, '$1'); // Hapus br setelah h3
    html = html.replace(/(<hr.*?>)<br \/>/g, '$1'); // Hapus br setelah hr

    return (
      <div 
        className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans" 
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 w-full h-full animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Sukses */}
      <div className="bg-camogreen/10 border border-camogreen/30 rounded-sm p-4 mb-6 flex items-center justify-center gap-3">
        <CheckCircle className="text-camogreen w-6 h-6" />
        <h2 className="text-camogreen font-tactical font-bold text-lg tracking-widest uppercase">Laporan Berhasil Disimpan di Sistem Utama</h2>
      </div>

      <div className="glass-panel border-t-4 border-t-cighra-primary dark:border-t-cighra-gold bg-white dark:bg-cighra-darkcard/90 shadow-2xl rounded-sm overflow-hidden border border-slate-200 dark:border-slate-600 relative">
        
        {/* Konten Wizard */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'AI' && (
              <motion.div
                key="ai-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-600 pb-4">
                  <div className="p-3 bg-cighra-primary dark:bg-cighra-gold rounded-sm text-white dark:text-slate-900">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white uppercase tracking-widest">Diagnosis Awal AI</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase">DART Intelligence System</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-cighra-dark/50 border border-slate-200 dark:border-slate-600 rounded-sm p-6 min-h-[200px]">
                  {isLoadingAi ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
                      <div className="w-12 h-12 border-4 border-cighra-primary/20 dark:border-cighra-gold/20 border-t-cighra-primary dark:border-t-cighra-gold rounded-full animate-spin"></div>
                      <p className="text-sm font-mono text-slate-500 dark:text-slate-400 animate-pulse uppercase tracking-widest">Gemini AI sedang menganalisis kendala...</p>
                    </div>
                  ) : errorAi ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-2 py-8 text-targetred">
                      <AlertTriangle size={32} />
                      <p className="text-sm font-bold">{errorAi}</p>
                      <p className="text-xs text-slate-500">Laporan Anda tetap aman di database.</p>
                    </div>
                  ) : (
                    <div>
                      {aiResponse ? renderMarkdown(aiResponse) : <p>Tidak ada respons.</p>}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">Saran ini dihasilkan oleh AI dan bersifat panduan awal.</p>
                  <button 
                    onClick={() => setStep('VIDEO')}
                    disabled={isLoadingAi}
                    className="flex items-center gap-2 bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900 px-6 py-3 font-tactical font-bold tracking-widest uppercase rounded-sm hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-colors disabled:opacity-50"
                  >
                    Lanjut ke Panduan Video <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'VIDEO' && (
              <motion.div
                key="video-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-600 pb-4">
                  <div className="p-3 bg-olive rounded-sm text-white">
                    <PlaySquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white uppercase tracking-widest">Bank Video Panduan</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase">Opsional: Tonton panduan perbaikan dasar</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Placeholder Video 1 */}
                  <div className="border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-cighra-dark/50 rounded-sm overflow-hidden group cursor-pointer hover:border-cighra-primary dark:hover:border-cighra-gold transition-colors">
                    <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
                      <PlaySquare className="w-12 h-12 text-slate-500 group-hover:text-cighra-gold transition-colors" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-tactical font-bold text-slate-800 dark:text-white uppercase">Pengecekan Kabel Utama</h4>
                      <p className="text-xs text-slate-500 mt-1">Durasi: 03:45</p>
                    </div>
                  </div>

                  {/* Placeholder Video 2 */}
                  <div className="border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-cighra-dark/50 rounded-sm overflow-hidden group cursor-pointer hover:border-cighra-primary dark:hover:border-cighra-gold transition-colors">
                    <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
                      <PlaySquare className="w-12 h-12 text-slate-500 group-hover:text-cighra-gold transition-colors" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-tactical font-bold text-slate-800 dark:text-white uppercase">Reset Sistem Motor DART</h4>
                      <p className="text-xs text-slate-500 mt-1">Durasi: 05:20</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-600">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">TUTUP UNTUK MELIHAT STATUS LAPORAN</p>
                  <button 
                    onClick={onClose}
                    className="flex items-center gap-2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-6 py-3 font-tactical font-bold tracking-widest uppercase rounded-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors"
                  >
                    Selesai & Kembali <X size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PostReportWizard;
