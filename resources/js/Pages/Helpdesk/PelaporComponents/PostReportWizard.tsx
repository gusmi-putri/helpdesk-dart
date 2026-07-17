import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bot, CheckCircle, X, AlertTriangle } from 'lucide-react';
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
  const step = 'AI';
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(true);
  const [errorAi, setErrorAi] = useState<string | null>(null);

  useEffect(() => {
    // Panggil API Diagnosis Lokal secara asinkronus
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

  const escapeHtml = (input: string) => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const formatInlineText = (text: string, key: number) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(Boolean);

    return (
      <span key={key}>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={index} className="text-slate-900 dark:text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }

          if (part.startsWith('*') && part.endsWith('*')) {
            return (
              <em key={index} className="not-italic text-slate-900 dark:text-white">
                {part.slice(1, -1)}
              </em>
            );
          }

          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  const renderMarkdown = (text: string) => {
    const sanitizedText = escapeHtml(text).replace(/\r\n/g, '\n');
    const lines = sanitizedText.split('\n');
    const elements: React.ReactNode[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let listItems: React.ReactNode[] = [];

    const flushList = (index: number) => {
      if (!listType) return;
      if (listType === 'ul') {
        elements.push(
          <ul key={`list-${index}`} className="mt-4 ml-5 list-disc marker:text-cighra-primary dark:marker:text-cighra-gold space-y-1">
            {listItems}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${index}`} className="mt-4 ml-5 list-decimal marker:font-bold marker:text-slate-500 space-y-1">
            {listItems}
          </ol>
        );
      }
      listType = null;
      listItems = [];
    };

    lines.forEach((line, lineIndex) => {
      if (line.startsWith('### ')) {
        flushList(lineIndex);
        elements.push(
          <h3
            key={`h3-${lineIndex}`}
            className="font-tactical font-bold text-lg text-cighra-primary dark:text-cighra-gold mt-6 mb-2 uppercase tracking-wider"
          >
            {formatInlineText(line.slice(4), lineIndex)}
          </h3>
        );
        return;
      }

      if (line === '---') {
        flushList(lineIndex);
        elements.push(<hr key={`hr-${lineIndex}`} className="my-5 border-slate-200 dark:border-slate-700" />);
        return;
      }

      const bulletMatch = line.match(/^\* (.*)$/);
      const numberedMatch = line.match(/^\d+\. (.*)$/);

      if (bulletMatch) {
        if (listType !== 'ul') {
          flushList(lineIndex);
          listType = 'ul';
        }
        listItems.push(
          <li key={`li-${lineIndex}`} className="ml-5 list-disc marker:text-cighra-primary dark:marker:text-cighra-gold mb-1">
            {formatInlineText(bulletMatch[1], lineIndex)}
          </li>
        );
        return;
      }

      if (numberedMatch) {
        if (listType !== 'ol') {
          flushList(lineIndex);
          listType = 'ol';
        }
        listItems.push(
          <li key={`li-${lineIndex}`} className="ml-5 list-decimal marker:font-bold marker:text-slate-500 mb-1">
            {formatInlineText(numberedMatch[1], lineIndex)}
          </li>
        );
        return;
      }

      flushList(lineIndex);

      if (line.trim().length === 0) {
        return;
      }

      elements.push(
        <p key={`p-${lineIndex}`} className="mb-3 leading-relaxed">
          {formatInlineText(line, lineIndex)}
        </p>
      );
    });

    flushList(lines.length);

    return <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{elements}</div>;
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
                    <h3 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white uppercase tracking-widest">Diagnosis Awal</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase">DART Intelligence System</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-cighra-dark/50 border border-slate-200 dark:border-slate-600 rounded-sm p-6 min-h-[200px]">
                  {isLoadingAi ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
                      <div className="w-12 h-12 border-4 border-cighra-primary/20 dark:border-cighra-gold/20 border-t-cighra-primary dark:border-t-cighra-gold rounded-full animate-spin"></div>
                      <p className="text-sm font-mono text-slate-500 dark:text-slate-400 animate-pulse uppercase tracking-widest">Sistem sedang menganalisis kendala...</p>
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

                <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-200 dark:border-slate-600">
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">Saran ini dihasilkan oleh sistem dan bersifat panduan awal.</p>
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

