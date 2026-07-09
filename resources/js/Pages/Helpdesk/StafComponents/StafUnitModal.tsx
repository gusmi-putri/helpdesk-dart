import React, { useState } from 'react';
import { Package, Upload, X, FileText } from 'lucide-react';

interface StafUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  processing: boolean;
  dbSatuans?: any[];
}

const StafUnitModal: React.FC<StafUnitModalProps> = ({ isOpen, onClose, onSubmit, processing, dbSatuans = [] }) => {
  const [nomorSeri, setNomorSeri] = useState('');
  const [jenisDart, setJenisDart] = useState('DART STD');
  const [satuanId, setSatuanId] = useState('');
  const [statusUnit, setStatusUnit] = useState('Beroperasi');
  const [reason, setReason] = useState('');
  const [document, setDocument] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;
    const formData = new FormData();
    formData.append('nomor_seri', nomorSeri);

    formData.append('jenis', jenisDart);
    formData.append('satuan_id', satuanId);
    
    // Also pass asal_satuan for backend fallback
    const selectedSatuan = dbSatuans.find(s => s.id == satuanId);
    if (selectedSatuan) {
      formData.append('asal_satuan', selectedSatuan.nama_satuan);
    }
    formData.append('status_unit', statusUnit);
    formData.append('reason', reason || 'Pengajuan penambahan unit baru.');
    formData.append('document', document);
    onSubmit(formData);
  };

  const handleClose = () => {
    setNomorSeri('');
    setJenisDart('DART STD');
    setSatuanId('');
    setStatusUnit('Beroperasi');
    setReason('');
    setDocument(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2">
            <Package size={18} /> PENGAJUAN TAMBAH UNIT DART
          </h3>
          <button onClick={handleClose} className="text-slate-500 hover:text-cighra-primary dark:hover:text-cighra-gold text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 p-3 rounded-sm">
            <p className="text-[10px] font-mono text-orange-700 dark:text-orange-400 uppercase">
              ⚠ PERHATIAN: Pengajuan ini akan dikirim ke Admin untuk disetujui. Unit tidak akan langsung masuk ke database aktif.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Nomor Seri *</label>
            <input type="text" value={nomorSeri} onChange={(e) => setNomorSeri(e.target.value.toUpperCase())} required
              className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none text-slate-800 dark:text-white" placeholder="DRT-XXX" />
          </div>



          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Jenis *</label>
              <select value={jenisDart} onChange={(e) => setJenisDart(e.target.value)}
                className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none text-slate-800 dark:text-white">
                <option value="DART STD">DART STD</option>
                <option value="DART STK">DART STK</option>
                <option value="DART Portabel - Swing">DART Portabel - Swing</option>
                <option value="DART Portabel - Pop">DART Portabel - Pop</option>
                <option value="DART Portabel - Flip">DART Portabel - Flip</option>
                <option value="DART Marathon Target">DART Marathon Target</option>
                <option value="Moving Target">Moving Target</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Status Unit *</label>
              <select value={statusUnit} onChange={(e) => setStatusUnit(e.target.value)}
                className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none text-slate-800 dark:text-white">
                <option value="Beroperasi">BEROPERASI</option>
                <option value="Siap Ops">SIAP OPS</option>
                <option value="Rusak">RUSAK</option>
                <option value="Perbaikan">PERBAIKAN</option>
                <option value="Nonaktif">NONAKTIF</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Asal Satuan *</label>
            <select
                value={satuanId}
                onChange={(e) => setSatuanId(e.target.value)}
                className={`w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none uppercase`}
                required
              >
                <option value="">PILIH SATUAN</option>
                {dbSatuans?.map((satuan: any) => (
                  <option key={satuan.id} value={satuan.id}>{satuan.nama_satuan.toUpperCase()}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Alasan / Catatan</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2}
              className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none text-slate-800 dark:text-white resize-none" placeholder="Alasan penambahan unit..." />
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
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose}
              className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-tactical text-xs tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              BATAL
            </button>
            <button type="submit" disabled={processing}
              className="flex-1 py-2.5 bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900 font-tactical font-bold text-xs tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-all disabled:opacity-50">
              {processing ? 'MENGIRIM...' : 'AJUKAN PENAMBAHAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StafUnitModal;

