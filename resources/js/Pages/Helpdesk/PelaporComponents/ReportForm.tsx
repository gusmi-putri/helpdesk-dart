import React from 'react';
import { Phone, MapPin, AlertCircle, CircleUser, Upload, Camera, Trash2, Send, ShieldCheck, X, Wallet, FileText, Building2, Package, ArrowLeft } from 'lucide-react';
import SearchableSelect from '@/Components/SearchableSelect';
import { useForm } from '@inertiajs/react';
import { useStore } from '@/store/useStore';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface ReportFormProps {
  dbUnits: any[];
  authUser: any;
  currentUser: any;
  onSuccess: (reportedData: any) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  dbUnits,
  authUser,
  currentUser,
  onSuccess
}) => {
  const addNotification = useStore(state => state.addNotification);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data, setData, post, processing, reset, errors } = useForm({
    unit_id: '',
    deskripsi: '',
    tingkat_kerusakan: '',
    urgensi: '',
    jenis_perbaikan: '',
    dokumen_anggaran: [] as File[],
    keterangan_anggaran: '',
    klasifikasi: '',
    file_bukti: [] as File[],
    tautan_video: '',
    auto_assign: false,
    report_type: '',
    waktu_pemeliharaan: '',
    nama_giat: '',
    anggaran_pendukung: '',
    jumlah_anggaran: '',
    dokumen_anggaran_pemeliharaan: [] as File[],
    dokumen_laporan_pemeliharaan: [] as File[],
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setData('file_bukti', [...data.file_bukti, ...newFiles].slice(0, 5));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setData('file_bukti', data.file_bukti.filter((_: File, i: number) => i !== index));
  };
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [localErrors, setLocalErrors] = React.useState<any>({});
  const budgetDocInputRef = React.useRef<HTMLInputElement>(null);
  const maintBudgetDocInputRef = React.useRef<HTMLInputElement>(null);
  const maintReportDocInputRef = React.useRef<HTMLInputElement>(null);
  const isNonSwadaya = data.jenis_perbaikan === 'Non-Swadaya';

  React.useEffect(() => {
    if (data.file_bukti && data.file_bukti.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalErrors((prev: any) => ({ ...prev, file_bukti: null }));
    }
  }, [data.file_bukti]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (data.report_type === 'Kerusakan') {
      if (!data.jenis_perbaikan) newErrors.jenis_perbaikan = 'Jenis perbaikan wajib dipilih.';
      if (!data.unit_id) newErrors.unit_id = 'Nomor Seri DART wajib dipilih.';
      if (!data.file_bukti || data.file_bukti.length === 0) newErrors.file_bukti = 'Wajib mengunggah minimal 1 bukti kendala (Foto).';
      const isGDriveLink = /^https?:\/\/(drive|docs)\.google\.com\/[a-zA-Z0-9-_./?=&]+/.test(data.tautan_video || '');
      if (!data.tautan_video || !isGDriveLink) newErrors.tautan_video = 'Wajib menyertakan Link Google Drive yang valid.';
      if (isNonSwadaya && (!data.dokumen_anggaran || data.dokumen_anggaran.length === 0)) newErrors.dokumen_anggaran = 'Dokumen pendukung perintah dan anggaran wajib diunggah.';
      if (isNonSwadaya && !data.keterangan_anggaran?.trim()) newErrors.keterangan_anggaran = 'Keterangan dana anggaran perbaikan wajib diisi.';
    } else {
      if (!data.waktu_pemeliharaan) newErrors.waktu_pemeliharaan = 'Waktu pemeliharaan wajib dipilih.';
      if (!data.nama_giat) newErrors.nama_giat = 'Nama giat wajib diisi.';
      if (!data.anggaran_pendukung) newErrors.anggaran_pendukung = 'Anggaran pendukung wajib diisi.';
      if (!data.jumlah_anggaran) newErrors.jumlah_anggaran = 'Jumlah anggaran wajib diisi.';
      if (!data.dokumen_anggaran_pemeliharaan || data.dokumen_anggaran_pemeliharaan.length === 0) newErrors.dokumen_anggaran_pemeliharaan = 'Dokumen pendukung anggaran keuangan wajib diunggah.';
      if (!data.dokumen_laporan_pemeliharaan || data.dokumen_laporan_pemeliharaan.length === 0) newErrors.dokumen_laporan_pemeliharaan = 'Dokumen laporan pertanggung jawaban (LPJ) wajib diunggah.';
    }

    if (Object.keys(newErrors).length > 0) {
      setLocalErrors(newErrors);
      return;
    }

    setLocalErrors({});
    setIsConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setIsConfirmOpen(false);

    const endpoint = data.report_type === 'Pemeliharaan' ? '/maintenance-reports' : '/reports';

    post(endpoint, {
      onSuccess: () => {
        onSuccess({
          unit_id: data.unit_id,
          deskripsi: data.deskripsi,
          tingkat_kerusakan: data.tingkat_kerusakan
        });
        reset();
      },
      onError: () => {
        addNotification('Gagal mengirim laporan. Silakan periksa kembali koneksi Anda.', 'error');
      }
    });
  };

  const selectedUnit = dbUnits.find((u: any) => (u.db_id || u.id)?.toString() === data.unit_id?.toString());

  const handleRepairTypeChange = (type: 'Swadaya' | 'Non-Swadaya') => {
    setData('jenis_perbaikan', type);
    setLocalErrors((prev: any) => ({ ...prev, jenis_perbaikan: null }));

    if (type === 'Swadaya') {
      setData('dokumen_anggaran', []);
      setData('keterangan_anggaran', '');
      if (budgetDocInputRef.current) budgetDocInputRef.current.value = '';
    }
  };

  const handleBudgetDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const currentFiles = data.dokumen_anggaran || [];

    if (currentFiles.length + newFiles.length > 10) {
      setLocalErrors((prev: any) => ({ ...prev, dokumen_anggaran: 'Wajib mengunggah maksimum 10 dokumen pendukung.' }));
      if (budgetDocInputRef.current) budgetDocInputRef.current.value = '';
      return;
    }

    const nextFiles = [...currentFiles, ...newFiles];

    setData('dokumen_anggaran', nextFiles);
    if (nextFiles.length > 0) {
      setLocalErrors((prev: any) => ({ ...prev, dokumen_anggaran: null }));
    }
    if (budgetDocInputRef.current) budgetDocInputRef.current.value = '';
  };

  const removeBudgetDoc = (index: number) => {
    setData('dokumen_anggaran', (data.dokumen_anggaran || []).filter((_: File, i: number) => i !== index));
  };

  const handleMaintBudgetDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const currentFiles = data.dokumen_anggaran_pemeliharaan || [];

    if (currentFiles.length + newFiles.length > 5) {
      setLocalErrors((prev: any) => ({ ...prev, dokumen_anggaran_pemeliharaan: 'Maksimum 5 dokumen pendukung.' }));
      if (maintBudgetDocInputRef.current) maintBudgetDocInputRef.current.value = '';
      return;
    }

    const nextFiles = [...currentFiles, ...newFiles];
    setData('dokumen_anggaran_pemeliharaan', nextFiles);
    if (nextFiles.length > 0) {
      setLocalErrors((prev: any) => ({ ...prev, dokumen_anggaran_pemeliharaan: null }));
    }
    if (maintBudgetDocInputRef.current) maintBudgetDocInputRef.current.value = '';
  };

  const removeMaintBudgetDoc = (index: number) => {
    setData('dokumen_anggaran_pemeliharaan', (data.dokumen_anggaran_pemeliharaan || []).filter((_: File, i: number) => i !== index));
  };

  const handleMaintReportDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const currentFiles = data.dokumen_laporan_pemeliharaan || [];

    if (currentFiles.length + newFiles.length > 5) {
      setLocalErrors((prev: any) => ({ ...prev, dokumen_laporan_pemeliharaan: 'Maksimum 5 dokumen laporan.' }));
      if (maintReportDocInputRef.current) maintReportDocInputRef.current.value = '';
      return;
    }

    const nextFiles = [...currentFiles, ...newFiles];
    setData('dokumen_laporan_pemeliharaan', nextFiles);
    if (nextFiles.length > 0) {
      setLocalErrors((prev: any) => ({ ...prev, dokumen_laporan_pemeliharaan: null }));
    }
    if (maintReportDocInputRef.current) maintReportDocInputRef.current.value = '';
  };

  const removeMaintReportDoc = (index: number) => {
    setData('dokumen_laporan_pemeliharaan', (data.dokumen_laporan_pemeliharaan || []).filter((_: File, i: number) => i !== index));
  };


  const userUnits = dbUnits.filter((unit: any) => unit.asal_satuan === authUser?.asal_satuan);
  const otherUnits = dbUnits.filter((unit: any) => unit.asal_satuan !== authUser?.asal_satuan);
  const sortedUnits = [...userUnits, ...otherUnits];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      
      {!data.report_type ? (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-tactical font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">Pilih Jenis Laporan</h1>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm uppercase tracking-widest">Silakan pilih jenis laporan yang ingin Anda buat hari ini</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kartu Kerusakan */}
            <button
              type="button"
              onClick={() => setData('report_type', 'Kerusakan')}
              className="group flex flex-col text-left p-6 md:p-8 bg-white dark:bg-cighra-darkcard border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 text-slate-100 dark:text-slate-800/50 group-hover:text-red-50 dark:group-hover:text-red-900/20 transition-colors duration-500 z-0">
                <AlertCircle size={150} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-tactical tracking-widest text-slate-800 dark:text-white uppercase mb-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">Laporan Kerusakan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Ajukan permohonan perbaikan untuk DART yang mengalami kendala teknis, kerusakan fisik, atau gagal fungsi.
                  </p>
                </div>
              </div>
            </button>

            {/* Kartu Pemeliharaan */}
            <button
              type="button"
              onClick={() => setData('report_type', 'Pemeliharaan')}
              className="group flex flex-col text-left p-6 md:p-8 bg-white dark:bg-cighra-darkcard border-2 border-slate-200 dark:border-slate-700 hover:border-cighra-gold dark:hover:border-cighra-gold rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 text-slate-100 dark:text-slate-800/50 group-hover:text-amber-50 dark:group-hover:text-cighra-gold/10 transition-colors duration-500 z-0">
                <ShieldCheck size={150} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 bg-amber-100 dark:bg-cighra-gold/20 text-amber-600 dark:text-cighra-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-tactical tracking-widest text-slate-800 dark:text-white uppercase mb-2 group-hover:text-amber-600 dark:group-hover:text-cighra-gold transition-colors">Laporan Pemeliharaan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Kirimkan form pertanggung jawaban (Wabku) untuk DART yang telah selesai dipelihara atau diperbaiki secara mandiri (Swadaya).
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="glass-panel border-t-4 border-t-cighra-gold overflow-hidden !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
            <div className="p-6 md:p-8">
              <button
                type="button"
                onClick={() => setData('report_type', '')}
                className="mb-4 text-[11px] font-tactical font-bold uppercase tracking-widest text-slate-400 hover:text-cighra-gold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} /> Ganti Jenis Laporan
              </button>
              <h2 className="text-2xl md:text-3xl font-tactical font-bold text-cighra-gold tracking-wider uppercase mb-3">
                {data.report_type === 'Kerusakan' ? 'BUAT LAPORAN KERUSAKAN' : 'BUAT LAPORAN PEMELIHARAAN'}
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed mb-4">
            {data.report_type === 'Kerusakan'
              ? 'Tim teknis akan melakukan verifikasi data setelah menerima laporan ini. Kami akan menghubungi Anda kembali untuk proses tindak lanjut.'
              : 'Form ini bersifat pasif dan digunakan sebagai Laporan Pertanggung Jawaban Keuangan (Wabku) dari satuan pemakai terhadap pemeliharaan DART yang telah dilaksanakan.'}
          </p>
          {data.report_type === 'Kerusakan' && (
            <>
              <p className="text-sm text-slate-300 mb-3">
                Jika kendala bersifat <strong className="text-cighra-gold">Darurat (Urgent)</strong>, mohon hubungi pusat bantuan kami di:
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><Phone size={16} className="text-cighra-gold mt-0.5 flex-shrink-0" /><span><strong>Telepon:</strong> (+62) 822-2541-8071</span></li>
                <li className="flex items-start gap-2"><MapPin size={16} className="text-cighra-gold mt-0.5 flex-shrink-0" /><span><strong>Alamat:</strong> Jl. PSM No.50, Sukapura, Kec. Kiaracondong, Kota Bandung, Jawa Barat 40285</span></li>
              </ul>
            </>
          )}
        </div>
        <div className="px-6 md:px-8 py-3 bg-white/5 border-t border-white/10">
          <p className="text-xs text-cighra-gold font-semibold flex items-center gap-1.5"><AlertCircle size={14} /> Tanda <span className="font-bold">*</span> wajib diisi</p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {data.report_type === 'Kerusakan' ? (
          <>
            <div className="glass-panel p-6 border-l-4 border-l-cighra-gold !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
              <h3 className="text-xs font-tactical font-bold text-cighra-gold tracking-[0.2em] uppercase flex items-center gap-2 mb-4">
                JENIS PERBAIKAN
              </h3>
              <p className="text-xs text-slate-300 mb-4">
                Pilih sumber dukungan perbaikan sebelum mengisi rincian kendala.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    value: 'Swadaya',
                    title: 'Swadaya',
                    desc: 'Perbaikan didukung dana Satkai secara pribadi dan dapat langsung ditindaklanjuti.',
                    icon: Wallet,
                  },
                  {
                    value: 'Non-Swadaya',
                    title: 'Non-Swadaya',
                    desc: 'Perbaikan didukung dana anggaran resmi instansi pusat dan wajib melampirkan dokumen.',
                    icon: Building2,
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  const selected = data.jenis_perbaikan === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleRepairTypeChange(option.value as 'Swadaya' | 'Non-Swadaya')}
                      className={`text-left p-4 border rounded-sm transition-all min-h-[132px] ${selected
                        ? 'border-cighra-gold bg-cighra-gold/10 shadow-md'
                        : 'border-white/20 hover:border-cighra-gold/70 hover:bg-black/20'
                        }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-tactical font-bold uppercase tracking-widest text-white mb-2">
                        <Icon className="w-4 h-4 text-cighra-gold" /> {option.title}
                      </span>
                      <span className="block text-xs text-slate-300 leading-relaxed">{option.desc}</span>
                    </button>
                  );
                })}
              </div>
              {(errors.jenis_perbaikan || localErrors.jenis_perbaikan) && <p className="text-xs text-cighra-gold mt-3 font-mono font-bold uppercase">{errors.jenis_perbaikan || localErrors.jenis_perbaikan}</p>}
            </div>

            {data.jenis_perbaikan && (
              <>
                <div className="glass-panel p-6 border-l-4 border-l-cighra-gold space-y-5 !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
                  <h3 className="text-xs font-tactical font-bold text-cighra-gold tracking-[0.2em] uppercase flex items-center gap-2">DATA PELAPOR</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Nama Lengkap</label>
                      <input type="text" readOnly value={authUser?.nama_lengkap || currentUser?.name || ''} className="w-full bg-white/10 border-white/20 px-4 py-2.5 text-sm text-slate-300 cursor-not-allowed rounded-sm border" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Pangkat / NRP / Golongan</label>
                      <input type="text" readOnly value={authUser?.nrp_nip || '-'} className="w-full bg-white/10 border-white/20 px-4 py-2.5 text-sm text-slate-300 cursor-not-allowed rounded-sm border" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">SATUAN</label>
                      <input type="text" readOnly value={authUser?.asal_satuan || '-'} className="w-full bg-white/10 border-white/20 px-4 py-2.5 text-sm text-slate-300 cursor-not-allowed rounded-sm border" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Nomor WhatsApp Aktif</label>
                      <input type="text" readOnly value={authUser?.no_wa || '-'} className="w-full bg-white/10 border-white/20 px-4 py-2.5 text-sm text-slate-300 cursor-not-allowed rounded-sm border" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 italic uppercase tracking-tighter">Data diambil otomatis dari profil akun Anda. Hubungi Admin jika ada kesalahan.</p>
                </div>

                <div className="glass-panel p-6 border-l-4 border-l-cighra-gold !overflow-visible relative z-20 !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
                  <SearchableSelect
                    label="Nomor Seri DART"
                    placeholder="Ketik nomor seri atau keterangan DART..."
                    options={sortedUnits
                      .map((unit: any) => ({
                        id: unit.db_id || unit.id,
                        label: unit.nomor_seri,
                        tag: `${unit.jenis} | ${unit.asal_satuan || 'Belum Terdata'}`,
                        disabled: unit.is_verified === 0 || unit.is_verified === false
                      }))}
                    value={data.unit_id}
                    onChange={(val) => {
                      setData(prev => ({ ...prev, unit_id: val.toString(), auto_assign: false }));
                      setLocalErrors((prev: any) => ({ ...prev, unit_id: null }));
                    }}
                    error={errors.unit_id || localErrors.unit_id}
                  />
                  {selectedUnit && !selectedUnit.asal_satuan && (
                    <div className="mt-4 p-4 bg-cighra-gold/10 border border-cighra-gold/30 rounded-sm">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5">
                          <input
                            type="checkbox"
                            checked={data.auto_assign}
                            onChange={(e) => setData('auto_assign', e.target.checked)}
                            className="w-5 h-5 appearance-none border-2 border-white/30 rounded-sm checked:bg-cighra-gold checked:border-cighra-gold transition-all"
                          />
                          <ShieldCheck size={14} className={`absolute text-slate-900 pointer-events-none transition-opacity ${data.auto_assign ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">Jadikan Perangkat ini Milik Satuan Saya</p>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Perangkat ini belum terdata di satuan manapun. Centang opsi ini jika Anda ingin menetapkan bahwa perangkat ini adalah milik satuan Anda (<span className="text-cighra-gold font-bold">{authUser?.asal_satuan}</span>).
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                {isNonSwadaya && (
                  <div className="glass-panel p-6 border-l-4 border-l-cighra-gold !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
                    <h3 className="text-xs font-tactical font-bold text-cighra-gold tracking-[0.2em] uppercase flex items-center gap-2 mb-4">
                      DOKUMEN DUKUNGAN NON-SWADAYA
                    </h3>
                    <p className="text-xs text-slate-300 mb-4">
                      Lampirkan dokumen perintah dan keterangan bahwa tersedia dana anggaran perbaikan untuk Satkai terkait.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-cighra-gold mb-2 uppercase tracking-wider">Dokumen Pendukung Perintah & Anggaran <span className="text-cighra-gold">*</span></label>
                        <input type="file" ref={budgetDocInputRef} onChange={handleBudgetDocSelect} accept=".pdf,.doc,.docx,image/*" multiple className="hidden" />
                        <button
                          type="button"
                          onClick={() => budgetDocInputRef.current?.click()}
                          disabled={(data.dokumen_anggaran?.length || 0) >= 10}
                          className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-cighra-gold/80 text-cighra-gold font-semibold text-sm rounded-sm hover:bg-white/10 transition-colors"
                        >
                          <Upload size={18} /> Tambah Dokumen
                        </button>
                        {(data.dokumen_anggaran?.length || 0) > 0 && (
                          <div className="mt-3 space-y-2">
                            {data.dokumen_anggaran.map((file: File, i: number) => (
                              <div key={`${file.name}-${i}`} className="flex items-center justify-between p-2.5 bg-white/10 border border-white/20 rounded-sm">
                                <div className="flex items-center gap-2 text-sm text-slate-300 truncate">
                                  <FileText size={14} className="text-cighra-gold flex-shrink-0" />
                                  <span className="truncate">{file.name}</span>
                                  <span className="text-xs text-slate-400 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeBudgetDoc(i)}
                                  className="text-slate-400 hover:text-red-400 transition-colors p-1"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            <p className="text-xs text-slate-400">{data.dokumen_anggaran.length}/10 dokumen pendukung terpilih</p>
                          </div>
                        )}
                        {(errors.dokumen_anggaran || localErrors.dokumen_anggaran) && <p className="text-xs text-cighra-gold mt-3 font-mono font-bold uppercase">{errors.dokumen_anggaran || localErrors.dokumen_anggaran}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-cighra-gold mb-2 uppercase tracking-wider">Keterangan Dana Anggaran Perbaikan <span className="text-cighra-gold">*</span></label>
                        <textarea
                          value={data.keterangan_anggaran}
                          onChange={(e) => {
                            setData('keterangan_anggaran', e.target.value);
                            setLocalErrors((prev: any) => ({ ...prev, keterangan_anggaran: null }));
                          }}
                          rows={4}
                          className="w-full bg-white/10 dark:!bg-cighra-darkcard/80 border border-white/20 dark:border-slate-600 px-4 py-3 text-sm text-white focus:outline-none focus:border-cighra-gold focus:ring-2 focus:ring-cighra-gold/20 transition-all duration-300 resize-none rounded-sm"
                          placeholder="Tuliskan nomor/rujukan perintah, sumber anggaran, dan keterangan bahwa dana perbaikan tersedia untuk Satkai terkait..."
                        />
                        {(errors.keterangan_anggaran || localErrors.keterangan_anggaran) && <p className="text-xs text-cighra-gold mt-3 font-mono font-bold uppercase">{errors.keterangan_anggaran || localErrors.keterangan_anggaran}</p>}
                      </div>
                    </div>
                  </div>
                )}



                <div className="glass-panel p-6 border-l-4 border-l-cighra-gold !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
                  <label className="block text-xs font-bold text-cighra-gold mb-2 uppercase tracking-wider">Upload Foto Kendala <span className="text-cighra-gold">*</span></label>
                  <p className="text-xs text-slate-400 mb-4">Maksimum 5 file (Hanya Gambar). Ukuran maks 20 MB per file.</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" multiple className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={data.file_bukti.length >= 5}
                    className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-cighra-gold/80 text-cighra-gold font-semibold text-sm rounded-sm hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <Upload size={18} /> Unggah File Baru
                  </button>
                  {data.file_bukti.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {data.file_bukti.map((file: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-white/10 border border-white/20 rounded-sm">
                          <div className="flex items-center gap-2 text-sm text-slate-300 truncate">
                            <Camera size={14} className="text-cighra-gold flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-xs text-slate-400 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                          </div>
                          <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
                        </div>
                      ))}
                      <p className="text-xs text-slate-400">{data.file_bukti.length}/5 file terpilih</p>
                    </div>
                  )}
                  {(errors.file_bukti || localErrors.file_bukti) && <p className="text-xs text-cighra-gold mt-3 font-mono font-bold uppercase bg-black/20 p-2 border border-cighra-gold/30 rounded-sm shadow-sm">{errors.file_bukti || localErrors.file_bukti}</p>}
                </div>

                <div className="glass-panel p-6 border-l-4 border-l-cighra-gold !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
                  <label className="block text-xs font-bold text-cighra-gold mb-2 uppercase tracking-wider">Tautan Video G-Drive <span className="text-cighra-gold">*</span></label>
                  <p className="text-xs text-slate-400 mb-4">Unggah video dokumentasi kerusakan ke Google Drive dan tempel/link tautannya di bawah ini. Pastikan akses tautan bersifat publik (Anyone with the link).</p>
                  <input type="url" value={data.tautan_video || ''} onChange={(e) => { setData('tautan_video', e.target.value); setLocalErrors((prev: any) => ({ ...prev, tautan_video: null })); }} required
                    className={`w-full bg-white/5 border ${errors.tautan_video || localErrors.tautan_video ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-white/20'} px-4 py-3 text-sm text-white focus:outline-none focus:border-cighra-gold transition-all rounded-sm`}
                    placeholder="https://drive.google.com/file/d/..." />
                  {(errors.tautan_video || localErrors.tautan_video) && <p className="text-xs text-cighra-gold mt-3 font-mono font-bold uppercase">{errors.tautan_video || localErrors.tautan_video}</p>}
                </div>

                <div className="glass-panel p-6 border-l-4 border-l-cighra-gold !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
                  <label className="block text-xs font-bold text-cighra-gold mb-2 uppercase tracking-wider">Prioritas Penanganan <span className="text-cighra-gold">*</span></label>
                  <p className="text-xs text-slate-400 italic mb-3">Pilihlah tingkat urgensi sesuai kondisi lapangan agar tim dapat memprioritaskan penanganan.</p>
                  <div className="space-y-3">
                    {[
                      { val: 'Sangat Mendesak', desc: 'Butuh penanganan segera, operasi terhenti' },
                      { val: 'Bisa Menunggu', desc: 'Perlu diperbaiki tapi tidak mendesak' },
                      { val: 'Perbaikan Rutin', desc: 'Perbaikan berkala' },
                    ].map(opt => (
                      <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all ${data.urgensi === opt.val ? 'border-cighra-gold bg-cighra-gold/10' : 'border-white/20 hover:border-cighra-gold/50 hover:bg-black/20'}`}>
                        <input type="radio" name="urgensi" value={opt.val} checked={data.urgensi === opt.val} onChange={(e) => setData('urgensi', e.target.value)} required
                          className="w-4 h-4 accent-cighra-gold" />
                        <div>
                          <span className="text-sm text-white font-medium uppercase">{opt.val}</span>
                          <span className="block text-xs text-slate-400 uppercase">{opt.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.urgensi && <p className="text-[11px] text-cighra-gold mt-1 font-mono uppercase">{errors.urgensi}</p>}
                </div>

                <div className="glass-panel p-6 border-l-4 border-l-cighra-gold !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
                  <label className="block text-xs font-bold text-cighra-gold mb-2 uppercase tracking-wider">Deskripsi Kerusakan <span className="text-cighra-gold">*</span></label>
                  <textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} required rows={5}
                    className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-cighra-gold focus:ring-2 focus:ring-cighra-gold/20 hover:border-cighra-gold/50 transition-all duration-300 resize-none rounded-sm"
                    placeholder="Jelaskan secara detail kondisi kerusakan, kronologi kejadian, dan gejala yang dialami..." />
                  {errors.deskripsi && <p className="text-[11px] text-cighra-gold mt-1 font-mono uppercase">{errors.deskripsi}</p>}
                </div>

                <button type="submit" disabled={processing}
                  className="w-full bg-cighra-gold dark:bg-cighra-gold text-slate-900 hover:bg-cighra-gold/90 font-tactical font-bold py-4 tracking-[0.3em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 shadow-lg rounded-sm uppercase">
                  <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></span>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  {processing ? 'MENGIRIM LAPORAN...' : 'KIRIM LAPORAN SEKARANG'}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <div className="glass-panel p-6 border-l-4 border-l-cighra-gold space-y-5 !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
              <h3 className="text-xs font-tactical font-bold text-cighra-gold tracking-[0.2em] uppercase flex items-center gap-2">DATA SATUAN & PELAPOR</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Asal Satuan</label>
                  <input type="text" readOnly value={authUser?.asal_satuan || '-'} className="w-full bg-white/10 border-white/20 px-4 py-2.5 text-sm text-slate-300 font-bold cursor-not-allowed rounded-sm border" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Nama Pelapor</label>
                  <input type="text" readOnly value={authUser?.nama_lengkap || currentUser?.name || ''} className="w-full bg-white/10 border-white/20 px-4 py-2.5 text-sm text-slate-300 cursor-not-allowed rounded-sm border" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Pangkat / NRP / Golongan</label>
                  <input type="text" readOnly value={authUser?.nrp_nip || '-'} className="w-full bg-white/10 border-white/20 px-4 py-2.5 text-sm text-slate-300 cursor-not-allowed rounded-sm border" />
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-cighra-gold space-y-6 !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
              <h3 className="text-xs font-tactical font-bold text-cighra-gold tracking-[0.2em] uppercase flex items-center gap-2">INFORMASI GIAT PEMELIHARAAN</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-cighra-gold mb-2 uppercase tracking-wider">Nama Giat <span className="text-cighra-gold">*</span></label>
                  <input type="text" value={data.nama_giat} onChange={(e) => { setData('nama_giat', e.target.value); setLocalErrors((prev: any) => ({ ...prev, nama_giat: null })); }}
                    className={`w-full bg-white/5 border ${errors.nama_giat || localErrors.nama_giat ? 'border-red-500' : 'border-white/20'} px-4 py-3 text-sm text-white focus:outline-none focus:border-cighra-gold transition-all rounded-sm`}
                    placeholder="Contoh: Pengecatan Ulang dan Servis Berkala" />
                  {(errors.nama_giat || localErrors.nama_giat) && <p className="text-[11px] text-cighra-gold mt-2 font-mono uppercase">{errors.nama_giat || localErrors.nama_giat}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-cighra-gold mb-2 uppercase tracking-wider">Waktu Pelaksanaan <span className="text-cighra-gold">*</span></label>
                  <div className="flex gap-3">
                    <select
                      value={data.waktu_pemeliharaan ? data.waktu_pemeliharaan.split(' - ')[0] : ''}
                      onChange={(e) => {
                        const currentYear = data.waktu_pemeliharaan && data.waktu_pemeliharaan.includes(' - ') ? data.waktu_pemeliharaan.split(' - ')[1] : new Date().getFullYear().toString();
                        setData('waktu_pemeliharaan', `${e.target.value} - ${currentYear}`);
                        setLocalErrors((prev: any) => ({ ...prev, waktu_pemeliharaan: null }));
                      }}
                      className={`w-1/2 bg-white/5 border ${errors.waktu_pemeliharaan || localErrors.waktu_pemeliharaan ? 'border-red-500' : 'border-white/20'} px-4 py-3 text-sm text-white focus:outline-none focus:border-cighra-gold transition-all rounded-sm`}
                    >
                      <option value="" className="text-slate-800">Pilih Periode</option>
                      <option value="Triwulan I" className="text-slate-800">Triwulan I</option>
                      <option value="Triwulan II" className="text-slate-800">Triwulan II</option>
                      <option value="Triwulan III" className="text-slate-800">Triwulan III</option>
                      <option value="Triwulan IV" className="text-slate-800">Triwulan IV</option>
                      <option value="Tahunan" className="text-slate-800">Tahunan</option>
                    </select>

                    <select
                      value={data.waktu_pemeliharaan && data.waktu_pemeliharaan.includes(' - ') ? data.waktu_pemeliharaan.split(' - ')[1] : ''}
                      onChange={(e) => {
                        const currentPeriod = data.waktu_pemeliharaan && data.waktu_pemeliharaan.includes(' - ') ? data.waktu_pemeliharaan.split(' - ')[0] : '';
                        setData('waktu_pemeliharaan', `${currentPeriod} - ${e.target.value}`);
                        setLocalErrors((prev: any) => ({ ...prev, waktu_pemeliharaan: null }));
                      }}
                      className={`w-1/2 bg-white/5 border ${errors.waktu_pemeliharaan || localErrors.waktu_pemeliharaan ? 'border-red-500' : 'border-white/20'} px-4 py-3 text-sm text-white focus:outline-none focus:border-cighra-gold transition-all rounded-sm`}
                    >
                      <option value="" className="text-slate-800">Tahun</option>
                      {Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                        <option key={year} value={year} className="text-slate-800">{year}</option>
                      ))}
                    </select>
                  </div>
                  {(errors.waktu_pemeliharaan || localErrors.waktu_pemeliharaan) && <p className="text-[11px] text-cighra-gold mt-2 font-mono uppercase">{errors.waktu_pemeliharaan || localErrors.waktu_pemeliharaan}</p>}
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-cighra-gold space-y-6 !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
              <h3 className="text-xs font-tactical font-bold text-cighra-gold tracking-[0.2em] uppercase flex items-center gap-2">KEUANGAN</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-cighra-gold mb-2 uppercase tracking-wider">Anggaran Pendukung <span className="text-cighra-gold">*</span></label>
                  <input type="text" value={data.anggaran_pendukung} onChange={(e) => { setData('anggaran_pendukung', e.target.value); setLocalErrors((prev: any) => ({ ...prev, anggaran_pendukung: null })); }}
                    className={`w-full bg-white/5 border ${errors.anggaran_pendukung || localErrors.anggaran_pendukung ? 'border-red-500' : 'border-white/20'} px-4 py-3 text-sm text-white focus:outline-none focus:border-cighra-gold transition-all rounded-sm`}
                    placeholder="Contoh: DIPA Satuan 2024" />
                  {(errors.anggaran_pendukung || localErrors.anggaran_pendukung) && <p className="text-[11px] text-cighra-gold mt-2 font-mono uppercase">{errors.anggaran_pendukung || localErrors.anggaran_pendukung}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-cighra-gold mb-2 uppercase tracking-wider">Jumlah Anggaran (Rp) <span className="text-cighra-gold">*</span></label>
                  <input type="number" value={data.jumlah_anggaran} onChange={(e) => { setData('jumlah_anggaran', e.target.value); setLocalErrors((prev: any) => ({ ...prev, jumlah_anggaran: null })); }}
                    className={`w-full bg-white/5 border ${errors.jumlah_anggaran || localErrors.jumlah_anggaran ? 'border-red-500' : 'border-white/20'} px-4 py-3 text-sm text-white focus:outline-none focus:border-cighra-gold transition-all rounded-sm`}
                    placeholder="15000000" />
                  {(errors.jumlah_anggaran || localErrors.jumlah_anggaran) && <p className="text-[11px] text-cighra-gold mt-2 font-mono uppercase">{errors.jumlah_anggaran || localErrors.jumlah_anggaran}</p>}
                </div>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-cighra-gold uppercase tracking-wider">Dokumen Pendukung Anggaran Keuangan <span className="text-cighra-gold">*</span></label>
                    <p className="text-xs text-slate-400 mt-1">Unggah scan/foto dokumen rincian anggaran (PDF/Gambar).</p>
                  </div>
                  <button type="button" onClick={() => maintBudgetDocInputRef.current?.click()}
                    className="bg-cighra-gold/10 text-cighra-gold hover:bg-cighra-gold/20 px-5 py-2.5 rounded-sm text-xs font-tactical font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 border border-cighra-gold/30 flex-shrink-0 w-full sm:w-auto">
                    <Upload size={14} /> UNGGAH DOKUMEN ANGGARAN
                  </button>
                  <input type="file" ref={maintBudgetDocInputRef} onChange={handleMaintBudgetDocSelect} className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
                </div>

                {data.dokumen_anggaran_pemeliharaan && data.dokumen_anggaran_pemeliharaan.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.dokumen_anggaran_pemeliharaan.map((file: File, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-cighra-gold/20 rounded-sm bg-white/5">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="w-5 h-5 text-cighra-gold flex-shrink-0" />
                          <span className="text-sm text-white truncate">{file.name}</span>
                        </div>
                        <button type="button" onClick={() => removeMaintBudgetDoc(index)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-red-500/10 rounded-sm ml-2">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {(errors.dokumen_anggaran_pemeliharaan || localErrors.dokumen_anggaran_pemeliharaan) && <p className="text-[11px] text-cighra-gold mt-3 font-mono font-bold uppercase">{errors.dokumen_anggaran_pemeliharaan || localErrors.dokumen_anggaran_pemeliharaan}</p>}
              </div>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-cighra-gold !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-cighra-gold uppercase tracking-wider">Dokumen Laporan Pertanggung Jawaban (LPJ) <span className="text-cighra-gold">*</span></label>
                  <p className="text-xs text-slate-400 mt-1">Unggah scan/foto dokumen laporan pertanggung jawaban pelaksanaan (PDF/Gambar).</p>
                </div>
                <button type="button" onClick={() => maintReportDocInputRef.current?.click()}
                  className="bg-cighra-gold/10 text-cighra-gold hover:bg-cighra-gold/20 px-5 py-2.5 rounded-sm text-xs font-tactical font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 border border-cighra-gold/30 flex-shrink-0 w-full sm:w-auto">
                  <Upload size={14} /> UNGGAH DOKUMEN LPJ
                </button>
                <input type="file" ref={maintReportDocInputRef} onChange={handleMaintReportDocSelect} className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
              </div>

              {data.dokumen_laporan_pemeliharaan && data.dokumen_laporan_pemeliharaan.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.dokumen_laporan_pemeliharaan.map((file: File, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-cighra-gold/20 rounded-sm bg-white/5">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-cighra-gold flex-shrink-0" />
                        <span className="text-sm text-white truncate">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => removeMaintReportDoc(index)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-red-500/10 rounded-sm ml-2">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {(errors.dokumen_laporan_pemeliharaan || localErrors.dokumen_laporan_pemeliharaan) && <p className="text-[11px] text-cighra-gold mt-3 font-mono font-bold uppercase">{errors.dokumen_laporan_pemeliharaan || localErrors.dokumen_laporan_pemeliharaan}</p>}
            </div>

            <button type="submit" disabled={processing}
              className="w-full bg-cighra-gold dark:bg-cighra-gold text-slate-900 hover:bg-cighra-gold/90 font-tactical font-bold py-4 tracking-[0.3em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 shadow-lg rounded-sm uppercase">
              <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></span>
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              {processing ? 'MENGIRIM LPJ...' : 'KIRIM LAPORAN PERTANGGUNG JAWABAN'}
            </button>
          </>
        )}
      </form>
        </>
      )}

      {/* Confirmation Modal */}
      <BaseModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="KONFIRMASI PENGIRIMAN"
        icon={<ShieldCheck />}
        maxWidth="lg"
        headerColor="primary"
        footer={
          <div className="flex gap-4 w-full">
            <Button
              variant="primary"
              onClick={confirmSubmit}
              disabled={processing}
              className="flex-[2] uppercase"
              size="lg"
            >
              <Send className="w-5 h-5" />
              YA, KIRIM LAPORAN
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsConfirmOpen(false)}
              disabled={processing}
              className="flex-1 uppercase"
              size="lg"
            >
              PERIKSA ULANG
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 !bg-cighra-primary/5 dark:bg-cighra-darkcard border border-cighra-primary/20 dark:border-slate-800 text-sm font-mono font-bold text-slate-800 dark:text-slate-300 leading-relaxed uppercase tracking-wider">
            <p className="mb-4">
              Apakah Anda yakin semua data laporan sudah benar dan lengkap? Laporan yang telah dikirim tidak dapat diubah kembali.
            </p>
            <div className="bg-white dark:!bg-cighra-darkcard/80 p-3 border border-cighra-primary dark:border-cighra-gold/20 text-xs font-mono space-y-1">
              <p className="text-slate-500 dark:text-slate-300">UNIT: <span className="text-cighra-primary dark:text-cighra-gold font-bold">{selectedUnit?.nomor_seri || '-'}</span></p>
              {data.report_type === 'Kerusakan' ? (
                <>
                  <p className="text-slate-500 dark:text-slate-300">JENIS: <span className="text-cighra-primary dark:text-cighra-gold font-bold uppercase">{data.jenis_perbaikan || '-'}</span></p>
                  <p className="text-slate-500 dark:text-slate-300">TINGKAT: <span className="text-cighra-primary dark:text-cighra-gold font-bold uppercase">{data.tingkat_kerusakan || '-'}</span></p>
                  <p className="text-slate-500 dark:text-slate-300">URGENSI: <span className="text-cighra-primary dark:text-cighra-gold font-bold uppercase">{data.urgensi || '-'}</span></p>
                  {isNonSwadaya && <p className="text-slate-500 dark:text-slate-300">DOKUMEN ANGGARAN: <span className="text-cighra-primary dark:text-cighra-gold font-bold">{data.dokumen_anggaran?.length || 0} dokumen</span></p>}
                  <p className="text-slate-500 dark:text-slate-300">BUKTI: <span className="text-cighra-primary dark:text-cighra-gold font-bold">{data.file_bukti?.length || 0} file</span></p>
                </>
              ) : (
                <>
                  <p className="text-slate-500 dark:text-slate-300">GIAT: <span className="text-cighra-primary dark:text-cighra-gold font-bold uppercase">{data.nama_giat || '-'}</span></p>
                  <p className="text-slate-500 dark:text-slate-300">WAKTU: <span className="text-cighra-primary dark:text-cighra-gold font-bold uppercase">{data.waktu_pemeliharaan || '-'}</span></p>
                  <p className="text-slate-500 dark:text-slate-300">DOKUMEN: <span className="text-cighra-primary dark:text-cighra-gold font-bold">{data.dokumen_laporan_pemeliharaan?.length || 0} file</span></p>
                </>
              )}
            </div>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default ReportForm;

