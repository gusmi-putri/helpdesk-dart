import React from 'react';
import { History } from 'lucide-react';
import { Badge } from '@/Components/ui/Badge';
import { Modal } from '@/Components/ui/Modal';
import { Button } from '@/Components/ui/Button';

interface UnitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
  dbCases: any[];
}

const UnitHistoryModal: React.FC<UnitHistoryModalProps> = ({ isOpen, onClose, unit, dbCases }) => {
  if (!isOpen || !unit) return null;

  const unitHistory = dbCases.filter((c: any) => c.unit_id === unit.id || c.unit_id === unit.db_id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`RIWAYAT PERBAIKAN: ${unit.nomor_seri}`}
      icon={<History />}
      maxWidth="2xl"
      footer={
        <div className="w-full flex justify-end">
          <Button variant="secondary" onClick={onClose} className="uppercase" size="md">
            TUTUP
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {unitHistory.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-mono text-sm border border-dashed border-slate-300 dark:border-slate-700">
            BELUM ADA RIWAYAT PERBAIKAN UNTUK UNIT INI.
          </div>
        ) : (
          <div className="space-y-4">
            {unitHistory.map((entry, index) => (
              <div key={index} className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-sm">
                <div className="flex-shrink-0 w-12 h-12 bg-cighra-primary/10 dark:bg-cighra-gold/10 flex items-center justify-center font-tactical text-cighra-primary dark:text-cighra-gold font-bold">
                  #{unitHistory.length - index}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-tactical font-bold text-slate-800 dark:text-white uppercase">
                      {entry.caseId}
                    </span>
                    <Badge variant={
                      entry.status === 'SELESAI' ? 'success' :
                      entry.status === 'DITOLAK' ? 'danger' :
                      entry.status === 'DIPROSES' ? 'info' : 'default'
                    }>
                      {entry.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    {entry.deskripsi_kerusakan}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                    <span>Oleh: {entry.pelapor?.name || 'Unknown'}</span>
                    <span>Tgl: {new Date(entry.tanggal_laporan).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UnitHistoryModal;
