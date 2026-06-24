import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, ComboboxButton } from '@headlessui/react';
import { Eye, EyeOff, UserPlus, ShieldCheck, ArrowLeft, User, Mail, Lock, IdCard, MapPin, Phone, Info, ChevronDown } from 'lucide-react';
import axios from 'axios';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  nama_lengkap: string;
  nrp_nip: string;
  asal_satuan: string;
  no_wa: string;
}

const Register: React.FC = () => {
  const { data, setData, post, processing, errors } = useForm<RegisterData>({
    username: '',
    email: '',
    password: '',
    nama_lengkap: '',
    nrp_nip: '',
    asal_satuan: '',
    no_wa: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [waWarning, setWaWarning] = useState('');
  
  const [satuans, setSatuans] = useState<any[]>([]);
  const [satuanQuery, setSatuanQuery] = useState('');

  useEffect(() => {
    axios.get('/api/satuans').then(res => setSatuans(res.data)).catch(console.error);
  }, []);

  const normalizeString = (str: string) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(.)\1+/g, '$1');
  };

  const filteredSatuans = satuanQuery === ''
    ? satuans
    : satuans.filter((satuan) => {
        const normalizedSatuan = normalizeString(satuan.nama_satuan);
        const normalizedQuery = normalizeString(satuanQuery);
        return normalizedSatuan.includes(normalizedQuery) || 
               satuan.nama_satuan.toLowerCase().includes(satuanQuery.toLowerCase());
      });

  // Strict numeric input handler
  const handleNumericInput = (field: keyof RegisterData, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setData(field, numericValue);
  };

  // Strict uppercase input handler for unit name
  const handleUppercaseInput = (field: keyof RegisterData, value: string) => {
    setData(field, value.toUpperCase());
  };

  // WhatsApp number handler — must start with 62
  const handleWaInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '');

    // Auto-prefix: if user types 0 at start, convert 08 -> 628
    let finalValue = numericValue;
    if (numericValue.startsWith('0')) {
      finalValue = '62' + numericValue.slice(1);
    }

    setData('no_wa', finalValue);

    // Live validation
    if (finalValue.length === 0) {
      setWaWarning('');
    } else if (!finalValue.startsWith('62')) {
      setWaWarning('Nomor harus diawali dengan 62. Contoh: 6281234567890');
    } else if (finalValue.length < 10) {
      setWaWarning('Nomor terlalu pendek, minimal 10 digit.');
    } else if (finalValue.length > 15) {
      setWaWarning('Nomor terlalu panjang, maksimal 15 digit.');
    } else {
      setWaWarning('');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register', {
      onError: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cighra-light dark:bg-cighra-dark relative overflow-hidden font-sans w-full py-12 px-4 selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-white">

      {/* Background Tactical Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border-[0.5px] border-cighra-primary dark:border-cighra-gold/30 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border-[0.5px] border-cighra-primary dark:border-cighra-gold/20 rounded-full" />
        <div className="absolute top-0 bottom-0 left-1/2 w-[0.5px] bg-gradient-to-b from-transparent via-olive/40 to-transparent" />
        <div className="absolute left-0 right-0 top-1/2 h-[0.5px] bg-gradient-to-r from-transparent via-olive/40 to-transparent" />
      </div>

      {/* Main Register Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-cighra-darkcard/95 backdrop-blur-xl border-x border-b border-cighra-primary dark:border-cighra-gold/20 shadow-2xl rounded-sm overflow-hidden">

        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-olive via-camogreen to-olive" />

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-6 border-b border-cighra-primary dark:border-cighra-gold/10">
            <div>
              <h2 className="text-3xl font-tactical text-slate-800 dark:text-white font-black tracking-tighter flex items-center gap-3">
                <span className="p-2 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white rounded-sm"><UserPlus className="w-6 h-6" /></span>
                REGISTRASI PELAPOR
              </h2>
              <p className="text-slate-500 dark:text-slate-300 text-[11px] font-mono tracking-[0.2em] uppercase mt-1">
                SISTEM SISFO DART
              </p>
            </div>
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 transition-all duration-300 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login
            </Link>
          </div>

          {/* Info Banner */}
          <div className="mb-8 p-4 bg-cighra-primary/5 dark:bg-cighra-gold/5 border border-cighra-primary dark:border-cighra-gold/20 flex items-start gap-4">
            <div className="mt-1 p-1 bg-cighra-primary/10 dark:bg-cighra-gold/10 rounded-full">
              <ShieldCheck className="w-4 h-4 text-cighra-primary dark:text-cighra-gold" />
            </div>
            <p className="text-[11px] text-white:text-slate-300/80 font-mono leading-relaxed">
              Pendaftaran ini khusus untuk akun <strong>PELAPOR</strong>. Akun baru akan diperiksa dan disetujui oleh Admin terlebih dahulu sebelum dapat digunakan.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-10">

            {/* Section 1: Kredensial Akses */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-cighra-primary/20 dark:bg-cighra-gold/20"></span>
                <h3 className="text-[10px] font-mono font-black text-cighra-primary dark:text-cighra-gold dark:text-camogreen uppercase tracking-[0.4em]">I. DATA AKUN</h3>
                <span className="h-px flex-1 bg-cighra-primary/20 dark:bg-cighra-gold/20"></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                    <User className="w-3 h-3" /> Nama Pengguna
                  </label>
                  <div className="group relative">
                    <input
                      type="text"
                      value={data.username}
                      onChange={(e) => setData('username', e.target.value)}
                      className={`w-full bg-soft-sand/30 dark:bg-cighra-dark/50 border ${errors.username ? 'border-cighra-primary dark:border-cighra-gold' : 'border-cighra-primary dark:border-cighra-gold/40 dark:border-cighra-primary dark:border-cighra-gold/60'} group-hover:border-camogreen focus:border-camogreen text-slate-800 dark:text-white px-4 py-3 focus:outline-none transition-all font-mono text-sm rounded-sm`}
                      placeholder="Masukkan nama pengguna..."
                      required
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 group-focus-within:w-full transition-all duration-300" />
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] text-slate-500 dark:text-slate-300 font-mono italic">Minimal 4 karakter</span>
                    {errors.username && <span className="text-[9px] text-cighra-primary dark:text-cighra-gold font-mono uppercase font-bold">{errors.username}</span>}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Alamat Email
                  </label>
                  <div className="group relative">
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className={`w-full bg-soft-sand/30 dark:bg-cighra-dark/50 border ${errors.email ? 'border-cighra-primary dark:border-cighra-gold' : 'border-cighra-primary dark:border-cighra-gold/40 dark:border-cighra-primary dark:border-cighra-gold/60'} group-hover:border-camogreen focus:border-camogreen text-slate-800 dark:text-white px-4 py-3 focus:outline-none transition-all font-mono text-sm rounded-sm`}
                      placeholder="contoh@email.com"
                      required
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 group-focus-within:w-full transition-all duration-300" />
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] text-slate-500 dark:text-slate-300 font-mono italic">Gunakan email yang aktif.</span>
                    {errors.email && <span className="text-[9px] text-cighra-primary dark:text-cighra-gold font-mono uppercase font-bold">{errors.email}</span>}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Kata Sandi
                  </label>
                  <div className="group relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className={`w-full bg-soft-sand/30 dark:bg-cighra-dark/50 border ${errors.password ? 'border-cighra-primary dark:border-cighra-gold' : 'border-cighra-primary dark:border-cighra-gold/40 dark:border-cighra-primary dark:border-cighra-gold/60'} group-hover:border-camogreen focus:border-camogreen text-slate-800 dark:text-white px-4 py-3 pr-12 focus:outline-none transition-all font-mono text-sm rounded-sm ${!showPassword ? 'tracking-[0.3em]' : ''}`}
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-cighra-primary dark:text-cighra-gold/60 hover:text-cighra-primary dark:text-cighra-gold transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 group-focus-within:w-full transition-all duration-300" />
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] text-slate-500 dark:text-slate-300 font-mono italic flex items-center gap-1">
                      <Info className="w-2.5 h-2.5" /> Minimal 8 karakter, harus ada huruf dan angka.
                    </span>
                    {errors.password && <span className="text-[9px] text-cighra-primary dark:text-cighra-gold font-mono uppercase font-bold">{errors.password}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Identitas Personel */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-cighra-primary/20 dark:bg-cighra-gold/20"></span>
                <h3 className="text-[10px] font-mono font-black text-cighra-primary dark:text-cighra-gold dark:text-camogreen uppercase tracking-[0.4em]">II. DATA DIRI</h3>
                <span className="h-px flex-1 bg-cighra-primary/20 dark:bg-cighra-gold/20"></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                    <User className="w-3 h-3" /> Nama Lengkap
                  </label>
                  <div className="group relative">
                    <input
                      type="text"
                      value={data.nama_lengkap}
                      onChange={(e) => setData('nama_lengkap', e.target.value)}
                      className={`w-full bg-soft-sand/30 dark:bg-cighra-dark/50 border ${errors.nama_lengkap ? 'border-cighra-primary dark:border-cighra-gold' : 'border-cighra-primary dark:border-cighra-gold/40 dark:border-cighra-primary dark:border-cighra-gold/60'} group-hover:border-camogreen focus:border-camogreen text-slate-800 dark:text-white px-4 py-3 focus:outline-none transition-all font-mono text-sm rounded-sm`}
                      placeholder="Masukkan nama lengkap..."
                      required
                    />
                  </div>
                  {errors.nama_lengkap && <p className="text-[9px] text-cighra-primary dark:text-cighra-gold font-mono uppercase italic">{errors.nama_lengkap}</p>}
                </div>

                {/* NRP / NIP */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                    <IdCard className="w-3 h-3" /> NRP / NIP
                  </label>
                  <div className="group relative">
                    <input
                      type="text"
                      value={data.nrp_nip}
                      onChange={(e) => handleNumericInput('nrp_nip', e.target.value)}
                      maxLength={20}
                      className={`w-full bg-soft-sand/30 dark:bg-cighra-dark/50 border ${errors.nrp_nip ? 'border-cighra-primary dark:border-cighra-gold' : 'border-cighra-primary dark:border-cighra-gold/40 dark:border-cighra-primary dark:border-cighra-gold/60'} group-hover:border-camogreen focus:border-camogreen text-slate-800 dark:text-white px-4 py-3 focus:outline-none transition-all font-mono text-sm rounded-sm`}
                      placeholder="Contoh: 21030145"
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] text-slate-500 dark:text-slate-300 font-mono italic">Isi dengan angka saja, 8-20 digit.</span>
                    {errors.nrp_nip && <span className="text-[9px] text-cighra-primary dark:text-cighra-gold font-mono uppercase font-bold">{errors.nrp_nip}</span>}
                  </div>
                </div>

                {/* Asal Satuan */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Asal Satuan Kerja
                  </label>
                  <div className="group relative">
                    <Combobox value={data.asal_satuan} onChange={(val: string | null) => val && setData('asal_satuan', val)}>
                      <div className="relative">
                        <ComboboxInput
                          className={`w-full bg-soft-sand/30 dark:bg-cighra-dark/50 border ${errors.asal_satuan ? 'border-cighra-primary dark:border-cighra-gold' : 'border-cighra-primary dark:border-cighra-gold/40 dark:border-cighra-primary dark:border-cighra-gold/60'} group-hover:border-camogreen focus:border-camogreen text-slate-800 dark:text-white px-4 py-3 pr-10 focus:outline-none transition-all font-mono text-sm rounded-sm`}
                          placeholder="PILIH ATAU KETIK SATUAN BARU..."
                          displayValue={(item: string) => item}
                          onChange={(event) => {
                            setSatuanQuery(event.target.value);
                            setData('asal_satuan', event.target.value.toUpperCase());
                          }}
                          required
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        </ComboboxButton>
                      </div>
                      <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm font-mono border border-slate-200 dark:border-slate-700">
                        {filteredSatuans.length === 0 && satuanQuery !== '' ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-slate-700 dark:text-slate-300">
                            Tekan Enter untuk menambah "{satuanQuery.toUpperCase()}"
                          </div>
                        ) : (
                          filteredSatuans.map((satuan) => (
                            <ComboboxOption
                              key={satuan.id}
                              value={satuan.nama_satuan}
                              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-slate-900 dark:text-slate-100 data-focus:bg-cighra-primary data-focus:text-white dark:data-focus:bg-cighra-gold dark:data-focus:text-slate-900 cursor-pointer"
                            >
                              <span className="block truncate font-normal group-data-selected:font-semibold">
                                {satuan.nama_satuan}
                              </span>
                            </ComboboxOption>
                          ))
                        )}
                        {satuanQuery !== '' && !filteredSatuans.some(s => s.nama_satuan.toLowerCase() === satuanQuery.toLowerCase()) && (
                           <ComboboxOption
                             value={satuanQuery.toUpperCase()}
                             className="group relative cursor-default select-none py-2 pl-3 pr-9 text-cighra-primary font-bold dark:text-cighra-gold data-focus:bg-cighra-primary data-focus:text-white dark:data-focus:bg-cighra-gold dark:data-focus:text-slate-900 cursor-pointer border-t border-slate-100 dark:border-slate-700 mt-1"
                           >
                             + Tambahkan Satuan "{satuanQuery.toUpperCase()}"
                           </ComboboxOption>
                        )}
                      </ComboboxOptions>
                    </Combobox>
                  </div>
                  {errors.asal_satuan && <p className="text-[9px] text-cighra-primary dark:text-cighra-gold font-mono uppercase italic">{errors.asal_satuan}</p>}
                </div>

                {/* No WA */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Nomor WhatsApp
                  </label>
                  <div className="group relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cighra-primary dark:text-cighra-gold/70 dark:text-camogreen/70 font-mono text-sm font-bold pointer-events-none">+</span>
                    <input
                      type="text"
                      value={data.no_wa}
                      onChange={(e) => handleWaInput(e.target.value)}
                      maxLength={15}
                      className={`w-full bg-soft-sand/30 dark:bg-cighra-dark/50 border ${errors.no_wa || waWarning ? 'border-yellow-500 dark:border-yellow-400' : 'border-cighra-primary dark:border-cighra-gold/40 dark:border-cighra-primary dark:border-cighra-gold/60'} group-hover:border-camogreen focus:border-camogreen text-slate-800 dark:text-white pl-8 pr-4 py-3 focus:outline-none transition-all font-mono text-sm rounded-sm`}
                      placeholder="6281234567890"
                      required
                    />
                  </div>
                  {waWarning && (
                    <p className="text-[9px] text-yellow-600 dark:text-yellow-400 font-mono font-bold flex items-center gap-1 px-1">
                      <Info className="w-3 h-3 shrink-0" /> {waWarning}
                    </p>
                  )}
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] text-slate-500 dark:text-slate-300 font-mono italic">Awali dengan 62, angka saja. Contoh: 6281234567890</span>
                    {errors.no_wa && <span className="text-[9px] text-cighra-primary dark:text-cighra-gold font-mono uppercase font-bold">{errors.no_wa}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white font-tactical font-black py-5 px-6 rounded-sm transition-all duration-500 uppercase tracking-[0.5em] flex justify-center items-center group relative overflow-hidden shadow-[0_0_20px_rgba(75,83,32,0.3)] hover:shadow-[0_0_30px_rgba(75,83,32,0.5)]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                <span className="relative flex items-center gap-4 text-lg">
                  {processing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      MENGIRIM DATA...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-6 h-6" />
                      DAFTAR SEKARANG
                    </>
                  )}
                </span>
              </button>
              <p className="text-center mt-6 text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-cighra-primary dark:text-cighra-gold hover:text-camogreen font-black underline underline-offset-4">Masuk di sini</Link>
              </p>
            </div>
          </form>

          {/* Footer Branding */}
          <div className="mt-12 pt-6 border-t border-cighra-primary dark:border-cighra-gold/10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cighra-primary/5 dark:bg-cighra-gold/5 border border-cighra-primary dark:border-cighra-gold/10 rounded-full">
              <ShieldCheck className="w-3 h-3 text-cighra-primary dark:text-cighra-gold" />
              <span className="text-[9px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest">
                Pastikan data yang diisi benar untuk mempercepat proses persetujuan.
              </span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default Register;
