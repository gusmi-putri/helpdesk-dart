import React from 'react';
import { Activity, Wrench } from 'lucide-react';

interface PelaporReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any | null;
}

const PelaporReportDetailModal: React.FC<PelaporReportDetailModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2">
            <Activity size={18} /> RINCIAN TIKET: {report.caseId}
          </h3>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-cighra-primary dark:hover:text-cighra-gold text-xl">✕</button>
        </div>
        <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh] custom-scrollbar text-gunmetal dark:text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bagian Pelaporan */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 tracking-[0.2em] border-b border-slate-200 dark:border-slate-600/50 pb-2 uppercase">DATA PELAPORAN</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Barang Rusak</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">{report.kerusakan.barangRusak}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Lokasi Kejadian</p>
                  <p className="text-sm font-bold text-cighra-primary dark:text-cighra-gold uppercase">{report.kerusakan.lokasi}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Waktu Selesai</p>
                  <p className="text-sm font-mono text-slate-600 dark:text-slate-300">{report.perbaikan.tanggalSelesai || '-'}</p>
                </div>
              </div>
            </div>

            {/* Bagian Status & Penanganan */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 tracking-[0.2em] border-b border-slate-200 dark:border-slate-600/50 pb-2 uppercase">STATUS SISTEM</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Status Perbaikan</p>
                  <span className={`inline-block px-3 py-1 text-[10px] font-tactical font-bold tracking-widest border mt-1
                    ${report.status === 'SELESAI' ? 'bg-green-900/20 text-green-500 border-green-800' :
                      report.status === 'PROSES' ? 'bg-blue-900/20 text-blue-500 border-blue-800' :
                        'bg-yellow-900/20 text-yellow-500 border-yellow-800'}
                  `}>
                    {report.perbaikan.statusPerbaikan || report.status}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Teknisi Penanggung Jawab</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Wrench size={14} className="text-cighra-primary dark:text-cighra-gold" /> {report.perbaikan.teknisi ? report.perbaikan.teknisi.toUpperCase() : 'MENUNGGU KONFIRMASI'}
                  </p>
                  {report.perbaikan.teknisi && report.perbaikan.teknisi_wa && (
                    <a
                      href={`https://wa.me/${report.perbaikan.teknisi_wa}?text=${encodeURIComponent(`Halo, saya pelapor tiket ${report.caseId}. Mohon info progress perbaikan. Terima kasih.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-[10px] font-mono font-bold tracking-widest rounded-sm transition-all shadow-md hover:shadow-lg group"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      HUBUNGI VIA WHATSAPP
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Deskripsi & Catatan */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-cighra-darkcard/30 p-4 border border-slate-200 dark:border-slate-600/50">
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-2">DESKRIPSI KRONOLOGI:</p>
              <p className="text-xs text-gray-700 dark:text-slate-400 font-mono leading-relaxed italic">
                "{report.kerusakan.deskripsi}"
              </p>
            </div>

            {report.perbaikan.tindakan && (
              <div className="bg-cighra-primary/5 dark:bg-cighra-gold/5 p-4 border border-cighra-primary dark:border-cighra-gold/30">
                <p className="text-[9px] text-cighra-primary dark:text-cighra-gold font-mono uppercase tracking-widest mb-2">TINDAKAN PERBAIKAN (TEKNISI):</p>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed">
                  {report.perbaikan.tindakan}
                </p>
                {report.perbaikan.metodePerbaikan && (
                  <div className="mt-3 pt-3 border-t border-cighra-primary dark:border-cighra-gold/20">
                    <span className="text-[9px] font-bold text-cighra-primary dark:text-cighra-gold tracking-tighter uppercase">METODE PERBAIKAN: {report.perbaikan.metodePerbaikan}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-cighra-darkcard/80 border-t border-cighra-primary dark:border-cighra-gold/20 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white font-tactical font-bold text-xs tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-colors uppercase"
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
};

export default PelaporReportDetailModal;
