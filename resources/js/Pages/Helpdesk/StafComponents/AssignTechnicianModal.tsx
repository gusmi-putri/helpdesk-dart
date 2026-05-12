import React from 'react';
import { Users, ShieldAlert } from 'lucide-react';

interface AssignTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicians: any[];
  onAssign: (technicianId: number) => void;
}

const AssignTechnicianModal: React.FC<AssignTechnicianModalProps> = ({
  isOpen,
  onClose,
  technicians,
  onAssign
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-2xl shadow-2xl animate-in zoom-in-95">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2">
            <Users className="w-5 h-5" /> PILIH PERSONEL TEKNISI
          </h3>
          <button onClick={onClose} className="text-slate-600 hover:text-cighra-primary dark:text-cighra-gold transition-colors font-bold text-xl">✕</button>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 font-mono uppercase">Pilih personel yang akan ditugaskan untuk menangani laporan ini.</p>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {technicians.map((tek: any) => (
              <div key={tek.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-cighra-light dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 hover:border-cighra-primary dark:border-cighra-gold dark:hover:border-cighra-primary dark:border-cighra-gold transition-colors group">
                <div className="flex flex-col mb-3 sm:mb-0 text-gunmetal dark:text-slate-300">
                  <span className="font-bold text-slate-800 dark:text-white text-lg uppercase">{tek.name}</span>
                  <span className="text-xs text-cighra-primary dark:text-cighra-gold font-mono uppercase tracking-widest mt-1">{tek.spesialisasi || 'GENERALIST'} | {tek.username}</span>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-mono bg-sand/40 dark:bg-soft-gunmetal/40 px-2 py-1 text-slate-600 dark:text-slate-300 uppercase">
                      TOTAL DITERIMA: <span className="font-bold">{tek.tasksReceived || 0}</span>
                    </span>
                    <span className="text-[10px] font-mono bg-blue-900/10 px-2 py-1 text-blue-700 dark:text-blue-400 uppercase">
                      SEDANG DIKERJAKAN: <span className="font-bold">{tek.tasksInProgress || 0}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onAssign(tek.id)}
                  className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-6 py-2 text-xs font-tactical font-bold tracking-widest transition-colors flex items-center justify-center gap-2 uppercase"
                >
                  <ShieldAlert className="w-4 h-4" /> TUGASKAN
                </button>
              </div>
            ))}

            {technicians.length === 0 && (
              <div className="p-8 text-center text-slate-500 font-mono uppercase">
                TIDAK ADA DATA TEKNISI TERSEDIA.
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end pt-4 border-t border-slate-200 dark:border-slate-600">
            <button
              onClick={onClose}
              className="bg-gunmetal dark:bg-cighra-darkcard text-white px-8 py-2 font-tactical font-bold tracking-widest hover:bg-slate-600 transition-colors border border-slate-400 dark:border-slate-600 uppercase"
            >
              BATAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTechnicianModal;
