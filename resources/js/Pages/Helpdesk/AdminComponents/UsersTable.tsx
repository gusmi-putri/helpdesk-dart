import React, { useState } from 'react';
import { Users, Search, Plus, Eye, Edit, Trash2, Power } from 'lucide-react';
import { EmptyState } from '@/Components/ui/EmptyState';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { router, useForm } from '@inertiajs/react';
import { useStore } from '@/store/useStore';
import UserDetailModal from './UserDetailModal';
import UserDeleteModal from './UserDeleteModal';
import UserEditModal from './UserEditModal';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/Components/Table/Pagination';
import { RoleBadge } from '@/Components/ui/RoleBadge';
import { StatusBadge } from '@/Components/ui/StatusBadge';

interface UsersTableProps {
  dbUsers: any[];
  dbRoles?: any[];
  dbSatuans?: any[];
  isPengajuan?: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  dbUsers,
  dbRoles,
  dbSatuans,
  isPengajuan
}) => {
  const [userSearch, setUserSearch] = useState('');
  const [warningUser, setWarningUser] = useState<any>(null);
  
  // Modal visibility states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Data states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const currentUser = useStore(state => state.currentUser);
  const addNotification = useStore(state => state.addNotification);

  // Form state
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    username: '',
    password: '',
    email: '',
    nama_lengkap: '',
    nrp_nip: '',
    role_id: '',
    satuan_id: '',
    asal_satuan: '',
    no_wa: '',
    spesialisasi: ''
  });

  const filtered = dbUsers.filter((u: any) => u.is_approved !== false).filter((u: any) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.nrp_nip || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.id || '').toString().toLowerCase().includes(q)
    );
  });

  const { sortedItems: filteredUsers, sortConfig, handleSort } = useTableSort(filtered, { key: 'name', direction: 'asc' });
  const { currentPage, totalPages, paginatedItems, handlePageChange, itemsPerPage, totalItems } = usePagination(filteredUsers, 15);

  // Handlers
  const handleAddUser = () => {
    setIsAddMode(true);
    setEditingUser(null);
    clearErrors();
    setData({
      username: '',
      password: '',
      email: '',
      nama_lengkap: '',
      nrp_nip: '',
      role_id: '',
      satuan_id: '',
      asal_satuan: '',
      no_wa: '',
      spesialisasi: ''
    });
    setIsEditModalOpen(true);
  };

  const handleShowDetail = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setIsAddMode(false);
    setEditingUser(user);
    clearErrors();
    setData({
      username: user.username || '',
      password: '',
      email: user.email || '',
      nama_lengkap: user.name,
      nrp_nip: user.nrp_nip || '',
      role_id: user.role_id || '',
      satuan_id: user.satuan_id || '',
      asal_satuan: user.asal_satuan || '',
      no_wa: user.no_wa || '',
      spesialisasi: user.spesialisasi || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddMode) {
      post('/users', {
        onSuccess: () => {
          setIsEditModalOpen(false);
          reset();
          if (isPengajuan) addNotification('Pengajuan personel berhasil ditambahkan.');
        },
      });
    } else {
      // Check if data changed
      const hasChanged = data.nama_lengkap !== editingUser.name ||
        data.email !== editingUser.email ||
        data.nrp_nip !== (editingUser.nrp_nip || '') ||
        data.role_id !== (editingUser.role_id || '') ||
        data.satuan_id !== (editingUser.satuan_id || '') ||
        data.asal_satuan !== (editingUser.asal_satuan || '') ||
        data.no_wa !== (editingUser.no_wa || '') ||
        data.spesialisasi !== (editingUser.spesialisasi || '');
        
      if (!hasChanged) {
        setIsEditModalOpen(false);
        if (isPengajuan) {
          addNotification('Tidak ada perubahan', 'info');
        }
        return;
      }

      put(`/users/${editingUser.db_id}`, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          if (isPengajuan) addNotification('Pengajuan perubahan data personel berhasil dikirim.');
        },
      });
    }
  };

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      if (userToDelete.db_id === currentUser?.id || userToDelete.username === currentUser?.username) {
        addNotification('Anda tidak dapat menghapus akun Anda sendiri.', 'error');
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        return;
      }
      router.delete(`/users/${userToDelete.db_id}`, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
          if (isPengajuan) addNotification('Pengajuan hapus personel berhasil dikirim.');
        }
      });
    }
  };

  const handleToggleUserStatus = (user: any) => {
    router.post(`/users/${user.db_id}/toggle-status`);
  };

  return (
    <>
    {/* Filter / Search Row (Moved outside and above card container) */}
    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end mb-4 animate-in fade-in">
      <div className="w-full md:flex-1">
        <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Cari Personel</label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="CARI NAMA / NRP / HAK AKSES..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 pl-10 pr-4 py-2.5 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold focus:ring-1 focus:ring-cighra-primary/30 transition-all uppercase rounded-none"
          />
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-xl overflow-hidden animate-in fade-in relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>
      <div className="p-5 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-cighra-primary dark:bg-slate-800">
        <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
          <Users className="text-cighra-gold w-6 h-6" /> MANAJEMEN PERSONEL
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddUser}
            className="bg-white dark:bg-cighra-gold hover:bg-slate-100 dark:hover:bg-cighra-gold/90 text-cighra-primary dark:text-slate-900 px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-white dark:border-cighra-gold shadow-lg uppercase cursor-pointer"
          >
            <Plus className="w-4 h-4" /> TAMBAH USER
          </button>
        </div>
      </div>


      <div className="overflow-x-auto custom-scrollbar pb-2">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white">
            <tr>
              <SortableHeader label="ID PERSONEL" sortKey="id" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="NRP / NIP" sortKey="nrp_nip" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="NAMA LENGKAP" sortKey="name" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="EMAIL" sortKey="email" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="HAK AKSES" sortKey="role" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="STATUS AKTIF" sortKey="status" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="TINDAKAN" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8">
                  <EmptyState 
                    icon={<Users className="w-16 h-16 opacity-50" />}
                    title={userSearch ? 'PENCARIAN TIDAK DITEMUKAN' : 'DATA KOSONG'}
                    description={userSearch ? 'Tidak ditemukan personel yang cocok dengan kata kunci pencarian Anda.' : 'Belum ada data personel yang terdaftar di sistem.'}
                  />
                </td>
              </tr>
            ) : paginatedItems.map((u: any) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="p-4 font-mono text-slate-800 dark:text-white text-center">{u.id}</td>
                <td className="p-4 font-mono text-xs text-slate-800 dark:text-white text-center">{u.nrp_nip || '-'}</td>
                <td className="p-4 text-slate-800 dark:text-white font-bold text-center">{u.name}</td>
                <td className="p-4 font-mono text-xs text-slate-800 dark:text-white lowercase text-center">{u.email}</td>
                <td className="p-4 text-center">
                  <RoleBadge role={u.role} />
                </td>
                <td className="p-4 text-center">
                  <StatusBadge status={u.status} />
                </td>
                <td className="p-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => handleShowDetail(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Detail">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEditUser(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    {u.db_id === currentUser?.id || u.username === currentUser?.username ? (
                      <button 
                        disabled
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-50 rounded-sm" 
                        title="Anda tidak dapat menghapus akun Anda sendiri"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          if (u.has_ongoing_reports) {
                            setWarningUser(u);
                          } else {
                            handleDeleteUser(u);
                          }
                        }} 
                        className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {!isPengajuan && (
                      <button 
                        onClick={() => handleToggleUserStatus(u)} 
                        disabled={u.role === 'Admin'}
                        className={`p-2 transition-all border rounded-sm ${
                          u.role === 'Admin' 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-50' 
                            : u.status === 'Aktif'
                              ? 'bg-slate-50 dark:bg-slate-700 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 border-slate-200 dark:border-slate-600'
                              : 'bg-slate-50 dark:bg-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600'
                        }`}
                        title={u.role === 'Admin' ? 'Status Admin tidak dapat diubah' : (u.status === 'Aktif' ? 'Nonaktifkan User' : 'Aktifkan User')}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
      <BaseModal
        isOpen={!!warningUser}
        onClose={() => setWarningUser(null)}
        title="TIDAK DAPAT MENGHAPUS PERSONEL"
        icon={<AlertTriangle className="text-cighra-gold" />}
        maxWidth="md"
        footer={
          <Button variant="secondary" onClick={() => setWarningUser(null)} className="w-full">
            TUTUP
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-300 leading-relaxed uppercase tracking-wider">
            SISTEM MENDETEKSI BAHWA PERSONEL <span className="font-bold text-cighra-gold">{warningUser?.name}</span> MASIH MEMILIKI LAPORAN ON GOING (SEDANG DITANGANI / BELUM SELESAI).
          </p>
          <div className="bg-cighra-primary/5 border-l-4 border-cighra-gold p-4 dark:bg-cighra-darkcard">
            <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 uppercase">
              PERSONEL BARU BISA DIHAPUS SETELAH SELURUH LAPORAN DI AKUNNYA BERHASIL DISELESAIKAN ATAU DITOLAK UNTUK MENJAGA INTEGRITAS DATA.
            </p>
          </div>
        </div>
      </BaseModal>

      {/* Embedded Modals */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={selectedUser}
      />

      <UserDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        user={userToDelete}
        isPengajuan={isPengajuan}
      />

      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          reset();
        }}
        onSubmit={handleSaveUser}
        data={data}
        setData={setData}
        errors={errors}
        processing={processing}
        isAddMode={isAddMode}
        dbRoles={dbRoles || []}
        dbSatuans={dbSatuans || []}
        isPengajuan={isPengajuan}
        submitDisabled={!isAddMode && editingUser && !(
          data.nama_lengkap !== editingUser.name ||
          data.email !== editingUser.email ||
          data.nrp_nip !== (editingUser.nrp_nip || '') ||
          data.role_id !== (editingUser.role_id || '') ||
          data.satuan_id !== (editingUser.satuan_id || '') ||
          data.asal_satuan !== (editingUser.asal_satuan || '') ||
          data.no_wa !== (editingUser.no_wa || '') ||
          data.spesialisasi !== (editingUser.spesialisasi || '') ||
          data.password !== ''
        )}
      />
    </>
  );
};

export default UsersTable;
