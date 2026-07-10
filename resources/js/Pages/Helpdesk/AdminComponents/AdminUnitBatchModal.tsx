import React, { useState } from 'react';
import { Package, Upload, X, FileText, Download } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface AdminUnitBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  processing: boolean;
}

const AdminUnitBatchModal: React.FC<AdminUnitBatchModalProps> = ({ isOpen, onClose, onSubmit, processing }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile || !document) return;

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('document', document);
    
    onSubmit(formData);
  };

  const handleClose = () => {
    setCsvFile(null);
    setDocument(null);
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
      "# 3. Kolom 'asal_satuan': Harus sesuai nama Satuan yang SUDAH TERDAFTAR di database (Contoh: MAKOSTRAD, AKMIL).",
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
    link.setAttribute('download', 'template_unit_dart.csv');
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
      maxWidth="2xl"
      headerColor="primary"
      footer={
        <div className="w-full flex gap-4">
          <Button
            type="submit"
            form="adminBatchForm"
            disabled={processing || !csvFile || !document}
            className="flex-[2] uppercase"
            size="lg"
          >
            {processing ? 'SEDANG MENGUNGGAH...' : 'PROSES TAMBAH MASSAL'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1 uppercase"
            size="lg"
          >
            BATAL
          </Button>
        </div>
      }
    >
      <div className="overflow-y-auto custom-scrollbar p-2 space-y-8 flex-1 min-h-0">
        <div className="bg-blue-500/5 dark:bg-blue-900/10 border-l-4 border-blue-500 p-6 space-y-2">
          <div className="text-xs font-mono text-blue-700 dark:text-blue-400 uppercase tracking-widest leading-relaxed space-y-1">
            <span className="font-bold block mb-1">PROSEDUR OPERASIONAL:</span> 
            <p>1. UNDUH TEMPLATE STANDAR CSV DI BAWAH INI.</p>
            <p>2. KOLOM <span className="font-bold">jenis</span> HARUS BERNILAI: DART STD, DART STK, DART Portabel - Swing/Pop/Flip, DART Marathon Target, ATAU Moving Target.</p>
            <p>3. KOLOM <span className="font-bold">status_unit</span> HARUS BERNILAI: Beroperasi, Rusak, Perbaikan, ATAU Nonaktif.</p>
            <p>4. KOLOM <span className="font-bold">asal_satuan</span> HARUS BERUPA NAMA SATUAN YANG SUDAH TERDAFTAR DI SISTEM (CONTOH: MAKOSTRAD, AKMIL). SATUAN YANG TIDAK TERDAFTAR AKAN DILEWATI.</p>
            <p>5. UNGGAH CSV DATA BESERTA 1 DOKUMEN SURAT PENDUKUNG (HASIL PEMERIKSAAN).</p>
          </div>
          <button type="button" onClick={downloadTemplate} className="flex items-center gap-2 text-xs font-mono font-bold bg-blue-600 text-white dark:bg-blue-800 px-4 py-2 hover:bg-blue-700 transition-all cursor-pointer shadow-lg">
            <Download size={14} /> UNDUH TEMPLATE CSV
          </button>
        </div>

        <form id="adminBatchForm" onSubmit={handleSubmit} className="space-y-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">DATA UNIT (CSV ONLY) *</label>
                  <div className="relative h-48">
                      {csvFile ? (
                      <div className="h-full flex flex-col items-center justify-center gap-3 bg-cighra-primary/5 dark:bg-cighra-gold/5 border border-cighra-primary dark:border-cighra-gold p-4 relative">
                          <FileText className="w-12 h-12 text-cighra-primary dark:text-cighra-gold opacity-50" />
                          <span className="text-xs font-mono font-bold text-cighra-primary dark:text-cighra-gold text-center break-all">{csvFile.name}</span>
                          <button type="button" onClick={() => setCsvFile(null)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1">
                          <X size={16} />
                          </button>
                      </div>
                      ) : (
                      <label className="h-full flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-cighra-darkcard border-2 border-dashed border-slate-300 dark:border-slate-800 p-6 cursor-pointer hover:border-cighra-primary dark:hover:border-cighra-gold transition-all group">
                          <Upload className="w-8 h-8 text-slate-400 group-hover:text-cighra-gold transition-colors" />
                          <span className="text-xs font-mono text-slate-500 text-center uppercase tracking-widest">PILIH / SERET CSV</span>
                          <input type="file" accept=".csv" className="hidden" required onChange={(e) => e.target.files?.[0] && setCsvFile(e.target.files[0])} />
                      </label>
                      )}
                  </div>
              </div>

              <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">LAMPIRAN PENDUKUNG (PDF/IMG) *</label>
                  <div className="relative h-48">
                      {document ? (
                      <div className="h-full flex flex-col items-center justify-center gap-3 bg-green-500/5 dark:bg-green-900/10 border border-green-500 p-4 relative">
                          <FileText className="w-12 h-12 text-green-500 opacity-50" />
                          <span className="text-xs font-mono font-bold text-green-700 dark:text-green-400 text-center break-all">{document.name}</span>
                          <button type="button" onClick={() => setDocument(null)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1">
                              <X size={16} />
                          </button>
                      </div>
                      ) : (
                      <label className="h-full flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-cighra-darkcard border-2 border-dashed border-slate-300 dark:border-slate-800 p-6 cursor-pointer hover:border-cighra-primary dark:hover:border-cighra-gold transition-all group">
                          <Upload className="w-8 h-8 text-slate-400 group-hover:text-cighra-gold transition-colors" />
                          <span className="text-xs font-mono text-slate-500 text-center uppercase tracking-widest">PILIH LAMPIRAN</span>
                          <input type="file" accept=".pdf,.png,.jpg,.jpeg" required className="hidden" onChange={(e) => e.target.files?.[0] && setDocument(e.target.files[0])} />
                      </label>
                      )}
                  </div>
              </div>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default AdminUnitBatchModal;

