import React from 'react';
import { Users, ShieldAlert } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="PILIH PERSONEL TEKNISI"
      icon={<Users />}
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
            BATAL
          </Button>
        </div>
      }
    >
      <div className="p-2">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 font-mono uppercase">Pilih personel yang akan ditugaskan untuk menangani laporan ini.</p>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {technicians.map((tek: any) => (
            <div key={tek.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-cighra-light dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 hover:border-cighra-primary dark:hover:border-cighra-gold transition-colors group">
              <div className="flex flex-col mb-3 sm:mb-0 text-gunmetal dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-white text-lg uppercase">{tek.name}</span>
                <span className="text-xs text-cighra-primary dark:text-cighra-gold font-mono uppercase tracking-widest mt-1">{tek.spesialisasi || 'GENERALIST'} | {tek.username}</span>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-mono bg-sand/40 dark:bg-soft-gunmetal/40 px-2 py-1 text-slate-600 dark:text-slate-300 uppercase">
                    TOTAL DITERIMA: <span className="font-bold">{tek.tasksReceived || 0}</span>
                  </span>
                  <span className="text-xs font-mono bg-blue-900/10 px-2 py-1 text-blue-700 dark:text-blue-400 uppercase">
                    SEDANG DIKERJAKAN: <span className="font-bold">{tek.tasksInProgress || 0}</span>
                  </span>
                </div>
              </div>
              <Button
                onClick={() => onAssign(tek.db_id)}
                icon={<ShieldAlert className="w-4 h-4" />}
                className="uppercase"
              >
                TUGASKAN
              </Button>
            </div>
          ))}

          {technicians.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-mono uppercase">
              TIDAK ADA DATA TEKNISI TERSEDIA.
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default AssignTechnicianModal;

