import React, { useState, useEffect, useRef } from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import { useStore } from '@/store/useStore';
import { Eye, EyeOff, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';
import Navbar from '@/Components/Navbar';

interface LoginData {
  username: string;
  password: string;
  auth?: string;
  sisa_detik?: string;
  sisa_percobaan?: string;
  locked_until?: string;
}

interface LoginProps {
  initialSisaDetik?: number;
}

const Login: React.FC<LoginProps> = ({ initialSisaDetik = 0 }) => {
  const loginAction = useStore((state) => state.login);
  const { errors: pageErrors } = usePage<any>().props;

  const { data, setData, post, processing, errors } = useForm<LoginData>({
    username: '',
    password: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(initialSisaDetik);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Ambil sisa detik dari error backend dan mulai countdown
  useEffect(() => {
    // Gunakan pageErrors karena lebih reliabel menerima response custom error
    if (pageErrors.sisa_detik) {
      const sisa = parseInt(String(pageErrors.sisa_detik), 10);
      if (sisa > 0) {
        setLockoutSeconds(sisa);
      }
    }
  }, [pageErrors.sisa_detik]);

  // Countdown timer
  useEffect(() => {
    if (lockoutSeconds > 0) {
      timerRef.current = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockoutSeconds > 0]);

  const isLockedOut = lockoutSeconds > 0;

  // Format detik ke MM:SS
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;
    setSuccessMsg('');

    post('/login', {
      onSuccess: (page) => {
        const user = (page.props.auth as any).user;
        if (user) {
          loginAction(user);
          setSuccessMsg(`Akses Diterima. Mengalihkan ke Halaman ${user.role}...`);
        }
      },
    });
  };

  // Ambil sisa percobaan dari error
  const sisaPercobaan = pageErrors.sisa_percobaan ? parseInt(String(pageErrors.sisa_percobaan), 10) : null;

  return (
    <div className="min-h-screen flex flex-col bg-cighra-light dark:bg-cighra-dark relative overflow-hidden font-sans w-full">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center pt-16 relative">

      {/* Background Ornaments (Radar/Grid illusion) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mt-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cighra-primary dark:border-cighra-gold rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cighra-primary dark:border-cighra-gold rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cighra-primary dark:border-cighra-gold rounded-full" />
        <div className="absolute top-1/2 bottom-0 left-1/2 w-px bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 -translate-y-1/2 h-full" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900" />
      </div>

      {/* Login Card Panel */}
      <div className="relative z-10 w-full max-w-md p-8 glass-panel border-t-4 border-t-targetred rounded-sm">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-tactical text-slate-800 dark:text-white font-bold tracking-widest mb-2 drop-shadow-sm">
            MASUK KE SISTEM
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-sans tracking-wide uppercase font-bold text-xs">
            AKSES PUSAT KOMANDO SISFO DART
          </p>
        </div>

        {/* Banner Lockout dengan Timer Countdown */}
        {isLockedOut && (
          <div className="mb-6 p-4 bg-red-900/50 border-2 border-red-500 dark:border-red-400 rounded-sm animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm font-mono font-bold uppercase tracking-wider">
                AKUN TERKUNCI
              </span>
            </div>
            <p className="text-red-300/80 text-xs font-mono mb-4">
              Terlalu banyak percobaan login yang gagal. Silakan tunggu sebelum mencoba lagi.
            </p>
            <div className="flex items-center justify-center gap-3 bg-black/30 rounded-sm py-3 px-4">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-3xl font-mono font-bold text-red-400 tracking-[0.3em]">
                {formatTime(lockoutSeconds)}
              </span>
            </div>
            <p className="text-center text-red-400/60 text-[10px] font-mono mt-2 uppercase tracking-widest">
              Waktu tersisa sebelum bisa mencoba lagi
            </p>
          </div>
        )}

        {/* Notifikasi Error (selain lockout) */}
        {pageErrors.auth && !isLockedOut && (
          <div className="mb-6 p-3 bg-red-900/40 border border-cighra-primary dark:border-cighra-gold text-cighra-primary dark:text-cighra-gold text-sm font-mono flex items-start">
            <span className="mr-2">❌</span>
            <span>{pageErrors.auth}</span>
          </div>
        )}

        {/* Peringatan Sisa Percobaan */}
        {sisaPercobaan !== null && sisaPercobaan > 0 && sisaPercobaan <= 3 && !isLockedOut && (
          <div className="mb-4 p-3 bg-amber-900/30 border border-amber-500/50 rounded-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-amber-300 text-xs font-mono">
              ⚠️ Peringatan: Sisa {sisaPercobaan} percobaan lagi sebelum akun terkunci selama 5 menit.
            </span>
          </div>
        )}

        {/* Notifikasi Sukses */}
        {successMsg && (
          <div className="mb-6 p-3 bg-camogreen/30 border border-camogreen text-camogreen text-sm font-mono flex items-start">
            <span className="mr-2">✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
              Nama Pengguna
            </label>
            <input
              type="text"
              value={data.username}
              onChange={(e) => setData('username', e.target.value)}
              disabled={isLockedOut}
              className={`w-full bg-cighra-light/50 dark:bg-cighra-darkcard/70 border ${errors.auth ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-300 dark:border-slate-600'} text-slate-800 dark:text-white px-4 py-3 focus:outline-none focus:border-cighra-primary dark:border-cighra-gold transition-colors font-mono rounded-sm ${isLockedOut ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="NAMA PENGGUNA..."
              required
            />
            {errors.username && (
              <p className="mt-1 text-cighra-primary dark:text-cighra-gold text-xs font-mono uppercase italic">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                disabled={isLockedOut}
                className={`w-full bg-cighra-light/50 dark:bg-cighra-darkcard/70 border ${errors.auth ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-300 dark:border-slate-600'} text-slate-800 dark:text-white px-4 py-3 focus:outline-none focus:border-cighra-primary dark:border-cighra-gold transition-colors font-mono rounded-sm ${!showPassword ? 'tracking-[0.2em]' : ''} ${isLockedOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="KATA SANDI..."
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-cighra-primary dark:text-cighra-gold text-xs font-mono uppercase italic">
                {errors.password}
              </p>
            )}
            <div className="mt-2 text-right">
              <Link href="/forgot-password" className="text-xs font-mono font-bold text-slate-500 hover:text-cighra-primary dark:text-slate-400 dark:hover:text-cighra-gold uppercase tracking-widest transition-colors">
                Lupa Kata Sandi?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing || isLockedOut}
            className={`w-full font-tactical font-bold py-4 px-4 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center group relative overflow-hidden shadow-lg ${
              isLockedOut
                ? 'bg-slate-600 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white'
            }`}
          >
            {/* Subtle sweep animation on hover */}
            {!isLockedOut && (
              <span className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            )}
            <span className="relative flex items-center gap-2">
              {isLockedOut ? (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  AKUN TERKUNCI ({formatTime(lockoutSeconds)})
                </>
              ) : processing ? (
                'MENGHUBUNGKAN...'
              ) : (
                'Masuk ke Sistem'
              )}
            </span>
          </button>

          {/* Info keamanan */}
          <div className="text-center">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-mono uppercase tracking-widest">
              Maksimal 5 percobaan login • Kunci otomatis 5 menit
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-mono uppercase tracking-widest">
              Belum punya akun?{' '}
              <Link href="/register" className="text-cighra-primary dark:text-cighra-gold hover:text-cighra-primary/80 dark:hover:text-cighra-gold/80 font-bold transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-[11px] font-mono uppercase tracking-widest">
            SISFO DART Operational Security System
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
