import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, UserCog, Save, Info } from 'lucide-react';
import { useStore } from '@/store/useStore';
import GlobalNotification from '@/Components/GlobalNotification';

const Profile = ({ currentUser }: any) => {
  const addNotification = useStore((state) => state.addNotification);

  const [waWarning, setWaWarning] = useState('');

  // Profile Form
  const profileForm = useForm({
    nama_lengkap: currentUser?.name || currentUser?.nama_lengkap || '',
    nrp_nip: currentUser?.nrp_nip || '',
    email: currentUser?.email || '',
    no_wa: currentUser?.no_wa || '',
    spesialisasi: currentUser?.spesialisasi || '',
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

  // Determine Dashboard Link based on Role
  const dashboardLink = currentUser?.role?.nama_role === 'Admin' ? '/admin' : 
                        currentUser?.role?.nama_role === 'Staf' ? '/staf' : 
                        currentUser?.role?.nama_role === 'Pelapor' ? '/pelapor' : 
                        currentUser?.role?.nama_role === 'Teknisi' ? '/teknisi' : '/';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-cighra-dark font-sans text-slate-800 dark:text-slate-200">
      <Head title="Pengaturan Profil - DART Helpdesk" />
      <GlobalNotification />
      
      {/* Top Header */}
      <header className="h-16 border-b border-cighra-primary/10 dark:border-cighra-gold/20 bg-cighra-primary dark:bg-cighra-darkcard flex items-center justify-between px-4 md:px-8 shadow-md relative z-10">
        <div className="flex items-center gap-4">
          <Link 
            href={dashboardLink}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-tactical font-bold tracking-wider text-white dark:text-slate-300 hover:text-white dark:hover:text-cighra-gold transition-colors bg-white/10 dark:bg-slate-700/50 hover:bg-white/20 rounded-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            KEMBALI KE DASHBOARD
          </Link>
        </div>
        
        <div className="flex items-center gap-0 border border-white/10 dark:border-slate-700 rounded shadow-sm bg-black/10 dark:bg-slate-900/50 overflow-hidden">
          <div className="px-4 py-1.5 text-right flex flex-col justify-center border-r border-white/10 dark:border-slate-700">
            <span className="block text-xs font-bold text-white dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || currentUser?.nama_lengkap}</span>
            <span className="block text-[11px] font-mono tracking-widest text-cighra-gold uppercase">{currentUser?.role?.nama_role || 'Pengguna'}</span>
          </div>
          <div className="w-10 h-full bg-white/5 dark:bg-slate-800 flex items-center justify-center p-2">
            <UserCog className="w-6 h-6 text-white/70 dark:text-slate-400" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Banner Profil */}
        <div className="bg-cighra-primary dark:bg-cighra-darkcard border-l-4 border-cighra-gold p-6 rounded-sm shadow-md border-y border-r border-y-cighra-primary border-r-cighra-primary dark:border-y-slate-700 dark:border-r-slate-700 flex items-center gap-4">
           <div className="w-16 h-16 rounded-full bg-white/10 dark:bg-slate-700 flex items-center justify-center border-2 border-white/20 dark:border-slate-600 shadow-sm shrink-0">
             <UserCog className="w-8 h-8 text-white/80 dark:text-slate-400" />
           </div>
           <div>
             <h2 className="text-xl font-bold font-tactical tracking-widest text-white">PENGATURAN PROFIL</h2>
             <p className="text-sm font-mono text-white/70 dark:text-slate-400 mt-1 uppercase tracking-wider">Lengkapi dan Perbarui Data Diri Anda</p>
           </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700 rounded-sm shadow-md overflow-hidden relative">
          {/* Yellow Accent at top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-cighra-primary dark:bg-cighra-gold"></div>
          
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 mt-1">
            <Info className="w-4 h-4 text-cighra-primary dark:text-cighra-gold" />
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-800 dark:text-white uppercase">Data Akun & Personal</h3>
          </div>
          
          <form onSubmit={handleProfileSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* LOCKED FIELDS */}
              <div className="flex flex-col col-span-2">
                <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
                  <span>Username</span>
                  <span className="text-slate-400 dark:text-slate-500 italic">(Terkunci)</span>
                </label>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-400 dark:text-slate-500 italic flex items-center gap-2 rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500"></span>
                  {currentUser?.username || '-'}
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
                  <span>Satuan</span>
                  <span className="text-slate-400 dark:text-slate-500 italic">(Terkunci)</span>
                </label>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-400 dark:text-slate-500 italic flex items-center gap-2 rounded-sm uppercase">
                  {currentUser?.satuan?.nama_satuan || currentUser?.asal_satuan || '-'}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
                  <span>Hak Akses</span>
                  <span className="text-slate-400 dark:text-slate-500 italic">(Terkunci)</span>
                </label>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-400 dark:text-slate-500 italic flex items-center gap-2 rounded-sm uppercase text-cighra-primary dark:text-cighra-gold">
                  {currentUser?.role?.nama_role || currentUser?.role || '-'}
                </div>
              </div>

              <div className="col-span-2 hidden md:block border-t border-dashed border-slate-200 dark:border-slate-700 my-2"></div>

              {/* EDITABLE FIELDS */}
              <div className="col-span-2 mt-4 md:mt-0">
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 tracking-widest uppercase">Nama Lengkap</label>
                <input
                  type="text"
                  value={profileForm.data.nama_lengkap}
                  onChange={(e) => profileForm.setData('nama_lengkap', e.target.value)}
                  className={`w-full bg-white dark:bg-black/20 border ${profileForm.errors.nama_lengkap ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-bold font-sans focus:border-cighra-primary dark:focus:border-cighra-gold outline-none transition-all dark:text-white rounded-sm shadow-sm`}
                  required
                  maxLength={100}
                />
                {profileForm.errors.nama_lengkap && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{profileForm.errors.nama_lengkap}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 tracking-widest uppercase">NRP / NIP</label>
                <input
                  type="text"
                  value={profileForm.data.nrp_nip}
                  onChange={(e) => handleNumericInput('nrp_nip', e.target.value)}
                  maxLength={20}
                  className={`w-full bg-white dark:bg-black/20 border ${profileForm.errors.nrp_nip ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono font-bold focus:border-cighra-primary dark:focus:border-cighra-gold outline-none uppercase rounded-sm shadow-sm`}
                  placeholder="8-20 DIGIT ANGKA"
                  required
                  minLength={8}
                />
                {profileForm.errors.nrp_nip && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{profileForm.errors.nrp_nip}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 tracking-widest uppercase">Email Address</label>
                <input
                  type="email"
                  value={profileForm.data.email}
                  onChange={(e) => profileForm.setData('email', e.target.value)}
                  className={`w-full bg-white dark:bg-black/20 border ${profileForm.errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono font-bold focus:border-cighra-primary dark:focus:border-cighra-gold outline-none transition-all dark:text-white rounded-sm shadow-sm`}
                  required
                  placeholder="EMAIL AKTIF"
                />
                {profileForm.errors.email && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{profileForm.errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 tracking-widest uppercase">NO WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm font-bold pointer-events-none">+</span>
                  <input
                    type="text"
                    value={profileForm.data.no_wa}
                    onChange={(e) => handleWaInput(e.target.value)}
                    maxLength={15}
                    className={`w-full bg-white dark:bg-black/20 border ${profileForm.errors.no_wa || waWarning ? 'border-yellow-500' : 'border-slate-300 dark:border-slate-700'} pl-8 pr-3 py-3 text-sm font-mono font-bold focus:border-cighra-primary dark:focus:border-cighra-gold outline-none transition-all dark:text-white rounded-sm shadow-sm`}
                    placeholder="6281234567890"
                  />
                </div>
                {waWarning && (
                  <p className="text-[11px] text-yellow-600 dark:text-yellow-500 font-mono font-bold flex items-center gap-1 mt-1.5">
                    <Info className="w-3 h-3 shrink-0" /> {waWarning}
                  </p>
                )}
                {profileForm.errors.no_wa && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{profileForm.errors.no_wa}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 tracking-widest uppercase">
                  Spesialisasi {currentUser?.role?.nama_role?.toLowerCase() !== 'teknisi' && '(TEKNISI SAJA)'}
                </label>
                <input
                  type="text"
                  value={profileForm.data.spesialisasi}
                  onChange={(e) => profileForm.setData('spesialisasi', e.target.value)}
                  disabled={currentUser?.role?.nama_role?.toLowerCase() !== 'teknisi'}
                  className={`w-full bg-white dark:bg-black/20 border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono font-bold focus:border-cighra-primary dark:focus:border-cighra-gold outline-none transition-all rounded-sm shadow-sm ${currentUser?.role?.nama_role?.toLowerCase() !== 'teknisi' ? 'opacity-40 cursor-not-allowed italic' : 'dark:text-white'}`}
                  placeholder={currentUser?.role?.nama_role?.toLowerCase() !== 'teknisi' ? 'NON-TEKNISI' : 'MISAL: KOMUNIKASI SATELIT'}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-200 dark:border-slate-700 pt-6">
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">* Pastikan data NIP dan WhatsApp Anda terhubung aktif.</p>
              <button
                type="submit"
                disabled={profileForm.processing}
                className="w-full md:w-auto flex justify-center items-center gap-2 bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:text-slate-900 dark:hover:bg-yellow-400 text-white px-8 py-3.5 font-tactical font-bold tracking-widest transition-all disabled:opacity-50 shadow-lg rounded-sm text-sm"
              >
                <Save className="w-4 h-4" />
                {profileForm.processing ? 'MENYIMPAN...' : 'SIMPAN PROFIL'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
