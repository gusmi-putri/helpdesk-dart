import React from 'react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';
import { Shield, UserCog, Info } from 'lucide-react';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  data: any;
  setData: (field: string, value: any) => void;
  errors: any;
  processing: boolean;
  isAddMode: boolean;
  dbPermissions: any[];
  editingRole: any;
}

const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
  errors,
  processing,
  isAddMode,
  dbPermissions,
  editingRole,
}) => {

  const selectedPermissions = data.permissions || [];

  const handlePermissionToggle = (permName: string) => {
    if (selectedPermissions.includes(permName)) {
      setData('permissions', selectedPermissions.filter((p: string) => p !== permName));
    } else {
      setData('permissions', [...selectedPermissions, permName]);
    }
  };

  const isAdminRole = !isAddMode && editingRole?.name === 'Admin';
  
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isAddMode ? 'BUAT ROLE BARU' : 'PENGATURAN ROLE'}
      icon={<Shield className="text-cighra-gold" />}
      maxWidth="3xl"
      footer={
        <div className="flex gap-2 w-full">
          <Button variant="secondary" type="button" onClick={onClose} className="w-1/2">
            BATAL
          </Button>
          <Button 
            type="submit" 
            className="w-1/2" 
            isLoading={processing}
            onClick={onSubmit}
          >
            {isAddMode ? 'BUAT ROLE' : 'SIMPAN PERUBAHAN'}
          </Button>
        </div>
      }
    >
      <form id="roleForm" onSubmit={onSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 gap-6">
          
          <div>
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Nama Role</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className={`w-full bg-cighra-primary/5 dark:bg-cighra-darkcard border ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm ${isAdminRole ? 'cursor-not-allowed opacity-70' : ''}`}
              required
              maxLength={255}
              disabled={isAdminRole}
              placeholder="CONTOH: SUPERVISOR_TERBATAS"
            />
            {isAdminRole && <p className="text-[11px] text-slate-400 mt-1 font-mono uppercase">Nama Role Admin tidak dapat diubah.</p>}
            {errors.name && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-2 tracking-widest uppercase flex items-center gap-2">
              <UserCog size={14} /> Hak Akses (Permissions)
            </label>
            <div>
              {isAdminRole ? (
                <div className="bg-slate-50 dark:bg-cighra-darkcard/50 p-4 border border-slate-200 dark:border-slate-700 rounded-sm text-xs font-mono text-slate-500 italic flex items-start gap-3">
                  <Info className="w-5 h-5 text-cighra-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 not-italic uppercase tracking-wider block mb-1">Peringatan Sistem</span>
                    Anda sedang mengedit role <strong>Admin</strong>. Pastikan tidak menghapus permission krusial seperti <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">view-dashboard-admin</code> atau <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">manage-roles</code> agar akun Anda tidak terkunci.
                  </div>
                </div>
              ) : null}
              
              <div className={`overflow-x-auto rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-cighra-darkcard ${isAdminRole ? 'mt-4' : ''}`}>
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
                                    return (
                                      <label className="inline-flex items-center cursor-pointer">
                                        <div className="relative">
                                          <input 
                                            type="checkbox" 
                                            className="sr-only" 
                                            checked={isSelected}
                                            onChange={() => handlePermissionToggle(permName)}
                                          />
                                          <div className={`block w-8 h-4 rounded-full transition-colors ${isSelected ? 'bg-cighra-primary dark:bg-cighra-gold' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                          <div className={`dot absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition-transform ${isSelected ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                      </label>
                                    );
                                  })() : (
                                    <span className="text-slate-300 dark:text-slate-600">-</span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="py-2 px-3 align-middle">
                              <div className="flex flex-wrap gap-2 justify-center">
                                {Object.keys(grouped[module])
                                  .filter(act => !['create', 'read', 'update', 'delete'].includes(act))
                                  .map(act => {
                                    const permName = grouped[module][act];
                                    const isSelected = selectedPermissions.includes(permName);
                                    return (
                                      <label key={act} className="inline-flex items-center gap-1 cursor-pointer">
                                        <div className="relative">
                                          <input 
                                            type="checkbox" 
                                            className="sr-only" 
                                            checked={isSelected}
                                            onChange={() => handlePermissionToggle(permName)}
                                          />
                                          <div className={`block w-6 h-3 rounded-full transition-colors ${isSelected ? 'bg-cighra-primary dark:bg-cighra-gold' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                          <div className={`dot absolute left-0.5 top-0.5 bg-white w-2 h-2 rounded-full transition-transform ${isSelected ? 'transform translate-x-3' : ''}`}></div>
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
            </div>
            {errors.permissions && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.permissions}</p>}
          </div>

        </div>
      </form>
    </BaseModal>
  );
};

export default RoleModal;
