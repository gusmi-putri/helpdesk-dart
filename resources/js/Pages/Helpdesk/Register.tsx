import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff, UserPlus, ShieldCheck, ArrowLeft } from 'lucide-react';

interface RegisterData {
  username: string;
  password: string;
  nama_lengkap: string;
  nrp_nip: string;
  asal_satuan: string;
  no_wa: string;
}

const Register: React.FC = () => {
  const { data, setData, post, processing, errors } = useForm<RegisterData>({
    username: '',
    password: '',
    nama_lengkap: '',
    nrp_nip: '',
    asal_satuan: '',
    no_wa: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand dark:bg-gunmetal relative overflow-hidden font-sans w-full py-12 px-4">

      {/* Background Ornaments (Radar/Grid illusion) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-olive rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-olive rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-olive rounded-full" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-olive" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-olive" />
      </div>

      {/* Register Card Panel */}
      <div className="relative z-10 w-full max-w-2xl p-8 glass-panel border-t-4 border-t-olive rounded-sm bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-2xl">

        <div className="flex justify-between items-start mb-8">
          <Link href="/login" className="text-gray-500 hover:text-olive transition-colors flex items-center gap-2 text-xs font-mono font-bold uppercase">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <div className="text-right">
            <h2 className="text-2xl font-tactical text-gunmetal dark:text-white font-bold tracking-widest mb-1">
              REGISTRASI PELAPOR
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-[10px] font-mono tracking-wider uppercase">
              SISTEM HELPDESK DART
            </p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-olive/10 border-l-4 border-olive flex items-center gap-4">
          <ShieldCheck className="w-8 h-8 text-olive shrink-0" />
          <p className="text-xs text-gunmetal dark:text-gray-300 font-mono leading-relaxed">
            Pendaftaran ini hanya untuk akun **PELAPOR**. Akun baru akan melalui proses verifikasi dan persetujuan Admin sebelum dapat digunakan untuk login.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-gray-600 dark:text-gray-400 text-[10px] font-mono font-bold mb-2 tracking-widest uppercase">
                Username / ID Akses
              </label>
              <input
                type="text"
                value={data.username}
                onChange={(e) => setData('username', e.target.value)}
                className={`w-full bg-white/40 dark:bg-black/40 border ${errors.username ? 'border-targetred' : 'border-gray-300 dark:border-gray-700'} text-gunmetal dark:text-white px-4 py-2.5 focus:outline-none focus:border-olive transition-colors font-mono text-sm`}
                placeholder="ID UNIK..."
                required
              />
              {errors.username && <p className="mt-1 text-targetred text-[9px] font-mono uppercase italic">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-600 dark:text-gray-400 text-[10px] font-mono font-bold mb-2 tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className={`w-full bg-white/40 dark:bg-black/40 border ${errors.password ? 'border-targetred' : 'border-gray-300 dark:border-gray-700'} text-gunmetal dark:text-white px-4 py-2.5 focus:outline-none focus:border-olive transition-colors font-mono text-sm ${!showPassword ? 'tracking-widest' : ''}`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-olive transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-targetred text-[9px] font-mono uppercase italic">{errors.password}</p>}
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-gray-600 dark:text-gray-400 text-[10px] font-mono font-bold mb-2 tracking-widest uppercase">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={data.nama_lengkap}
                onChange={(e) => setData('nama_lengkap', e.target.value)}
                className={`w-full bg-white/40 dark:bg-black/40 border ${errors.nama_lengkap ? 'border-targetred' : 'border-gray-300 dark:border-gray-700'} text-gunmetal dark:text-white px-4 py-2.5 focus:outline-none focus:border-olive transition-colors font-mono text-sm`}
                placeholder="NAMA LENGKAP..."
                required
              />
              {errors.nama_lengkap && <p className="mt-1 text-targetred text-[9px] font-mono uppercase italic">{errors.nama_lengkap}</p>}
            </div>

            {/* NRP / NIP */}
            <div>
              <label className="block text-gray-600 dark:text-gray-400 text-[10px] font-mono font-bold mb-2 tracking-widest uppercase">
                NRP / NIP
              </label>
              <input
                type="text"
                value={data.nrp_nip}
                onChange={(e) => setData('nrp_nip', e.target.value)}
                className={`w-full bg-white/40 dark:bg-black/40 border ${errors.nrp_nip ? 'border-targetred' : 'border-gray-300 dark:border-gray-700'} text-gunmetal dark:text-white px-4 py-2.5 focus:outline-none focus:border-olive transition-colors font-mono text-sm`}
                placeholder="NOMOR IDENTITAS..."
                required
              />
              {errors.nrp_nip && <p className="mt-1 text-targetred text-[9px] font-mono uppercase italic">{errors.nrp_nip}</p>}
            </div>

            {/* Asal Satuan */}
            <div>
              <label className="block text-gray-600 dark:text-gray-400 text-[10px] font-mono font-bold mb-2 tracking-widest uppercase">
                Asal Satuan
              </label>
              <input
                type="text"
                value={data.asal_satuan}
                onChange={(e) => setData('asal_satuan', e.target.value)}
                className={`w-full bg-white/40 dark:bg-black/40 border ${errors.asal_satuan ? 'border-targetred' : 'border-gray-300 dark:border-gray-700'} text-gunmetal dark:text-white px-4 py-2.5 focus:outline-none focus:border-olive transition-colors font-mono text-sm`}
                placeholder="UNIT / SATUAN..."
                required
              />
              {errors.asal_satuan && <p className="mt-1 text-targetred text-[9px] font-mono uppercase italic">{errors.asal_satuan}</p>}
            </div>

            {/* No WA */}
            <div>
              <label className="block text-gray-600 dark:text-gray-400 text-[10px] font-mono font-bold mb-2 tracking-widest uppercase">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                value={data.no_wa}
                onChange={(e) => setData('no_wa', e.target.value)}
                className={`w-full bg-white/40 dark:bg-black/40 border ${errors.no_wa ? 'border-targetred' : 'border-gray-300 dark:border-gray-700'} text-gunmetal dark:text-white px-4 py-2.5 focus:outline-none focus:border-olive transition-colors font-mono text-sm`}
                placeholder="CONTOH: 08123456789..."
                required
              />
              {errors.no_wa && <p className="mt-1 text-targetred text-[9px] font-mono uppercase italic">{errors.no_wa}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-olive hover:bg-camogreen text-white font-tactical font-bold py-4 px-6 rounded-sm transition-all duration-300 uppercase tracking-[0.3em] flex justify-center items-center group relative overflow-hidden shadow-lg mt-4"
          >
            <span className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            <span className="relative flex items-center gap-3">
              <UserPlus className="w-5 h-5" />
              {processing ? 'MEMPROSES...' : 'AJUKAN PENDAFTARAN'}
            </span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-800 text-center">
          <p className="text-gray-600 dark:text-gray-500 text-[10px] font-mono uppercase">
            PASTIKAN DATA YANG DIISI BENAR UNTUK MEMPERCEPAT PROSES VERIFIKASI ADMIN.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
