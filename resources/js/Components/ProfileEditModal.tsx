import React, { useState, useEffect } from 'react';
import { Info, UserCog } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { useForm } from '@inertiajs/react';
import { useStore } from '@/store/useStore';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [waWarning, setWaWarning] = useState('');
  const addNotification = useStore((state) => state.addNotification);

  const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
    nama_lengkap: currentUser?.name || currentUser?.nama_lengkap || '',
    nrp_nip: currentUser?.nrp_nip || '',
    email: currentUser?.email || '',
    no_wa: currentUser?.no_wa || '',
    spesialisasi: currentUser?.spesialisasi || '',
  });

  useEffect(() => {
    if (isOpen) {
      setData({
        nama_lengkap: currentUser?.name || currentUser?.nama_lengkap || '',
        nrp_nip: currentUser?.nrp_nip || '',
        email: currentUser?.email || '',
        no_wa: currentUser?.no_wa || '',
        spesialisasi: currentUser?.spesialisasi || '',
      });
      clearErrors();
      setWaWarning('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleNumericInput = (field: string, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setData(field as any, numericValue);
  };

  const handleWaInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    let finalValue = numericValue;
    if (numericValue.startsWith('0')) {
      finalValue = '62' + numericValue.slice(1);
    }
    setData('no_wa', finalValue);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waWarning) return;

    // @ts-ignore
    put(route('users.update', currentUser.id), {
      onSuccess: () => {
        addNotification('Profil berhasil diperbarui!');
        onClose();
      },
      onError: (err) => {
        if (err.error) {
          addNotification(`Gagal: ${err.error}`);
        } else {
          addNotification('Gagal memperbarui profil. Periksa kembali input Anda.');
        }
      }
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="PENGATURAN PROFIL SAYA"
      icon={<UserCog />}
      maxWidth="2xl"
      headerColor="primary"
      footer={
        <div className="flex gap-4 w-full">
          <button
            type="submit"
            form="profileEditForm"
            disabled={processing}
            className="flex-[2] bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white p-3.5 font-tactical font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg rounded-sm"
          >
            {processing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 p-3.5 font-tactical font-bold tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all uppercase rounded-sm"
          >
            BATAL
          </button>
        </div>
      }
    >
      <form id="profileEditForm" onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col col-span-2">
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Username (LOCKED)</label>
            <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-400 dark:text-slate-500 italic flex items-center gap-2 rounded-sm">
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              {currentUser?.username || '-'}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Hak Akses / Role (LOCKED)</label>
            <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-400 dark:text-slate-500 italic flex items-center gap-2 rounded-sm uppercase">
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              {currentUser?.role || '-'}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Nama Lengkap</label>
            <input
              type="text"
              value={data.nama_lengkap}
              onChange={(e) => setData('nama_lengkap', e.target.value)}
              className={`w-full bg-slate-50 dark:bg-cighra-darkcard border ${errors.nama_lengkap ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
              required
              maxLength={100}
            />
            {errors.nama_lengkap && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.nama_lengkap}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">NRP / NIP</label>
            <input
              type="text"
              value={data.nrp_nip}
              onChange={(e) => handleNumericInput('nrp_nip', e.target.value)}
              maxLength={20}
              className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.nrp_nip ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-3 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none uppercase rounded-sm`}
              placeholder="HANYA ANGKA, 8-20 DIGIT"
              required
              minLength={8}
            />
            {errors.nrp_nip && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.nrp_nip}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Email Address</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className={`w-full bg-slate-50 dark:bg-cighra-darkcard border ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
              required
              placeholder="EMAIL AKTIF"
            />
            {errors.email && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">WhatsApp Connection</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm font-bold pointer-events-none">+</span>
              <input
                type="text"
                value={data.no_wa}
                onChange={(e) => handleWaInput(e.target.value)}
                maxLength={15}
                className={`w-full bg-slate-50 dark:bg-cighra-darkcard border ${errors.no_wa || waWarning ? 'border-yellow-500/50' : 'border-slate-300 dark:border-slate-700'} pl-8 pr-3 py-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
                placeholder="6281234567890"
              />
            </div>
            {waWarning && (
              <p className="text-[9px] text-yellow-600 dark:text-yellow-500 font-mono font-bold flex items-center gap-1 mt-1">
                <Info className="w-3 h-3 shrink-0" /> {waWarning}
              </p>
            )}
            {errors.no_wa && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.no_wa}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
              Specialization {currentUser?.role?.toLowerCase() !== 'teknisi' && '(TECH ONLY)'}
            </label>
            <input
              type="text"
              value={data.spesialisasi}
              onChange={(e) => setData('spesialisasi', e.target.value)}
              disabled={currentUser?.role?.toLowerCase() !== 'teknisi'}
              className={`w-full bg-slate-50 dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all rounded-sm ${currentUser?.role?.toLowerCase() !== 'teknisi' ? 'opacity-40 cursor-not-allowed italic' : 'dark:text-white'}`}
              placeholder={currentUser?.role?.toLowerCase() !== 'teknisi' ? 'NON-TEKNISI' : 'MISAL: JARINGAN / HARDWARE'}
              maxLength={100}
            />
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default ProfileEditModal;
