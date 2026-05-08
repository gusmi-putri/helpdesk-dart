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
      <div className="bg-white dark:bg-gunmetal border-2 border-olive w-full max-w-2xl shadow-2xl animate-in zoom-in-95">
        <div className="p-4 border-b border-olive bg-olive/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-olive tracking-widest uppercase flex items-center gap-2">
            <Users className="w-5 h-5" /> PILIH PERSONEL TEKNISI
          </h3>
          <button onClick={onClose} className="text-soft-gunmetal hover:text-targetred transition-colors font-bold text-xl">✕</button>
        </div>
        <div className="p-6">
          <p className="text-sm text-soft-gunmetal dark:text-soft-sand/60 mb-4 font-mono uppercase">Pilih personel yang akan ditugaskan untuk menangani laporan ini.</p>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {technicians.map((tek: any) => (
              <div key={tek.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-sand/20 dark:bg-black/40 border border-soft-gunmetal/10 dark:border-soft-sand/5 hover:border-olive dark:hover:border-olive transition-colors group">
                <div className="flex flex-col mb-3 sm:mb-0 text-gunmetal dark:text-soft-sand">
                  <span className="font-bold text-gunmetal dark:text-white text-lg uppercase">{tek.name}</span>
                  <span className="text-xs text-olive font-mono uppercase tracking-widest mt-1">{tek.spesialisasi || 'GENERALIST'} | {tek.username}</span>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-mono bg-sand/40 dark:bg-soft-gunmetal/40 px-2 py-1 text-soft-gunmetal dark:text-soft-sand uppercase">
                      TOTAL DITERIMA: <span className="font-bold">{tek.tasksReceived || 0}</span>
                    </span>
                    <span className="text-[10px] font-mono bg-blue-900/10 px-2 py-1 text-blue-700 dark:text-blue-400 uppercase">
                      SEDANG DIKERJAKAN: <span className="font-bold">{tek.tasksInProgress || 0}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onAssign(tek.id)}
                  className="bg-olive hover:bg-camogreen text-sand px-6 py-2 text-xs font-tactical font-bold tracking-widest transition-colors flex items-center justify-center gap-2 uppercase"
                >
                  <ShieldAlert className="w-4 h-4" /> TUGASKAN
                </button>
              </div>
            ))}

            {technicians.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-mono uppercase">
                TIDAK ADA DATA TEKNISI TERSEDIA.
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end pt-4 border-t border-soft-gunmetal/10 dark:border-soft-sand/5">
            <button
              onClick={onClose}
              className="bg-gunmetal dark:bg-black text-sand px-8 py-2 font-tactical font-bold tracking-widest hover:bg-soft-gunmetal transition-colors border border-soft-gunmetal/30 uppercase"
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
