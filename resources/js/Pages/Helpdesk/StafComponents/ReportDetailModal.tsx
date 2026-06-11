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
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2">
            <Activity size={18} /> RINCIAN TIKET: {report.caseId}
          </h3>
          <button onClick={onClose} className="text-slate-600 dark:text-slate-400 hover:text-cighra-primary dark:hover:text-cighra-gold text-xl">✕</button>
        </div>
        <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh] custom-scrollbar text-gunmetal dark:text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bagian Pelaporan */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-300 tracking-[0.2em] border-b border-slate-200 dark:border-slate-600 pb-2 uppercase">DATA PELAPORAN</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">Barang Rusak</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">{report.kerusakan.barangRusak}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">Lokasi Kejadian</p>
                  <p className="text-sm font-bold text-cighra-primary dark:text-cighra-gold uppercase">{report.kerusakan.lokasi}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest font-bold">Prioritas Penanganan</p>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold border mt-1 uppercase ${
                    report.kerusakan.urgensi?.toUpperCase() === 'SANGAT MENDESAK'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 border-red-200 dark:border-red-800'
                      : report.kerusakan.urgensi?.toUpperCase() === 'BISA MENUNGGU'
                      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-800'
                      : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 border-green-200 dark:border-green-800'
                  }`}>
                    {report.kerusakan.urgensi || 'NORMAL'}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest font-bold">Tingkat Kerusakan</p>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold border mt-1 uppercase ${
                    ['PARAH', 'BERAT'].includes(report.kerusakan.tingkatKerusakan?.toUpperCase() || '')
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 border-red-200 dark:border-red-800'
                      : report.kerusakan.tingkatKerusakan?.toUpperCase() === 'SEDANG'
                      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-800'
                      : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 border-green-200 dark:border-green-800'
                  }`}>
                    {report.kerusakan.tingkatKerusakan || 'UMUM'}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">Waktu Lapor</p>
                  <p className="text-sm font-mono text-slate-600 dark:text-slate-300">{report.kerusakan.tanggal}</p>
                </div>
              </div>
            </div>

            {/* Bagian Status & Penanganan */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-300 tracking-[0.2em] border-b border-slate-200 dark:border-slate-600 pb-2 uppercase">STATUS SISTEM</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">Status Perbaikan</p>
                  <span className={`inline-block px-3 py-1 text-[10px] font-tactical font-bold tracking-widest border mt-1
                    ${report.status === 'SELESAI' ? 'bg-camogreen/10 text-camogreen border-camogreen/30' :
                      report.status === 'DITOLAK' ? 'bg-red-600/10 text-red-500 border-red-600/30' :
                      report.status === 'PENDING' ? 'bg-cighra-primary/10 dark:bg-cighra-gold/10 text-cighra-primary dark:text-cighra-gold border-cighra-primary dark:border-cighra-gold/30' :
                        'bg-blue-900/10 text-blue-500 border-blue-800/30'}
                  `}>
                    {report.perbaikan.statusPerbaikan || report.status}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">Teknisi Penanggung Jawab</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Wrench size={14} className="text-cighra-primary dark:text-cighra-gold" /> {report.perbaikan.teknisi ? report.perbaikan.teknisi.toUpperCase() : 'BELUM ADA PENUGASAN'}
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
            <div className="bg-white dark:bg-cighra-darkcard/30 p-4 border border-slate-200 dark:border-slate-600">
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest mb-2">DESKRIPSI KRONOLOGI:</p>
              <p className="text-xs text-slate-600 dark:text-slate-300/80 font-mono leading-relaxed italic">
                "{report.kerusakan.deskripsi}"
              </p>
            </div>

            {report.status === 'DITOLAK' && (
              <div className="bg-red-500/10 p-4 border border-red-500/30 text-slate-800 dark:text-slate-200 animate-in fade-in">
                <p className="text-[9px] text-red-500 font-mono uppercase tracking-widest mb-2 font-bold">ALASAN PENOLAKAN LAPORAN (FEEDBACK STAF):</p>
                <p className="text-xs font-mono leading-relaxed uppercase italic">
                  "{report.perbaikan.alasanPenolakan || 'Tidak ada alasan penolakan yang ditulis.'}"
                </p>
              </div>
            )}

            {report.perbaikan.tindakan && (
              <div className="bg-cighra-primary/5 dark:bg-cighra-gold/5 p-4 border border-cighra-primary dark:border-cighra-gold/30">
                <p className="text-[9px] text-cighra-primary dark:text-cighra-gold font-mono uppercase tracking-widest mb-2">TINDAKAN PERBAIKAN (TEKNISI):</p>
                <p className="text-xs text-gunmetal dark:text-slate-300 font-mono leading-relaxed">
                  {report.perbaikan.tindakan}
                </p>
                {report.perbaikan.metodePerbaikan && (
                  <div className="mt-3 pt-3 border-t border-cighra-primary dark:border-cighra-gold/20">
                    <span className="text-[9px] font-bold text-cighra-primary dark:text-cighra-gold tracking-tighter uppercase">METODE PERBAIKAN: {report.perbaikan.metodePerbaikan}</span>
                  </div>
                )}
              </div>
            )}

            {/* Dokumentasi Penyelesaian */}
            {(report.perbaikan.foto_bukti_selesai || report.perbaikan.video_bukti_selesai) && (
              <div className="bg-slate-100 dark:bg-cighra-darkcard/40 p-4 border border-slate-200 dark:border-slate-700/50 space-y-3 mt-4">
                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest font-bold">DOKUMENTASI HASIL PERBAIKAN:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.perbaikan.foto_bukti_selesai && (
                    <div className="border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden bg-black/40 flex items-center justify-center h-48">
                      <img src={report.perbaikan.foto_bukti_selesai} alt="Foto Selesai" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  {report.perbaikan.video_bukti_selesai && (
                    <div className="border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden bg-black/40 flex items-center justify-center h-48">
                      <video src={report.perbaikan.video_bukti_selesai} controls className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-8 py-2 font-tactical font-bold tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-colors uppercase"
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
