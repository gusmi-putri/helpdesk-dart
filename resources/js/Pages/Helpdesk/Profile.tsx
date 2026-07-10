import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, UserCog, KeyRound, Save, Info, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/store/useStore';
import GlobalNotification from '@/Components/GlobalNotification';

const Profile = ({ currentUser }: any) => {
  const addNotification = useStore((state) => state.addNotification);

  const [waWarning, setWaWarning] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile Form
  const profileForm = useForm({
    nama_lengkap: currentUser?.name || currentUser?.nama_lengkap || '',
    nrp_nip: currentUser?.nrp_nip || '',
    email: currentUser?.email || '',
    no_wa: currentUser?.no_wa || '',
    spesialisasi: currentUser?.spesialisasi || '',
  });

  // Password Form
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleNumericInput = (field: string, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    profileForm.setData(field as any, numericValue);
  };

  const handleWaInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    let finalValue = numericValue;
    if (numericValue.startsWith('0')) {
      finalValue = '62' + numericValue.slice(1);
    }
    profileForm.setData('no_wa', finalValue);

    if (finalValue.length === 0) {
      setWaWarning('');
    } else if (!finalValue.startsWith('62')) {
      setWaWarning('Nomor harus diawali dengan 62.');
    } else if (finalValue.length < 10) {
      setWaWarning('Nomor terlalu pendek, minimal 10 digit.');
    } else if (finalValue.length > 15) {
      setWaWarning('Nomor terlalu panjang, maksimal 15 digit.');
    } else {
      setWaWarning('');
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waWarning) return;
    
    // @ts-expect-error
    profileForm.put(route('profile.update'), {
      preserveScroll: true,
      onSuccess: () => {
        addNotification('Profil berhasil diperbarui!');
      },
      onError: (err) => {
        if(err.error) {
           addNotification(`Gagal: ${err.error}`);
        } else {
           addNotification('Gagal memperbarui profil. Periksa kembali input Anda.');
        }
      }
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // @ts-ignore
    passwordForm.put(route('profile.password.update'), {
      preserveScroll: true,
      onSuccess: () => {
        addNotification('Kata sandi berhasil diubah!');
        passwordForm.reset();
      },
      onError: (err) => {
         const firstError = Object.values(err)[0] || 'Gagal mengubah kata sandi.';
         addNotification(`Gagal: ${firstError}`);
      }
    });
  };

  // Determine Dashboard Link based on Role
  const dashboardLink = currentUser?.role?.nama_role === 'Admin' ? '/admin' : 
                        currentUser?.role?.nama_role === 'Staf' ? '/staf' : 
                        currentUser?.role?.nama_role === 'Pelapor' ? '/pelapor' : 
                        currentUser?.role?.nama_role === 'Teknisi' ? '/teknisi' : '/';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-cighra-dark font-sans text-slate-800 dark:text-slate-200">
      <Head title="Pengaturan Profil - DART Helpdesk" />
      <GlobalNotification />
      
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-cighra-darkcard flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link 
            href={dashboardLink}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-tactical font-bold tracking-wider text-slate-600 dark:text-slate-400 hover:text-cighra-primary dark:hover:text-cighra-gold transition-colors bg-slate-100 dark:bg-slate-800/50 rounded-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            KEMBALI KE DASHBOARD
          </Link>
        </div>
        
        <div className="flex items-center gap-0 border border-slate-200/20 dark:border-slate-700/50 rounded shadow-sm bg-black/5 dark:bg-cighra-dark/40 overflow-hidden">
          <div className="px-4 py-1.5 text-right flex flex-col justify-center border-r border-slate-200/20 dark:border-slate-700/50">
            <span className="block text-xs font-bold text-slate-800 dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || currentUser?.nama_lengkap}</span>
            <span className="block text-[9px] font-mono tracking-widest text-cighra-primary dark:text-cighra-gold uppercase">{currentUser?.role?.nama_role || 'Pengguna'}</span>
          </div>
          <div className="w-10 h-full bg-black/10 dark:bg-black/20 flex items-center justify-center p-2">
            <UserCog className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <UserCog className="w-5 h-5 text-cighra-primary dark:text-cighra-gold" />
              <h2 className="text-sm font-tactical font-bold tracking-widest text-slate-800 dark:text-white uppercase">Informasi Data Diri</h2>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* LOCKED FIELDS */}
                <div className="flex flex-col col-span-2">
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Username (LOCKED)</label>
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-3 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-400 dark:text-slate-500 italic flex items-center gap-2 rounded-sm">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    {currentUser?.username || '-'}
                  </div>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Satuan (LOCKED)</label>
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-3 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-400 dark:text-slate-500 italic flex items-center gap-2 rounded-sm uppercase">
                    {currentUser?.satuan?.nama_satuan || currentUser?.asal_satuan || '-'}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Hak Akses / Role (LOCKED)</label>
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-3 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-400 dark:text-slate-500 italic flex items-center gap-2 rounded-sm uppercase">
                    {currentUser?.role?.nama_role || currentUser?.role || '-'}
                  </div>
                </div>

                <hr className="col-span-2 border-slate-200 dark:border-slate-800 my-2" />

                {/* EDITABLE FIELDS */}
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Nama Lengkap</label>
                  <input
                    type="text"
                    value={profileForm.data.nama_lengkap}
                    onChange={(e) => profileForm.setData('nama_lengkap', e.target.value)}
                    className={`w-full bg-white dark:bg-slate-900/50 border ${profileForm.errors.nama_lengkap ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
                    required
                    maxLength={100}
                  />
                  {profileForm.errors.nama_lengkap && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{profileForm.errors.nama_lengkap}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">NRP / NIP</label>
                  <input
                    type="text"
                    value={profileForm.data.nrp_nip}
                    onChange={(e) => handleNumericInput('nrp_nip', e.target.value)}
                    maxLength={20}
                    className={`w-full bg-white dark:bg-slate-900/50 border ${profileForm.errors.nrp_nip ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none uppercase rounded-sm`}
                    placeholder="HANYA ANGKA, 8-20 DIGIT"
                    required
                    minLength={8}
                  />
                  {profileForm.errors.nrp_nip && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{profileForm.errors.nrp_nip}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.data.email}
                    onChange={(e) => profileForm.setData('email', e.target.value)}
                    className={`w-full bg-white dark:bg-slate-900/50 border ${profileForm.errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
                    required
                    placeholder="EMAIL AKTIF"
                  />
                  {profileForm.errors.email && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{profileForm.errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">WhatsApp Connection</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm font-bold pointer-events-none">+</span>
                    <input
                      type="text"
                      value={profileForm.data.no_wa}
                      onChange={(e) => handleWaInput(e.target.value)}
                      maxLength={15}
                      className={`w-full bg-white dark:bg-slate-900/50 border ${profileForm.errors.no_wa || waWarning ? 'border-yellow-500/50' : 'border-slate-300 dark:border-slate-700'} pl-8 pr-3 py-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
                      placeholder="6281234567890"
                    />
                  </div>
                  {waWarning && (
                    <p className="text-[9px] text-yellow-600 dark:text-yellow-500 font-mono font-bold flex items-center gap-1 mt-1">
                      <Info className="w-3 h-3 shrink-0" /> {waWarning}
                    </p>
                  )}
                  {profileForm.errors.no_wa && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{profileForm.errors.no_wa}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
                    Specialization {currentUser?.role?.nama_role?.toLowerCase() !== 'teknisi' && '(TECH ONLY)'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.data.spesialisasi}
                    onChange={(e) => profileForm.setData('spesialisasi', e.target.value)}
                    disabled={currentUser?.role?.nama_role?.toLowerCase() !== 'teknisi'}
                    className={`w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all rounded-sm ${currentUser?.role?.nama_role?.toLowerCase() !== 'teknisi' ? 'opacity-40 cursor-not-allowed italic' : 'dark:text-white'}`}
                    placeholder={currentUser?.role?.nama_role?.toLowerCase() !== 'teknisi' ? 'NON-TEKNISI' : 'MISAL: JARINGAN / HARDWARE'}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={profileForm.processing}
                  className="flex items-center gap-2 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-6 py-3 font-tactical font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md rounded-sm text-sm"
                >
                  <Save className="w-4 h-4" />
                  {profileForm.processing ? 'MENYIMPAN...' : 'SIMPAN PROFIL'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Password Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-cighra-primary dark:text-cighra-gold" />
              <h2 className="text-sm font-tactical font-bold tracking-widest text-slate-800 dark:text-white uppercase">Ganti Kata Sandi</h2>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Kata Sandi Saat Ini</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.data.current_password}
                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                    className={`w-full bg-white dark:bg-slate-900/50 border ${passwordForm.errors.current_password ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.errors.current_password && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{passwordForm.errors.current_password}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.data.password}
                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                    className={`w-full bg-white dark:bg-slate-900/50 border ${passwordForm.errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm pr-10`}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.errors.password && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{passwordForm.errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.data.password_confirmation}
                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                    className={`w-full bg-white dark:bg-slate-900/50 border ${passwordForm.errors.password_confirmation ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm pr-10`}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.errors.password_confirmation && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{passwordForm.errors.password_confirmation}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordForm.processing}
                  className="w-full flex justify-center items-center gap-2 bg-slate-800 dark:bg-slate-700 text-white px-4 py-3 font-tactical font-bold tracking-widest hover:bg-slate-700 dark:hover:bg-slate-600 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md rounded-sm text-xs"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  {passwordForm.processing ? 'MEMPROSES...' : 'UBAH KATA SANDI'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default Profile;
