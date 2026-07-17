import React, { useState } from 'react';
import { Package, Upload, X, FileText, Download } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface StafUnitBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  processing: boolean;
}

const StafUnitBatchModal: React.FC<StafUnitBatchModalProps> = ({ isOpen, onClose, onSubmit, processing }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile || !document) return;

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('document', document);
    formData.append('reason', reason || 'Pengajuan penambahan unit massal.');
    
    onSubmit(formData);
  };

  const handleClose = () => {
    setCsvFile(null);
    setDocument(null);
    setReason('');
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = [
      "nomor_seri,jenis,asal_satuan,status_unit",
      "PU - 42 - 098 - 2026,DART Portabel - Pop,MAKOSTRAD,Beroperasi",
      "FL - 42 - 098 - 2026,DART Portabel - Flip,MAKO KOPASSUS,Rusak",
      "SW - 42 - 098 - 2026,DART Portabel - Swing,DIVIF 1 KOSTRAD,Perbaikan",
      "MV - 42 - 098 - 2026,Moving Target,AKMIL,Nonaktif",
      "# -------------------------------------------------------------",
      "# PANDUAN PENGISIAN TEMPLATE CSV:",
      "# -------------------------------------------------------------",
      "# 1. Kolom 'nomor_seri': Masukkan nomor seri unik unit (Contoh: PU - 42 - 098 - 2026, FL - 42 - 098 - 2026, dll).",
      "# 2. Kolom 'jenis': Harus bernilai salah satu dari pilihan berikut:",
      "#    - DART STD",
      "#    - DART STK",
      "#    - DART Portabel - Swing",
      "#    - DART Portabel - Pop",
      "#    - DART Portabel - Flip",
      "#    - DART Marathon Target",
      "#    - Moving Target",
      "# 3. Kolom 'asal_satuan': Kosongkan jika belum ditentukan. Jika diisi, harus sesuai nama Satuan yang SUDAH TERDAFTAR (Contoh: MAKOSTRAD).",
      "# 4. Kolom 'status_unit': Harus bernilai salah satu dari pilihan berikut:",
      "#    - Beroperasi",
      "#    - Rusak",
      "#    - Perbaikan",
      "#    - Nonaktif",
      "# 5. Catatan: Baris panduan yang diawali dengan tanda '#' ini otomatis diabaikan oleh sistem."
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = window.document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_tambah_massal.csv');
    link.style.visibility = 'hidden';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="IMPORT TAMBAH MASSAL (CSV)"
      icon={<Package />}
      maxWidth="lg"
      headerColor="primary"
      footer={
        <div className="w-full flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            BATAL
          </Button>
          <Button
            type="submit"
            form="stafBatchForm"
            disabled={processing || !csvFile || !document}
            className="flex-1"
          >
            {processing ? 'MENGIRIM...' : 'AJUKAN PENAMBAHAN'}
          </Button>
        </div>
      }
    >
      <div className="overflow-y-auto custom-scrollbar p-2 space-y-4 flex-1 min-h-0">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 p-3 rounded-sm space-y-2">
          <div className="text-xs font-mono text-blue-700 dark:text-blue-400 uppercase leading-snug space-y-1">
            <p className="font-bold">ℹ CARA PENGGUNAAN:</p>
            <p>1. Unduh template CSV.</p>
            <p>2. Kolom <span className="font-bold">jenis</span> harus bernilai: DART STD, DART STK, DART Portabel - Swing/Pop/Flip, DART Marathon Target, atau Moving Target.</p>
            <p>3. Kolom <span className="font-bold">status_unit</span> harus bernilai: Beroperasi, Rusak, Perbaikan, atau Nonaktif.</p>
            <p>4. Kolom <span className="font-bold">asal_satuan</span> harus berupa nama Satuan yang SUDAH TERDAFTAR di sistem (contoh: MAKOSTRAD, AKMIL). Satuan yang tidak terdaftar akan dilewati.</p>
            <p>5. Unggah CSV beserta 1 file Dokumen Surat Pendukung yang menaungi seluruh data tersebut.</p>
          </div>
          <button type="button" onClick={downloadTemplate} className="flex items-center gap-1.5 text-xs font-mono font-bold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors cursor-pointer w-full justify-center">
            <Download size={12} /> UNDUH TEMPLATE CSV
          </button>
        </div>

        <form id="stafBatchForm" onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">File CSV Data Unit *</label>
            <div className="relative">
              {csvFile ? (
                <div className="flex items-center gap-2 bg-cighra-primary/10 dark:bg-cighra-gold/10 border border-cighra-primary/30 dark:border-cighra-gold/30 px-3 py-2 rounded-sm">
                  <FileText className="w-4 h-4 text-cighra-primary dark:text-cighra-gold" />
                  <span className="text-xs font-mono text-cighra-primary dark:text-cighra-gold flex-1 min-h-0 truncate">{csvFile.name}</span>
                  <button type="button" onClick={() => setCsvFile(null)} className="text-red-500 hover:text-red-700">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-cighra-darkcard border-2 border-dashed border-slate-300 dark:border-slate-600 p-6 cursor-pointer hover:border-cighra-primary dark:hover:border-cighra-gold transition-colors rounded-sm">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-mono text-slate-500">Pilih / Seret file .csv ke sini</span>
                  <input type="file" accept=".csv" className="hidden" required onChange={(e) => e.target.files?.[0] && setCsvFile(e.target.files[0])} />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Surat Pendukung (PDF/JPG/PNG) *</label>
            <div className="relative">
              {document ? (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 px-3 py-2 rounded-sm">
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-mono text-green-700 dark:text-green-400 flex-1 min-h-0 truncate">{document.name}</span>
                  <button type="button" onClick={() => setDocument(null)} className="text-red-500 hover:text-red-700">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 bg-slate-50 dark:bg-cighra-darkcard border border-dashed border-slate-300 dark:border-slate-600 px-3 py-3 cursor-pointer hover:border-cighra-primary dark:hover:border-cighra-gold transition-colors rounded-sm">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono text-slate-500">Pilih file surat pendukung...</span>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" required className="hidden" onChange={(e) => e.target.files?.[0] && setDocument(e.target.files[0])} />
                </label>
              )}
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-1 uppercase">Satu surat ini akan melampirkan seluruh baris di CSV tujuan.</p>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Alasan / Catatan</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2}
              className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none text-slate-800 dark:text-white resize-none" placeholder="Alasan penambahan unit batch..." />
          </div>

        </form>
      </div>
    </BaseModal>
  );
};

export default StafUnitBatchModal;

