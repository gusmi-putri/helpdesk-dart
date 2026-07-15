import React from 'react';
import { Wrench, AlertCircle, MapPin, Wallet, FileText } from 'lucide-react';

interface TaskDetailPanelProps {
  selectedTask: any | null;
  activeTab: 'ACTIVE' | 'HISTORY';
  children: React.ReactNode;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ selectedTask, activeTab, children }) => {
  if (!selectedTask) {
    return (
      <div className="flex-1 w-full">
        <div className="h-full min-h-[500px] border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/40 dark:bg-cighra-darkcard/10 flex flex-col items-center justify-center rounded-sm text-center p-8">
          <Wrench className="w-20 h-20 text-slate-600/20 dark:text-slate-300/10 mb-6" />
          <h3 className="text-slate-500 dark:text-slate-300 font-tactical text-2xl tracking-widest mb-2 uppercase">Menunggu Pilihan Tugas</h3>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm max-w-md uppercase tracking-tighter">
            Silakan pilih salah satu laporan kerusakan di sebelah kiri untuk melihat detail instruksi dan mengirimkan laporan perbaikan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
      <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 shadow-2xl rounded-sm relative overflow-hidden flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
        <div className="absolute top-0 left-0 w-1 h-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900"></div>

        {/* SECTION 1: Informasi Tiket */}
        <div className="p-6 bg-cighra-primary dark:bg-cighra-darkcard/80 border-b border-slate-200 dark:border-slate-600 relative flex flex-col justify-center min-h-[125px] md:min-h-[145px] gap-2.5 shrink-0">
          {activeTab === 'HISTORY' && (
            <div className="absolute top-0 right-0 bg-cighra-gold text-slate-900 px-4 py-1 font-tactical font-bold text-xs tracking-widest uppercase">
              ARSIP LAPORAN SELESAI
            </div>
          )}
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-2">
            <h2 className="text-2xl md:text-3xl font-tactical font-bold text-white leading-tight uppercase">
              {selectedTask.kerusakan.barangRusak}
            </h2>
            <div className="bg-white/10 dark:bg-cighra-darkcard/70 px-3 py-1 border border-white/20 dark:border-slate-600 inline-block w-fit">
              <span className="text-[10px] font-mono text-slate-300 dark:text-slate-400 tracking-wider mr-2 uppercase">REF:</span>
              <span className="font-mono text-sm font-bold text-white">{selectedTask.caseId}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] font-mono font-bold mt-1">
            <span className={`flex items-center gap-1.5 px-2 py-0.5 uppercase ${
              selectedTask.kerusakan.urgensi?.toUpperCase() === 'SANGAT MENDESAK'
                ? 'bg-red-500/20 text-red-200 border border-red-500/40'
                : selectedTask.kerusakan.urgensi?.toUpperCase() === 'BISA MENUNGGU'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                : 'bg-green-500/20 text-green-200 border border-green-500/40'
            }`}><AlertCircle className="w-3.5 h-3.5" /> PRIORITAS: {selectedTask.kerusakan.urgensi?.toUpperCase() || 'NORMAL'}</span>
            
            <span className={`flex items-center gap-1.5 px-2 py-0.5 uppercase ${
              ['PARAH', 'BERAT'].includes(selectedTask.kerusakan.tingkatKerusakan?.toUpperCase() || '')
                ? 'bg-red-500/20 text-red-200 border border-red-500/40'
                : selectedTask.kerusakan.tingkatKerusakan?.toUpperCase() === 'SEDANG'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                : 'bg-green-500/20 text-green-200 border border-green-500/40'
            }`}><Wrench className="w-3.5 h-3.5" /> LEVEL: {selectedTask.kerusakan.tingkatKerusakan?.toUpperCase() || 'UMUM'}</span>
            
            <span className={`flex items-center gap-1.5 px-2 py-0.5 uppercase ${
              selectedTask.kerusakan.jenisPerbaikan === 'Non-Swadaya'
                ? 'bg-blue-500/20 text-blue-200 border border-blue-500/40'
                : 'bg-slate-700/50 text-slate-200 border border-slate-600/40'
            }`}><Wallet className="w-3.5 h-3.5" /> {selectedTask.kerusakan.jenisPerbaikan || 'Swadaya'}</span>
            
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-800/40 text-slate-200 border border-slate-700/30 uppercase"><MapPin className="w-3.5 h-3.5 text-cighra-gold" /> LOKASI: {selectedTask.kerusakan.lokasi}</span>
            
            <span className="flex items-center gap-2 px-2 py-0.5 bg-slate-800/40 text-slate-200 border border-slate-700/30 uppercase">
              PELAPOR: {selectedTask.kerusakan.pelapor}
              {selectedTask.kerusakan.pelapor_wa && (
                <a
                  href={`https://wa.me/${selectedTask.kerusakan.pelapor_wa}?text=${encodeURIComponent(`Halo, saya teknisi ${selectedTask.perbaikan.teknisi || ''} yang menangani laporan Anda (${selectedTask.caseId}). Ingin menanyakan perihal detail kendala.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-600 hover:bg-green-500 text-white font-mono text-[9px] font-bold rounded-sm uppercase tracking-tighter transition-all"
                  title="Hubungi Pelapor via WhatsApp"
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WA
                </a>
              )}
            </span>
          </div>
        </div>

        {/*SCROLLABLE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/*Deskripsi Kerusakan*/}
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-600 space-y-6">
            <div className="space-y-2">
              <h3 className="text-slate-800 dark:text-white font-tactical font-bold text-lg tracking-widest uppercase">
                DESKRIPSI KERUSAKAN / KENDALA
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-5 border border-slate-200 dark:border-slate-700/80 rounded-sm relative shadow-sm">
                <p className="text-sm text-gunmetal dark:text-slate-200 font-sans leading-relaxed italic border-l-2 border-cighra-primary dark:border-cighra-gold/50 pl-4">
                  {selectedTask.kerusakan.deskripsi}
                </p>
              </div>
            </div>

            {/*Dukungan Anggaran (If Non-Swadaya) */}
            {selectedTask.kerusakan.jenisPerbaikan === 'Non-Swadaya' && (
              <div className="space-y-2 pt-2">
                <h4 className="text-slate-800 dark:text-white font-tactical font-bold text-xs tracking-wider uppercase">
                  DUKUNGAN ANGGARAN
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 border border-blue-200 dark:border-blue-800/40 rounded-sm relative shadow-sm">
                  <p className="text-sm text-gunmetal dark:text-slate-200 font-sans leading-relaxed italic border-l-2 border-blue-500 pl-4">
                    {selectedTask.kerusakan.keteranganAnggaran || 'Tidak ada keterangan anggaran.'}
                  </p>
                  {selectedTask.kerusakan.dokumenAnggaran?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedTask.kerusakan.dokumenAnggaran.map((doc: string, index: number) => (
                        <a
                          key={doc}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold tracking-widest rounded-sm transition-colors uppercase border border-blue-700 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" /> Dokumen {index + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/*Preview Foto Dokumentasi Kerusakan*/}
            <div className="space-y-3 pt-2">
              <h4 className="text-slate-800 dark:text-white font-tactical font-bold text-xs tracking-wider uppercase">
                DOKUMENTASI FOTO KERUSAKAN
              </h4>
              {selectedTask.kerusakan.fileBukti && selectedTask.kerusakan.fileBukti.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedTask.kerusakan.fileBukti.map((file: string, i: number) => (
                    <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-sm overflow-hidden bg-black flex items-center justify-center group relative h-28 shadow-sm">
                      <img src={file} alt={`Bukti ${i}`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border border-dashed border-slate-300 dark:border-slate-600 text-center font-mono text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/10">
                  BELUM ADA DOKUMENTASI
                </div>
              )}
            </div>

            {/*Tautan Video G-Drive Pelapor*/}
            {selectedTask.kerusakan.tautan_video && (
              <div className="space-y-2 pt-2">
                <h4 className="text-slate-800 dark:text-white font-tactical font-bold text-xs tracking-wider uppercase">
                  TAUTAN VIDEO G-DRIVE PELAPOR
                </h4>
                <a
                  href={selectedTask.kerusakan.tautan_video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold tracking-widest rounded-sm transition-colors uppercase border border-blue-700 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" /> Buka Video G-Drive Pelapor
                </a>
              </div>
            )}
          </div>

          {/*Form Penyelesaian*/}
          <div className="p-6 md:p-8 bg-white/40 dark:bg-transparent">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPanel;

