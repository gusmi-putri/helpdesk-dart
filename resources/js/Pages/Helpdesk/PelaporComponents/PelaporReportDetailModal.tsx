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
      <div className="bg-sand dark:bg-gunmetal border-2 border-olive w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-olive bg-olive/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-olive tracking-widest uppercase flex items-center gap-2">
            <Activity size={18} /> RINCIAN TIKET: {report.caseId}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-targetred text-xl">✕</button>
        </div>
        <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh] custom-scrollbar text-gunmetal dark:text-soft-sand">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bagian Pelaporan */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-gray-500 tracking-[0.2em] border-b border-gray-300 dark:border-gray-800 pb-2 uppercase">DATA PELAPORAN</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Barang Rusak</p>
                  <p className="text-sm font-bold text-gunmetal dark:text-white uppercase">{report.kerusakan.barangRusak}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Lokasi Kejadian</p>
                  <p className="text-sm font-bold text-olive uppercase">{report.kerusakan.lokasi}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Waktu Selesai</p>
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{report.perbaikan.tanggalSelesai || '-'}</p>
                </div>
              </div>
            </div>

            {/* Bagian Status & Penanganan */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-gray-500 tracking-[0.2em] border-b border-gray-300 dark:border-gray-800 pb-2 uppercase">STATUS SISTEM</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Status Perbaikan</p>
                  <span className={`inline-block px-3 py-1 text-[10px] font-tactical font-bold tracking-widest border mt-1
                    ${report.status === 'SELESAI' ? 'bg-green-900/20 text-green-500 border-green-800' :
                      report.status === 'PROSES' ? 'bg-blue-900/20 text-blue-500 border-blue-800' :
                        'bg-yellow-900/20 text-yellow-500 border-yellow-800'}
                  `}>
                    {report.perbaikan.statusPerbaikan || report.status}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Teknisi Penanggung Jawab</p>
                  <p className="text-sm font-bold text-gunmetal dark:text-white flex items-center gap-2">
                    <Wrench size={14} className="text-olive" /> {report.perbaikan.teknisi ? report.perbaikan.teknisi.toUpperCase() : 'MENUNGGU KONFIRMASI'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Deskripsi & Catatan */}
          <div className="space-y-4">
            <div className="bg-sand/30 dark:bg-black/30 p-4 border border-gray-300 dark:border-gray-800">
              <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mb-2">DESKRIPSI KRONOLOGI:</p>
              <p className="text-xs text-gray-700 dark:text-gray-400 font-mono leading-relaxed italic">
                "{report.kerusakan.deskripsi}"
              </p>
            </div>

            {report.perbaikan.tindakan && (
              <div className="bg-olive/5 p-4 border border-olive/30">
                <p className="text-[9px] text-olive font-mono uppercase tracking-widest mb-2">TINDAKAN PERBAIKAN (TEKNISI):</p>
                <p className="text-xs text-gunmetal dark:text-gray-200 font-mono leading-relaxed">
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
        </div>
        <div className="p-4 bg-gray-100 dark:bg-black/40 border-t border-olive/20 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-olive text-white font-tactical font-bold text-xs tracking-widest hover:bg-camogreen transition-colors uppercase"
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
};

export default PelaporReportDetailModal;
