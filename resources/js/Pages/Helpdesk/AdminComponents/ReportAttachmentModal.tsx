import React from 'react';
import { Paperclip, Image as ImageIcon, Link as LinkIcon, FileText, X } from 'lucide-react';

interface ReportAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
}

const ReportAttachmentModal: React.FC<ReportAttachmentModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  const { kerusakan } = report;
  const fotoCount = (kerusakan.foto_bukti ? 1 : 0) + (kerusakan.fileBukti?.length || 0);
  const dokumenCount = kerusakan.dokumenAnggaran?.length || 0;
  const hasLink = !!kerusakan.tautan_video;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200 rounded-sm flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
          <h3 className="font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase flex items-center gap-2">
            <Paperclip size={18} className="text-slate-500" /> DETAIL LAMPIRAN
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
          
          {/* Informasi Laporan */}
          <div className="bg-slate-50 dark:bg-slate-800/30 p-4 border border-slate-200 dark:border-slate-700 rounded-sm">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Informasi Laporan</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">KODE KASUS</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-mono">{report.caseId}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">BARANG / UNIT</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{kerusakan.barangRusak}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">KATEGORI</p>
                <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold border rounded-sm uppercase bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600">
                  {kerusakan.jenisPerbaikan || 'SWADAYA'}
                </span>
              </div>
            </div>
          </div>

          {fotoCount === 0 && dokumenCount === 0 && !hasLink && (
            <div className="text-center py-10 text-slate-500 font-mono uppercase text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-sm">
              Tidak ada lampiran pendukung.
            </div>
          )}

          {/* Lampiran Foto */}
          {fotoCount > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={14} /> FOTO KENDALA ({fotoCount})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {kerusakan.foto_bukti && (
                  <a href={kerusakan.foto_bukti} target="_blank" rel="noopener noreferrer" className="block border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden aspect-video relative group">
                    <img src={kerusakan.foto_bukti} alt="Foto Bukti" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
                      <span className="text-white text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 border border-white/50 rounded-sm">Perbesar</span>
                    </div>
                  </a>
                )}
                {kerusakan.fileBukti?.map((foto: string, idx: number) => (
                  <a key={idx} href={foto} target="_blank" rel="noopener noreferrer" className="block border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden aspect-video relative group">
                    <img src={foto} alt={`Foto Bukti ${idx+1}`} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
                      <span className="text-white text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 border border-white/50 rounded-sm">Perbesar</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Lampiran Dokumen */}
          {dokumenCount > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> DOKUMEN PENDUKUNG ({dokumenCount})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {kerusakan.dokumenAnggaran.map((doc: string, idx: number) => {
                  const fileName = doc.split('/').pop() || `Dokumen_${idx+1}.pdf`;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-sm bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-sm shrink-0">
                          <FileText size={16} className="text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-white truncate" title={fileName}>{fileName}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Berkas Terlampir</p>
                        </div>
                      </div>
                      <a href={doc} target="_blank" rel="noopener noreferrer" title="Unduh Dokumen" className="shrink-0 ml-3 p-2 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:text-cighra-primary dark:hover:text-cighra-gold hover:border-cighra-primary dark:hover:border-cighra-gold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tautan Video Drive / Eksternal */}
          {hasLink && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <LinkIcon size={14} /> TAUTAN MEDIA EKSTERNAL
              </h4>
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-sm bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-sm shrink-0">
                    <LinkIcon size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-white mb-1">Tautan Drive / URL</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono truncate cursor-pointer hover:underline" onClick={() => window.open(kerusakan.tautan_video, '_blank')} title={kerusakan.tautan_video}>{kerusakan.tautan_video}</p>
                  </div>
                </div>
                <a href={kerusakan.tautan_video} target="_blank" rel="noopener noreferrer" className="shrink-0 ml-3 px-4 py-2 text-[10px] font-tactical font-bold tracking-widest uppercase bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-sm flex items-center gap-2 shadow-sm">
                  Buka Tautan <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-right shrink-0">
          <button onClick={onClose} className="px-6 py-2 text-[10px] font-tactical font-bold tracking-widest uppercase border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-sm">
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportAttachmentModal;
