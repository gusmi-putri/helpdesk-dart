import React from 'react';
import { Activity, Wrench } from 'lucide-react';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any | null;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-slate-50 dark:bg-gunmetal border-2 border-olive w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-olive bg-olive/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-olive tracking-widest uppercase flex items-center gap-2">
            <Activity size={18} /> RINCIAN TIKET: {report.caseId}
          </h3>
          <button onClick={onClose} className="text-slate-600 hover:text-targetred text-xl">✕</button>
        </div>
        <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh] custom-scrollbar text-gunmetal dark:text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bagian Pelaporan */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-300 tracking-[0.2em] border-b border-slate-200 dark:border-slate-700 pb-2 uppercase">DATA PELAPORAN</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">Barang Rusak</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">{report.kerusakan.barangRusak}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">Lokasi Kejadian</p>
                  <p className="text-sm font-bold text-olive uppercase">{report.kerusakan.lokasi}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">Waktu Lapor</p>
                  <p className="text-sm font-mono text-slate-600 dark:text-slate-300">{report.kerusakan.tanggal}</p>
                </div>
              </div>
            </div>

            {/* Bagian Status & Penanganan */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-300 tracking-[0.2em] border-b border-slate-200 dark:border-slate-700 pb-2 uppercase">STATUS SISTEM</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">Status Perbaikan</p>
                  <span className={`inline-block px-3 py-1 text-[10px] font-tactical font-bold tracking-widest border mt-1
                    ${report.status === 'SELESAI' ? 'bg-camogreen/10 text-camogreen border-camogreen/30' :
                      report.status === 'PROSES' ? 'bg-blue-900/10 text-blue-500 border-blue-800/30' :
                        'bg-targetred/10 text-targetred border-targetred/30'}
                  `}>
                    {report.perbaikan.statusPerbaikan || report.status}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">Teknisi Penanggung Jawab</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Wrench size={14} className="text-olive" /> {report.perbaikan.teknisi ? report.perbaikan.teknisi.toUpperCase() : 'BELUM ADA PENUGASAN'}
                  </p>
                  {report.status === 'SELESAI' && report.perbaikan.tanggalSelesai && (
                    <p className="text-[10px] text-camogreen font-mono mt-1 uppercase tracking-tighter">
                      Tuntas: {report.perbaikan.tanggalSelesai}
                    </p>
                  )}
                  {report.status === 'PROSES' && report.perbaikan.tanggalPenanganan && (
                    <p className="text-[10px] text-blue-500 font-mono mt-1 uppercase tracking-tighter">
                      Ditangani: {report.perbaikan.tanggalPenanganan}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Deskripsi & Catatan */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-navy/30 p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest mb-2">DESKRIPSI KRONOLOGI:</p>
              <p className="text-xs text-slate-600 dark:text-slate-300/80 font-mono leading-relaxed italic">
                "{report.kerusakan.deskripsi}"
              </p>
            </div>

            {report.perbaikan.tindakan && (
              <div className="bg-olive/5 p-4 border border-olive/30">
                <p className="text-[9px] text-olive font-mono uppercase tracking-widest mb-2">TINDAKAN PERBAIKAN (TEKNISI):</p>
                <p className="text-xs text-gunmetal dark:text-slate-300 font-mono leading-relaxed">
                  {report.perbaikan.tindakan}
                </p>
                {report.perbaikan.metodePerbaikan && (
                  <div className="mt-3 pt-3 border-t border-olive/20">
                    <span className="text-[9px] font-bold text-olive tracking-tighter uppercase">METODE PERBAIKAN: {report.perbaikan.metodePerbaikan}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-olive text-sand px-8 py-2 font-tactical font-bold tracking-widest hover:bg-camogreen transition-colors uppercase"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
