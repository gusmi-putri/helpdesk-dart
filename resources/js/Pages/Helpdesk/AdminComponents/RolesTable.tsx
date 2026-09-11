import React, { useState } from 'react';
import { Shield, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { EmptyState } from '@/Components/ui/EmptyState';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { router, useForm } from '@inertiajs/react';
import { useStore } from '@/store/useStore';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/Components/Table/Pagination';
import RoleModal from './RoleModal';

interface RolesTableProps {
  dbRoles: any[];
  dbPermissions: any[];
  userPermissions?: string[];
}

const RolesTable: React.FC<RolesTableProps> = ({
  dbRoles,
  dbPermissions,
  userPermissions = []
}) => {
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Data states
  const [roleToDelete, setRoleToDelete] = useState<any>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const addNotification = useStore(state => state.addNotification);

  // Form state
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: '',
    permissions: [] as string[]
  });

  const filtered = dbRoles.filter((r: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (r.name || '').toLowerCase().includes(q)
    );
  });

  const { sortedItems: filteredRoles, sortConfig, handleSort } = useTableSort(filtered, { key: 'id', direction: 'asc' });
  const { currentPage, totalPages, paginatedItems, handlePageChange, itemsPerPage, totalItems } = usePagination(filteredRoles, 15);

  const protectedRoles = ['Admin', 'Staf', 'Teknisi', 'Pelapor', 'Supervisor'];

  // Handlers
  const handleAddRole = () => {
    setIsAddMode(true);
    setEditingRole(null);
    clearErrors();
    setData({
      name: '',
      permissions: []
    });
    setIsEditModalOpen(true);
  };

  const handleEditRole = (role: any) => {
    setIsAddMode(false);
    setEditingRole(role);
    clearErrors();
    setData({
      name: role.name,
      permissions: role.permissions ? role.permissions.map((p: any) => p.name || p) : []
    });
    setIsEditModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddMode) {
      post('/roles', {
        onSuccess: () => {
          setIsEditModalOpen(false);
          reset();
        },
      });
    } else {
      put(`/roles/${editingRole.id}`, {
        onSuccess: () => {
          setIsEditModalOpen(false);
        },
      });
    }
  };

  const handleDeleteRole = (role: any) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      if (protectedRoles.includes(roleToDelete.name)) {
        addNotification(`Role bawaan '${roleToDelete.name}' tidak dapat dihapus.`, 'error');
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
        return;
      }
      if (roleToDelete.users_count > 0) {
        addNotification(`Role ini masih digunakan oleh ${roleToDelete.users_count} pengguna.`, 'error');
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
        return;
      }
      
      router.delete(`/roles/${roleToDelete.id}`, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setRoleToDelete(null);
        }
      });
    }
  };

  return (
    <>
    {/* Filter / Search Row */}
    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end mb-4 animate-in fade-in">
      <div className="w-full md:flex-1">
        <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Cari Role</label>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-sm text-sm focus:outline-none focus:border-cighra-primary bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-full sm:w-64"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button 
            onClick={() => handleAddRole()}
            className="bg-white dark:bg-cighra-gold hover:bg-slate-100 dark:hover:bg-cighra-gold/90 text-cighra-primary dark:text-slate-900 px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-white dark:border-cighra-gold shadow-lg uppercase cursor-pointer h-[38px]"
          >
            <Plus size={16} /> BUAT ROLE BARU
          </button>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-xl overflow-hidden animate-in fade-in relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>
      <div className="p-5 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-cighra-primary dark:bg-slate-800">
        <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
          <Shield className="text-cighra-gold w-6 h-6" /> MANAJEMEN ROLES & AKSES
        </h3>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-2">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white">
            <tr>
              <SortableHeader label="ID" sortKey="id" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="NAMA ROLE" sortKey="name" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="TOTAL PERMISSIONS" sortKey="permissions_count" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="PENGGUNA AKTIF" sortKey="users_count" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="TINDAKAN" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8">
                  <EmptyState 
                    icon={<Shield className="w-16 h-16 opacity-50" />}
                    title={search ? 'PENCARIAN TIDAK DITEMUKAN' : 'DATA KOSONG'}
                    description={search ? 'Tidak ditemukan role yang cocok dengan kata kunci pencarian Anda.' : 'Belum ada data role yang terdaftar di sistem.'}
                  />
                </td>
              </tr>
            ) : paginatedItems.map((r: any) => {
              const isProtected = protectedRoles.includes(r.name);
              const isAdmin = r.name === 'Admin';
              return (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4 font-mono text-slate-800 dark:text-white text-center">{r.id}</td>
                  <td className="p-4 text-slate-800 dark:text-white font-bold uppercase tracking-wider">{r.name}</td>
                  <td className="p-4 text-center">
                    <Badge variant="info">{r.permissions?.length || 0} PERMISSIONS</Badge>
                  </td>
                  <td className="p-4 text-center">
                    <Badge variant="success">{r.users_count || 0} PENGGUNA</Badge>
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    <button 
                      onClick={() => handleEditRole(r)} 
                      className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" 
                      title="Edit Role"
                    >
                      <Edit size={16} />
                    </button>
                    {isProtected ? (
                      <button disabled className="p-2 bg-slate-50 dark:bg-slate-700/50 text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700 rounded-sm cursor-not-allowed" title="Role bawaan tidak dapat dihapus">
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleDeleteRole(r)} 
                        className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" 
                        title="Hapus Role"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
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

      <RoleModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          reset();
        }}
        onSubmit={handleSaveRole}
        data={data}
        setData={setData}
        errors={errors}
        processing={processing}
        isAddMode={isAddMode}
        dbPermissions={dbPermissions || []}
        editingRole={editingRole}
      />

      {/* Delete Confirmation */}
      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="KONFIRMASI HAPUS ROLE"
        icon={<Trash2 className="text-red-500" />}
        maxWidth="md"
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} className="w-full">BATAL</Button>
            <Button variant="danger" onClick={confirmDeleteRole} className="w-full">HAPUS ROLE</Button>
          </div>
        }
      >
        <p className="text-sm font-mono text-slate-600 dark:text-slate-300">
          Apakah Anda yakin ingin menghapus role <span className="font-bold text-slate-800 dark:text-white uppercase">{roleToDelete?.name}</span>? 
        </p>
      </BaseModal>
    </>
  );
};

export default RolesTable;
