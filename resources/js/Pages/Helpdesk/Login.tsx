import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { useStore } from '@/store/useStore';

const Login: React.FC = () => {
  const loginAction = useStore((state) => state.login);

  // State manajemen form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State untuk penanganan error & status loading/sukses
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // ==========================================
  // LOGIKA VALIDASI LOGIN DENGAN ZUSTAND
  // ==========================================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    // Simulasi delay jaringan (500ms) agar terasa nyata
    setTimeout(() => {
      // Panggil aksi login global
      const user = loginAction(username);

      if (user) {
        setSuccessMsg(`Akses Diberikan. Redirecting ke Dashboard ${user.role}...`);

        setTimeout(() => {
          router.visit(`/${user.role.toLowerCase()}`);
        }, 800);

      } else {
        setError('Akses Ditolak. Kredensial tidak valid atau tidak diizinkan.');
        setIsLoading(false);
      }
    }, 500);
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
          <h2 className="text-3xl font-tactical text-gunmetal dark:text-white font-bold tracking-widest mb-2 shadow-black drop-shadow-md">
            LOGIN HELPDESK DART
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-mono tracking-wide">
            MASUKKAN USERNAME DAN PASSWORD YANG BENAR
          </p>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/40 border border-targetred text-targetred text-sm font-mono flex items-start">
            <span className="mr-2">❌</span>
            <span>{error}</span>
          </div>
        )}

        {/* Notifikasi Sukses */}
        {successMsg && (
          <div className="mb-6 p-3 bg-camogreen/30 border border-camogreen text-green-400 text-sm font-mono flex items-start">
            <span className="mr-2">✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/60 dark:bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 text-gunmetal dark:text-white px-4 py-3 focus:outline-none focus:border-camogreen focus:ring-1 focus:ring-camogreen transition-colors font-mono"
              placeholder="Masukkan ID..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/60 dark:bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 text-gunmetal dark:text-white px-4 py-3 focus:outline-none focus:border-camogreen focus:ring-1 focus:ring-camogreen transition-colors font-mono tracking-[0.2em]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-targetred hover:bg-red-700 text-gunmetal dark:text-white font-tactical font-bold py-3 px-4 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center group relative overflow-hidden"
          >
            {/* Subtle sweep animation on hover */}
            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative">
              {isLoading ? 'LOGIN...' : 'LOGIN'}
            </span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-800 text-center">
          <p className="text-gray-600 dark:text-gray-500 text-xs font-mono">
            SISTEM PELAPORAN HELPDESK DART. <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
