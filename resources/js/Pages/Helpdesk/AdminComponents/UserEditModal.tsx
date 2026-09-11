import React, { useState } from 'react';
import { Info, UserCog, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
  processing: boolean;
  isAddMode: boolean;
  dbRoles: any[];
  dbPermissions?: any[];
  dbSatuans?: any[];
  isPengajuan?: boolean;
  submitDisabled?: boolean;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
  errors,
  processing,
  isAddMode,
  dbRoles,
  dbPermissions = [],
  dbSatuans,
  isPengajuan,
  submitDisabled
}) => {
  const [waWarning, setWaWarning] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const [showAdvancedAccess, setShowAdvancedAccess] = useState(false);

  // Pastikan data.roles dan data.permissions diinisialisasi
  const selectedRole = data.roles && data.roles.length > 0 ? data.roles[0] : '';
  const selectedPermissions = data.permissions || [];
  
  const selectedRoleData = dbRoles?.find((r: any) => r.name === selectedRole);
  const rolePermissions = selectedRoleData?.permissions?.map((p: any) => p.name || p) || [];

  const handleRoleChange = (roleName: string) => {
    setData('roles', [roleName]);
    
    // Auto-select permissions based on the role's default permissions
    const selectedRoleData = dbRoles?.find((r: any) => r.name === roleName);
    if (selectedRoleData && selectedRoleData.permissions) {
      setData('permissions', selectedRoleData.permissions);
    } else {
      setData('permissions', []);
    }
  };

  const handlePermissionToggle = (permName: string) => {
    if (selectedPermissions.includes(permName)) {
      setData('permissions', selectedPermissions.filter((p: string) => p !== permName));
    } else {
      setData('permissions', [...selectedPermissions, permName]);
    }
  };

  const formatPermissionName = (name: string) => {
    const mapping: { [key: string]: string } = {
      'view-dashboard-admin': 'Dashboard Admin',
      'view-dashboard-staf': 'Dashboard Staf',
      'view-dashboard-teknisi': 'Dashboard Teknisi',
      'view-dashboard-pelapor': 'Dashboard Pelapor',
      'manage-users': 'Kelola Personel',
      'manage-units': 'Kelola Unit DART',
      'manage-satuans': 'Kelola Satuan',
      'manage-reports': 'Kelola Laporan',
      'view-logs': 'Lihat Log Sistem',
    };
    return mapping[name] || name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (!isOpen) return null;

  // Strict numeric input handler
  const handleNumericInput = (field: string, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setData(field, numericValue);
  };

  // WhatsApp number handler — must start with 62
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
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isPengajuan ? (isAddMode ? 'PENGAJUAN PERSONEL BARU' : 'PENGAJUAN EDIT PERSONEL') : (isAddMode ? 'TAMBAH PERSONEL BARU' : 'PENGATURAN PERSONEL')}
      icon={<UserCog />}
      maxWidth="2xl"
      headerColor="primary"
      footer={
        <div className="flex gap-4 w-full">
          <Button
            type="submit"
            form="userEditForm"
            disabled={processing || submitDisabled}

            variant="primary" className="flex-[2] uppercase" size="lg">
            {processing ? 'MEMPROSES...' : isPengajuan ? (isAddMode ? 'AJUKAN PENDAFTARAN' : 'AJUKAN PERUBAHAN') : (isAddMode ? 'DAFTARKAN PERSONEL' : 'SIMPAN PERUBAHAN')}
          </Button>
          <Button
            type="button"
            onClick={onClose}

            variant="secondary" className="flex-1 uppercase" size="lg">
            BATAL
          </Button>
        </div>
      }
    >
      <form id="userEditForm" onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">NRP / NIP</label>
            <input
              type="text"
              value={data.nrp_nip}
              onChange={(e) => handleNumericInput('nrp_nip', e.target.value)}
              maxLength={20}
              className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.nrp_nip ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none uppercase rounded-sm`}
              placeholder="HANYA ANGKA, 8-20 DIGIT"
              required
              minLength={8}
            />
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Hanya angka, 8-20 digit.</p>
            {errors.nrp_nip && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.nrp_nip}</p>}
          </div>

          {isAddMode ? (
            <>
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Username</label>
                <input
                  type="text"
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                  className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.username ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none rounded-sm`}
                  placeholder="MINIMAL 4 KARAKTER"
                  required
                  minLength={4}
                  maxLength={50}
                  autoComplete="off"
                />
                {errors.username && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.username}</p>}
              </div>
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.password ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 pr-10 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none rounded-sm`}
                      required={isAddMode}
                      autoComplete="new-password"
                      minLength={8}
                      placeholder="MIN. 8 KARAKTER"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono flex items-center gap-1">
                    <Info className="w-3 h-3 shrink-0" /> Min. 8 karakter, huruf dan angka.
                  </p>
                  {errors.password && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Konfirmasi Password</label>
                  <div className="relative">
                    <input
                      type={showPasswordConf ? 'text' : 'password'}
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 pr-10 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none rounded-sm`}
                      required={isAddMode}
                      autoComplete="new-password"
                      minLength={8}
                      placeholder="ULANGI PASSWORD"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConf(!showPasswordConf)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                    >
                      {showPasswordConf ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password_confirmation && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.password_confirmation}</p>}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col col-span-2">
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Username (LOCKED)</label>
                <div className="bg-cighra-primary/5 dark:bg-slate-800/80 p-2.5 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-400 dark:text-slate-500 italic flex items-center gap-2 rounded-sm">
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  {data.username}
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Reset Password (Opsional)</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.password ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 pr-10 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none rounded-sm`}
                      autoComplete="new-password"
                      minLength={8}
                      placeholder="KOSONGKAN JIKA TIDAK DIUBAH"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Konfirmasi Reset</label>
                  <div className="relative">
                    <input
                      type={showPasswordConf ? 'text' : 'password'}
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 pr-10 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none rounded-sm`}
                      autoComplete="new-password"
                      minLength={8}
                      placeholder="ULANGI PASSWORD BARU"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConf(!showPasswordConf)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                    >
                      {showPasswordConf ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password_confirmation && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.password_confirmation}</p>}
                </div>
              </div>
            </>
          )}
          <div className="col-span-2">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Nama Lengkap</label>
            <input
              type="text"
              value={data.nama_lengkap}
              onChange={(e) => setData('nama_lengkap', e.target.value)}
              className={`w-full bg-cighra-primary/5 dark:bg-cighra-darkcard border ${errors.nama_lengkap ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
              required
              maxLength={100}
            />
            {errors.nama_lengkap && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.nama_lengkap}</p>}
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Email Address</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className={`w-full bg-cighra-primary/5 dark:bg-cighra-darkcard border ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
              required
              placeholder="EMAIL AKTIF"
            />
            {errors.email && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.email}</p>}
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">WhatsApp Connection</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm font-bold pointer-events-none">+</span>
              <input
                type="text"
                value={data.no_wa}
                onChange={(e) => handleWaInput(e.target.value)}
                maxLength={15}
                className={`w-full bg-cighra-primary/5 dark:bg-cighra-darkcard border ${errors.no_wa || waWarning ? 'border-yellow-500/50' : 'border-slate-300 dark:border-slate-700'} pl-8 pr-3 py-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
                placeholder="6281234567890"
              />
            </div>
            {waWarning && (
              <p className="text-[11px] text-yellow-600 dark:text-yellow-500 font-mono font-bold flex items-center gap-1 mt-1">
                <Info className="w-3 h-3 shrink-0" /> {waWarning}
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1 font-mono italic">Format: 62XXXXXXXXXXX</p>
            {errors.no_wa && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.no_wa}</p>}
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Asal Satuan / Komando</label>
            <select
              value={data.satuan_id || ''}
              onChange={(e) => {
                setData('satuan_id', e.target.value);
                const selectedSatuan = dbSatuans?.find((s: any) => s.id == e.target.value);
                if (selectedSatuan) {
                  setData('asal_satuan', selectedSatuan.nama_satuan);
                }
              }}
              className={`w-full bg-cighra-primary/5 dark:bg-cighra-darkcard border ${errors.satuan_id ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
              required
            >
              <option value="">PILIH SATUAN</option>
              {dbSatuans?.map((satuan: any) => (
                <option key={satuan.id} value={satuan.id}>{satuan.nama_satuan.toUpperCase()}</option>
              ))}
            </select>
            {errors.satuan_id && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.satuan_id}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
              Specialization {selectedRole !== 'Teknisi' && '(TECH ONLY)'}
            </label>
            <input
              type="text"
              value={data.spesialisasi}
              onChange={(e) => setData('spesialisasi', e.target.value)}
              disabled={selectedRole !== 'Teknisi'}
              className={`w-full bg-cighra-primary/5 dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all rounded-sm ${selectedRole !== 'Teknisi' ? 'opacity-40 cursor-not-allowed italic' : 'dark:text-white'}`}
              placeholder={selectedRole !== 'Teknisi' ? 'SISTEM DETEKSI: NON-TEKNISI' : 'MISAL: JARINGAN / HARDWARE'}
              maxLength={100}
            />
          </div>

          {/* HAK AKSES SECTION (MOVED TO BOTTOM) */}
          <div className="col-span-2 mt-4 border-t border-slate-200 dark:border-slate-700 pt-6 space-y-6">
            <div className="w-full">
              {data.username === 'admin' ? (
                <div className="flex flex-col">
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Hak Akses (LOCKED)</label>
                  <div className="bg-cighra-primary/5 dark:bg-slate-800/80 p-3 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-400 dark:text-slate-500 italic flex items-center gap-2 rounded-sm">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    ADMINISTRATOR
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Hak Akses Utama (Role)</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className={`w-full bg-cighra-primary/5 dark:bg-cighra-darkcard border ${errors.roles ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
                    required
                  >
                    <option value="">PILIH ROLE</option>
                    {dbRoles?.map((role: any) => (
                      <option key={role.id} value={role.name}>{role.name.toUpperCase()}</option>
                    ))}
                  </select>
                  {errors.roles && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.roles}</p>}
                </div>
              )}
            </div>

            {/* COLLAPSIBLE PERMISSIONS SECTION */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-sm overflow-hidden bg-slate-50 dark:bg-cighra-darkcard/30">
              <button
                type="button"
                onClick={() => setShowAdvancedAccess(!showAdvancedAccess)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <UserCog size={16} /> 
                  HAK AKSES TAMBAHAN (PERMISSIONS)
                </span>
                {showAdvancedAccess ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showAdvancedAccess && (
                <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-cighra-darkcard animate-in slide-in-from-top-2 fade-in duration-300">
                  {data.username === 'admin' ? (
                  <div className="bg-slate-50 dark:bg-cighra-darkcard/50 p-4 border border-slate-200 dark:border-slate-700 rounded-sm text-xs font-mono text-slate-500 italic">
                    Administrator memiliki akses penuh ke seluruh modul sistem.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-cighra-darkcard">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                          <th className="py-2 px-3 text-xs font-mono font-bold text-slate-500 uppercase">Modul / Menu</th>
                          <th className="py-2 px-3 text-xs font-mono font-bold text-slate-500 uppercase text-center">Create</th>
                          <th className="py-2 px-3 text-xs font-mono font-bold text-slate-500 uppercase text-center">Read</th>
                          <th className="py-2 px-3 text-xs font-mono font-bold text-slate-500 uppercase text-center">Update</th>
                          <th className="py-2 px-3 text-xs font-mono font-bold text-slate-500 uppercase text-center">Delete</th>
                          <th className="py-2 px-3 text-xs font-mono font-bold text-slate-500 uppercase text-center">Ekstra</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbPermissions.length > 0 ? (
                          (() => {
                            const grouped: { [key: string]: { [key: string]: string } } = {};
                            dbPermissions.forEach((perm: any) => {
                              const parts = perm.name.split('-');
                              const action = parts[0];
                              const module = parts.slice(1).join('-');
                              if (!grouped[module]) grouped[module] = {};
                              grouped[module][action] = perm.name;
                            });
  
                            return Object.keys(grouped).map((module, idx) => (
                              <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="py-2 px-3 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 capitalize">
                                  {module.replace('-', ' ')}
                                </td>
                                {['create', 'read', 'update', 'delete'].map(act => {
                                  const permName = grouped[module][act];
                                  return (
                                    <td key={act} className="py-2 px-3 text-center align-middle">
                                      {permName ? (() => {
                                        const isSelected = selectedPermissions.includes(permName);
                                        const isRoleDefault = rolePermissions.includes(permName);
                                        return (
                                          <label className={`inline-flex items-center ${isRoleDefault ? 'cursor-not-allowed' : 'cursor-pointer'}`} title={isRoleDefault ? "Bawaan dari Role (Tidak dapat diubah)" : ""}>
                                            <div className="relative">
                                              <input 
                                                type="checkbox" 
                                                className="sr-only" 
                                                checked={isSelected || isRoleDefault}
                                                disabled={isRoleDefault}
                                                onChange={() => handlePermissionToggle(permName)}
                                              />
                                              <div className={`block w-8 h-4 rounded-full transition-colors ${isSelected || isRoleDefault ? (isRoleDefault ? 'bg-cighra-primary/40 dark:bg-cighra-gold/40' : 'bg-cighra-primary dark:bg-cighra-gold') : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                              <div className={`dot absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition-transform ${isSelected || isRoleDefault ? 'transform translate-x-4' : ''}`}></div>
                                            </div>
                                          </label>
                                        );
                                      })() : (
                                        <span className="text-slate-300 dark:text-slate-600">-</span>
                                      )}
                                    </td>
                                  );
                                })}
                                <td className="py-2 px-3 text-center align-middle">
                                  <div className="flex justify-center gap-2 flex-wrap">
                                    {Object.keys(grouped[module])
                                      .filter(act => !['create', 'read', 'update', 'delete'].includes(act))
                                      .map(act => {
                                        const permName = grouped[module][act];
                                        const isSelected = selectedPermissions.includes(permName);
                                        const isRoleDefault = rolePermissions.includes(permName);
                                        return (
                                          <label key={act} className={`inline-flex items-center gap-1 ${isRoleDefault ? 'cursor-not-allowed' : 'cursor-pointer'}`} title={isRoleDefault ? "Bawaan dari Role" : ""}>
                                            <div className="relative">
                                              <input 
                                                type="checkbox" 
                                                className="sr-only" 
                                                checked={isSelected || isRoleDefault}
                                                disabled={isRoleDefault}
                                                onChange={() => handlePermissionToggle(permName)}
                                              />
                                              <div className={`block w-6 h-3 rounded-full transition-colors ${isSelected || isRoleDefault ? (isRoleDefault ? 'bg-cighra-primary/40 dark:bg-cighra-gold/40' : 'bg-cighra-primary dark:bg-cighra-gold') : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                              <div className={`dot absolute left-0.5 top-0.5 bg-white w-2 h-2 rounded-full transition-transform ${isSelected || isRoleDefault ? 'transform translate-x-3' : ''}`}></div>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-500 uppercase">{act}</span>
                                          </label>
                                        );
                                      })}
                                  </div>
                                </td>
                              </tr>
                            ));
                          })()
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-4 text-center text-xs font-mono text-slate-500 italic">Belum ada permission yang tersedia.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default UserEditModal;

