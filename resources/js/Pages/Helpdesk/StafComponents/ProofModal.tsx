import React from 'react';
import { Camera, FileText, Link as LinkIcon, ImageIcon } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewingProof: { report: any; type: 'rusak' | 'selesai' } | null;
}

const ProofModal: React.FC<ProofModalProps> = ({ isOpen, onClose, viewingProof }) => {
  if (!isOpen || !viewingProof) return null;

  const { report, type } = viewingProof;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`LAMPIRAN BUKTI ${type === 'rusak' ? 'KENDALA' : 'HASIL PERBAIKAN'}`}
      icon={<Camera />}
      maxWidth="2xl"
      headerColor="primary"
      footer={
        <div className="w-full flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="uppercase"
          >
            Tutup Lampiran
          </Button>
        </div>
      }
    >
      <div className="p-2 text-gunmetal dark:text-slate-300 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        <div className="space-y-4">
          {type === 'rusak' && (
            <div className="space-y-4">
              {/* Tautan Video */}
              {report.kerusakan.tautan_video && (
                <div className="bg-slate-100 dark:bg-cighra-darkcard/40 p-4 border border-slate-200 dark:border-slate-700/50">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest font-bold mb-2">Tautan Video G-Drive:</p>
                  <a href={report.kerusakan.tautan_video} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-400 underline break-all font-mono inline-block">
                    {report.kerusakan.tautan_video}
                  </a>
                </div>
              )}

              {/* Foto Bukti */}
              {(report.kerusakan.foto_bukti || (report.kerusakan.fileBukti && report.kerusakan.fileBukti.length > 0)) && (
                <div className="bg-slate-100 dark:bg-cighra-darkcard/40 p-4 border border-slate-200 dark:border-slate-700/50 space-y-3">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest font-bold">DOKUMENTASI KENDALA (DARI PELAPOR):</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.kerusakan.foto_bukti && (
                      <div className="border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden bg-black/40 flex items-center justify-center h-48">
                        <img src={report.kerusakan.foto_bukti} alt="Foto Kendala" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    {report.kerusakan.fileBukti?.map((foto: string, index: number) => (
                      <div key={index} className="border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden bg-black/40 flex items-center justify-center h-48">
                        <img src={foto} alt={`Foto Kendala ${index + 1}`} className="max-w-full max-h-full object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {type === 'selesai' && (
            <div className="bg-slate-100 dark:bg-cighra-darkcard/40 p-4 border border-slate-200 dark:border-slate-700/50 space-y-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest font-bold">DOKUMENTASI HASIL PERBAIKAN:</p>
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
      </div>
    </BaseModal>
  );
};

export default ProofModal;

