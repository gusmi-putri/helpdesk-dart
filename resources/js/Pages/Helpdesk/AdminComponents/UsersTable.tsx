import React from 'react';
import { Users, Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface UsersTableProps {
  dbUsers: any[];
  handleAddUser: () => void;
  handleToggleUserStatus: (user: any) => void;
  handleShowDetail: (user: any) => void;
  handleEditUser: (user: any) => void;
  handleDeleteUser: (user: any) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  dbUsers,
  handleAddUser,
  handleToggleUserStatus,
  handleShowDetail,
  handleEditUser,
  handleDeleteUser
}) => {
  return (
    <div className="bg-sand/30 dark:bg-black/40 border border-soft-gunmetal/10 dark:border-soft-sand/5 shadow-xl overflow-hidden animate-in fade-in relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-olive via-camogreen to-transparent"></div>
      <div className="p-5 border-b border-soft-gunmetal/10 dark:border-soft-sand/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-sand/20 dark:bg-black/20">
        <h3 className="text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3">
          <Users className="text-olive w-6 h-6" /> MANAJEMEN PERSONEL
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddUser}
            className="bg-targetred hover:bg-[#8B152A] text-sand px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-targetred shadow-lg"
          >
            <Plus className="w-4 h-4" /> TAMBAH USER
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-soft-gunmetal/60 dark:text-soft-sand/40" />
            <input type="text" placeholder="Cari nama atau ID..." className="bg-sand/50 dark:bg-gunmetal border border-soft-gunmetal/20 dark:border-soft-sand/10 pl-9 pr-4 py-2 text-sm font-mono text-gunmetal dark:text-white focus:outline-none focus:border-olive transition-colors w-64" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#1a2024] text-gray-600 dark:text-gray-400 font-tactical tracking-widest border-b border-gray-300 dark:border-gray-700">
            <tr>
              <th className="p-4">ID PERSONEL</th>
              <th className="p-4">NRP / NIP</th>
              <th className="p-4">NAMA LENGKAP</th>
              <th className="p-4">HAK AKSES</th>
              <th className="p-4">STATUS AKTIF</th>
              <th className="p-4 text-right">TINDAKAN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {dbUsers.filter((u: any) => u.is_approved).map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-200 dark:hover:bg-gray-800/80 transition-colors group">
                <td className="p-4 font-mono text-gray-700 dark:text-gray-300 border-l-2 border-transparent group-hover:border-olive">{u.id}</td>
                <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-400">{u.nrp_nip || '-'}</td>
                <td className="p-4 text-gunmetal dark:text-white font-bold">{u.name}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[10px] font-mono font-bold tracking-widest border
                    ${u.role === 'Admin' ? 'bg-red-900/30 text-targetred border-red-800' :
                      u.role === 'Staf' ? 'bg-olive/20 text-[#b5cb5c] border-olive/50' :
                        u.role === 'Teknisi' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                          'bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600'}
                  `}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleUserStatus(u)}
                    disabled={u.role === 'Admin'}
                    className={`flex items-center gap-2 text-xs font-bold tracking-wider transition-all ${u.role !== 'Admin' ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-80'} ${u.status === 'Aktif' ? 'text-green-500' : 'text-gray-500'}`}
                    title={u.role === 'Admin' ? 'Status Admin tidak dapat diubah' : (u.status === 'Aktif' ? 'Klik untuk Nonaktifkan' : 'Klik untuk Aktifkan')}
                  >
                    <span className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${u.status === 'Aktif' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                    {u.status.toUpperCase()}
                  </button>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <button onClick={() => handleShowDetail(u)} className="p-2 bg-gray-300 dark:bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-300 transition-colors border border-gray-400 dark:border-gray-600" title="Detail">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEditUser(u)} className="p-2 bg-gray-300 dark:bg-gray-800 hover:bg-olive hover:text-gunmetal dark:hover:text-white text-gray-700 dark:text-gray-300 transition-colors border border-gray-400 dark:border-gray-600" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteUser(u)} className="p-2 bg-gray-300 dark:bg-gray-800 hover:bg-targetred hover:text-white text-gray-700 dark:text-gray-300 transition-colors border border-gray-400 dark:border-gray-600" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
