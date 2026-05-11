import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { useStore } from '@/store/useStore';
import { Eye, EyeOff } from 'lucide-react';

interface LoginData {
  username: string;
  password: string;
  auth?: string;
}

const Login: React.FC = () => {
  const loginAction = useStore((state) => state.login);

  const { data, setData, post, processing, errors } = useForm<LoginData>({
    username: '',
    password: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-sand dark:bg-gunmetal relative overflow-hidden font-sans w-full">

      {/* Background Ornaments (Radar/Grid illusion) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-olive rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-olive rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-olive rounded-full" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-olive" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-olive" />
      </div>

      {/* Login Card Panel */}
      <div className="relative z-10 w-full max-w-md p-8 glass-panel border-t-4 border-t-targetred rounded-sm">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-tactical text-gunmetal dark:text-white font-bold tracking-widest mb-2 drop-shadow-sm">
            MASUK KE SISTEM
          </h2>
          <p className="text-soft-gunmetal/60 dark:text-soft-sand/40 text-sm font-sans tracking-wide uppercase font-bold text-[10px]">
            AKSES PUSAT KOMANDO HELPDESK-DART
          </p>
        </div>

        {/* Notifikasi Error */}
        {errors.auth && (
          <div className="mb-6 p-3 bg-red-900/40 border border-targetred text-targetred text-sm font-mono flex items-start">
            <span className="mr-2">❌</span>
            <span>{errors.auth}</span>
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
            <label className="block text-soft-gunmetal/60 dark:text-soft-sand/40 text-[10px] font-mono font-bold mb-2 tracking-widest uppercase">
              Nama Pengguna
            </label>
            <input
              type="text"
              value={data.username}
              onChange={(e) => setData('username', e.target.value)}
              className={`w-full bg-sand/10 dark:bg-black/60 border ${errors.auth ? 'border-targetred' : 'border-soft-gunmetal/20 dark:border-soft-sand/10'} text-gunmetal dark:text-white px-4 py-3 focus:outline-none focus:border-olive transition-colors font-mono rounded-sm`}
              placeholder="NAMA PENGGUNA..."
              required
            />
            {errors.username && (
              <p className="mt-1 text-targetred text-[10px] font-mono uppercase italic">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label className="block text-soft-gunmetal/60 dark:text-soft-sand/40 text-[10px] font-mono font-bold mb-2 tracking-widest uppercase">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className={`w-full bg-sand/10 dark:bg-black/60 border ${errors.auth ? 'border-targetred' : 'border-soft-gunmetal/20 dark:border-soft-sand/10'} text-gunmetal dark:text-white px-4 py-3 focus:outline-none focus:border-olive transition-colors font-mono rounded-sm ${!showPassword ? 'tracking-[0.2em]' : ''}`}
                placeholder="KATA SANDI..."
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gunmetal/60 dark:text-soft-sand/60 hover:text-gunmetal dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-targetred text-[10px] font-mono uppercase italic">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-targetred hover:bg-[#8B152A] text-sand font-tactical font-bold py-4 px-4 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center group relative overflow-hidden shadow-lg"
          >
            {/* Subtle sweep animation on hover */}
            <span className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative">
              {processing ? 'MENGHUBUNGKAN...' : 'Masuk ke Sistem'}
            </span>
          </button>
          <div className="mt-6 text-center">
            <p className="text-soft-gunmetal/60 dark:text-soft-sand/40 text-[10px] font-mono uppercase tracking-widest">
              Belum punya akun?{' '}
              <Link href="/register" className="text-targetred hover:text-red-500 font-bold transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-soft-gunmetal/10 dark:border-soft-sand/5 text-center">
          <p className="text-soft-gunmetal/40 dark:text-soft-sand/20 text-[9px] font-mono uppercase tracking-widest">
            Helpdesk-DART Operational Security System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
