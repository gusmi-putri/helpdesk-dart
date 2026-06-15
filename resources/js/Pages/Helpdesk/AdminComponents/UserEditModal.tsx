import React from 'react';

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
  dbRoles
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-md shadow-[0_0_50px_rgba(75,83,32,0.3)] animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase">
            {isAddMode ? 'TAMBAH PERSONEL BARU' : 'PENGATURAN PERSONEL'}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-cighra-primary dark:text-cighra-gold">✕</button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">NRP / NIP</label>
              <input
                type="text"
                value={data.nrp_nip}
                onChange={(e) => setData('nrp_nip', e.target.value)}
                className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.nrp_nip ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none uppercase`}
                placeholder="MASUKKAN NRP/NIP"
                required
                minLength={8}
              />
              {errors.nrp_nip && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.nrp_nip}</p>}
            </div>

            {isAddMode ? (
              <>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Username</label>
                  <input
                    type="text"
                    value={data.username}
                    onChange={(e) => setData('username', e.target.value)}
                    className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.username ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none uppercase`}
                    required
                    autoComplete="off"
                  />
                  {errors.username && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.username}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Password</label>
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.password ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none`}
                    required={isAddMode}
                    autoComplete="new-password"
                    minLength={8}
                  />
                  {errors.password && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.password}</p>}
                </div>
              </>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-900/50 p-2 border border-slate-200 dark:border-slate-600/50 flex flex-col justify-center">
                <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">Username (Locked)</label>
                <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">{data.username}</p>
              </div>
            )}
            <div className="col-span-2">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Nama Lengkap</label>
              <input
                type="text"
                value={data.nama_lengkap}
                onChange={(e) => setData('nama_lengkap', e.target.value)}
                className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.nama_lengkap ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none`}
                required
              />
              {errors.nama_lengkap && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.nama_lengkap}</p>}
            </div>
            {data.username === 'admin' ? (
              <div className="bg-gray-100 dark:bg-gray-900/50 p-2 border border-slate-200 dark:border-slate-600/50 flex flex-col justify-center">
                <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">Hak Akses (Locked)</label>
                <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">ADMINISTRATOR</p>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Hak Akses (Role)</label>
                <select
                  value={data.role_id}
                  onChange={(e) => setData('role_id', e.target.value)}
                  className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.role_id ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none`}
                  required
                >
                  <option value="">PILIH ROLE</option>
                  {dbRoles?.map((role: any) => (
                    <option key={role.id} value={role.id}>{role.name.toUpperCase()}</option>
                  ))}
                </select>
                {errors.role_id && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.role_id}</p>}
              </div>
            )}
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">No. WhatsApp</label>
              <input
                type="text"
                value={data.no_wa}
                onChange={(e) => setData('no_wa', e.target.value)}
                className="w-full bg-white dark:bg-cighra-darkcard border border-gray-400 dark:border-slate-600 p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none"
                placeholder="08..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Asal Satuan</label>
              <input
                type="text"
                value={data.asal_satuan}
                onChange={(e) => setData('asal_satuan', e.target.value)}
                className="w-full bg-white dark:bg-cighra-darkcard border border-gray-400 dark:border-slate-600 p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
                Spesialisasi {dbRoles?.find((r: any) => r.id == data.role_id)?.name !== 'Teknisi' && '(KHUSUS TEKNISI)'}
              </label>
              <input
                type="text"
                value={data.spesialisasi}
                onChange={(e) => setData('spesialisasi', e.target.value)}
                disabled={dbRoles?.find((r: any) => r.id == data.role_id)?.name !== 'Teknisi'}
                className={`w-full bg-white dark:bg-cighra-darkcard border border-gray-400 dark:border-slate-600 p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none ${dbRoles?.find((r: any) => r.id == data.role_id)?.name !== 'Teknisi' ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder={dbRoles?.find((r: any) => r.id == data.role_id)?.name !== 'Teknisi' ? 'NON-TEKNISI' : 'MISAL: JARINGAN / HARDWARE'}
              />
            </div>
          </div>
          <div className="pt-4 flex gap-2">
            <button
              type="submit"
              disabled={processing}
              className="flex-1 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white py-2 font-tactical font-bold tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-colors disabled:opacity-50"
            >
              {processing ? 'MEMPROSES...' : (isAddMode ? 'DAFTARKAN PERSONEL' : 'SIMPAN PERUBAHAN')}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-transparent border border-gray-500 text-slate-500 py-2 font-tactical font-bold tracking-widest hover:bg-gray-500/10 transition-colors">
              BATAL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
