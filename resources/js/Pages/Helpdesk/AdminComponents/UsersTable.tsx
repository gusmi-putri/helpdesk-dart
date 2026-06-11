import React from 'react';
import { Users, Search, Plus, Eye, Edit, Trash2, Power } from 'lucide-react';

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
  const [userSearch, setUserSearch] = React.useState('');

  const filteredUsers = dbUsers.filter((u: any) => u.is_approved).filter((u: any) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.nrp_nip || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.id || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-xl overflow-hidden animate-in fade-in relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-olive via-camogreen to-transparent"></div>
      <div className="p-5 border-b border-slate-200 dark:border-slate-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800">
        <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
          <Users className="text-cighra-gold w-6 h-6" /> MANAJEMEN PERSONEL
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-300" />
            <input
              type="text"
              placeholder="CARI NAMA / NRP / HAK AKSES..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 pl-9 pr-4 py-2 text-sm font-mono text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:border-cighra-gold transition-colors w-64 uppercase shadow-sm"
            />
          </div>
          <button
            onClick={handleAddUser}
            className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-cighra-primary dark:border-cighra-gold shadow-lg uppercase"
          >
            <Plus className="w-4 h-4" /> TAMBAH USER
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-slate-700">
            <tr>
              <th className="p-4">ID PERSONEL</th>
              <th className="p-4">NRP / NIP</th>
              <th className="p-4">NAMA LENGKAP</th>
              <th className="p-4">EMAIL</th>
              <th className="p-4">HAK AKSES</th>
              <th className="p-4">STATUS AKTIF</th>
              <th className="p-4 text-right">TINDAKAN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-transparent">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">
                  {userSearch ? 'Tidak ditemukan personel yang cocok.' : 'Belum ada data personel.'}
                </td>
              </tr>
            ) : filteredUsers.map((u: any) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="p-4 font-mono text-slate-600 dark:text-slate-300 border-l-2 border-transparent group-hover:border-cighra-primary dark:group-hover:border-cighra-gold">{u.id}</td>
                <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{u.nrp_nip || '-'}</td>
                <td className="p-4 text-slate-800 dark:text-white font-bold">{u.name}</td>
                <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400 lowercase">{u.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[10px] font-mono font-bold tracking-widest border
                    ${u.role === 'Admin' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-cighra-gold border-red-200 dark:border-red-800' :
                      u.role === 'Staf' ? 'bg-olive/10 dark:bg-cighra-gold/20 text-olive dark:text-[#b5cb5c] border-olive/30 dark:border-cighra-gold/50' :
                        u.role === 'Teknisi' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                          'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'}
                  `}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${u.status === 'Aktif' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                    <span className={`text-[10px] font-bold tracking-widest uppercase ${u.status === 'Aktif' ? 'text-green-600 dark:text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
                      {u.status}
                    </span>
                  </div>
                </td>
                <td className="p-4 flex gap-2 justify-end">
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
                  <button onClick={() => handleShowDetail(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 text-slate-500 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Detail">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEditUser(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 text-slate-500 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteUser(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Hapus">
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
