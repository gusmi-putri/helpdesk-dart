import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Modal } from '@/Components/ui/Modal';
import { Button } from '@/Components/ui/Button';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const addNotification = useStore((state) => state.addNotification);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // @ts-ignore
    passwordForm.put(route('profile.password.update'), {
      preserveScroll: true,
      onSuccess: () => {
        addNotification('Kata sandi berhasil diubah!');
        passwordForm.reset();
        onClose();
      },
      onError: (err: any) => {
         const firstError = Object.values(err)[0] || 'Gagal mengubah kata sandi.';
         addNotification(`Gagal: ${firstError}`);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      icon={<KeyRound />}
      title="GANTI KATA SANDI"
      footer={
        <div className="flex gap-4 w-full">
          <Button 
            variant="primary" 
            onClick={handlePasswordSubmit} 
            disabled={passwordForm.processing}
            className="flex-[2] uppercase"
            size="lg"
          >
            <KeyRound className="w-5 h-5" />
            {passwordForm.processing ? 'MEMPROSES...' : 'SIMPAN SANDI'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="flex-1 uppercase"
            size="lg"
            type="button"
          >
            BATAL
          </Button>
        </div>
      }
    >
      <div className="space-y-6 pt-2">
        <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 tracking-widest uppercase">Kata Sandi Saat Ini</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.data.current_password}
                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                className={`w-full bg-white dark:bg-slate-900 border ${passwordForm.errors.current_password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} p-3 text-sm font-mono font-bold focus:border-cighra-primary dark:focus:border-cighra-gold outline-none transition-all dark:text-white rounded-sm shadow-sm pr-10`}
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
            {passwordForm.errors.current_password && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{passwordForm.errors.current_password}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 tracking-widest uppercase">Kata Sandi Baru</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.data.password}
                onChange={(e) => passwordForm.setData('password', e.target.value)}
                className={`w-full bg-white dark:bg-slate-900 border ${passwordForm.errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} p-3 text-sm font-mono font-bold focus:border-cighra-primary dark:focus:border-cighra-gold outline-none transition-all dark:text-white rounded-sm shadow-sm pr-10`}
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
            {passwordForm.errors.password && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{passwordForm.errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 tracking-widest uppercase">Konfirmasi Kata Sandi Baru</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.data.password_confirmation}
                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                className={`w-full bg-white dark:bg-slate-900 border ${passwordForm.errors.password_confirmation ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} p-3 text-sm font-mono font-bold focus:border-cighra-primary dark:focus:border-cighra-gold outline-none transition-all dark:text-white rounded-sm shadow-sm pr-10`}
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
            {passwordForm.errors.password_confirmation && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{passwordForm.errors.password_confirmation}</p>}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
