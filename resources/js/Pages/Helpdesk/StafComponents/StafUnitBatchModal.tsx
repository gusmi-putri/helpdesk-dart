import React, { useState } from 'react';
import { Package, Upload, X, FileText, Download } from 'lucide-react';

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
    const csvContent = "nomor_seri,jenis,asal_satuan,status_unit\nCONTOH-001,DART STD,NAMA SATUAN,Beroperasi";
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
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center shrink-0">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2">
            <Package size={18} /> IMPORT TAMBAH MASSAL (CSV)
          </h3>
          <button onClick={handleClose} className="text-slate-500 hover:text-cighra-primary dark:hover:text-cighra-gold text-xl">✕</button>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-6 space-y-4 flex-1">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 p-3 rounded-sm space-y-2">
            <p className="text-[10px] font-mono text-blue-700 dark:text-blue-400 uppercase leading-snug">
              ℹ CARA PENGGUNAAN: 
              1. Unduh template CSV.
              2. Isi data unit tanpa mengubah judul kolom (Header baris pertama).
              3. Unggah CSV beserta 1 file Dokumen Surat Pendukung yang menaungi seluruh data tersebut.
            </p>
            <button type="button" onClick={downloadTemplate} className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors cursor-pointer w-full justify-center">
              <Download size={12} /> UNDUH TEMPLATE CSV
            </button>
          </div>

          <form id="stafBatchForm" onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">File CSV Data Unit *</label>
              <div className="relative">
                {csvFile ? (
                  <div className="flex items-center gap-2 bg-cighra-primary/10 dark:bg-cighra-gold/10 border border-cighra-primary/30 dark:border-cighra-gold/30 px-3 py-2 rounded-sm">
                    <FileText className="w-4 h-4 text-cighra-primary dark:text-cighra-gold" />
                    <span className="text-xs font-mono text-cighra-primary dark:text-cighra-gold flex-1 truncate">{csvFile.name}</span>
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
              <label className="block text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Surat Pendukung (PDF/JPG/PNG) *</label>
              <div className="relative">
                {document ? (
                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 px-3 py-2 rounded-sm">
                    <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-mono text-green-700 dark:text-green-400 flex-1 truncate">{document.name}</span>
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
              <p className="text-[9px] font-mono text-slate-500 mt-1 uppercase">Satu surat ini akan melampirkan seluruh baris di CSV tujuan.</p>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Alasan / Catatan</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2}
                className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none text-slate-800 dark:text-white resize-none" placeholder="Alasan penambahan unit batch..." />
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-cighra-dark/50 shrink-0">
          <div className="flex gap-3">
            <button type="button" onClick={handleClose}
              className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-tactical text-xs tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              BATAL
            </button>
            <button type="submit" form="stafBatchForm" disabled={processing || !csvFile || !document}
              className="flex-1 py-2.5 bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900 font-tactical font-bold text-xs tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-all disabled:opacity-50">
              {processing ? 'MENGIRIM...' : 'AJUKAN PENAMBAHAN'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StafUnitBatchModal;
