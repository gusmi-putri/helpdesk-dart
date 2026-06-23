import React from 'react';
import { UserCheck, CheckCircle, XCircle } from 'lucide-react';

interface ApprovalTableProps {
  dbUsers: any[];
  handleApproveUser: (user: any) => void;
  handleRejectUser: (user: any) => void;
}

const ApprovalTable: React.FC<ApprovalTableProps> = ({
  dbUsers,
  handleApproveUser,
  handleRejectUser
}) => {
  const pendingUsers = dbUsers.filter((u: any) => !u.is_approved || u.pending_action !== null);

  const getBadgeInfo = (u: any) => {
    if (!u.is_approved) return { label: 'TAMBAH PERSONEL', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' };
    if (u.pending_action === 'edit') return { label: 'UBAH PROFIL', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' };
    if (u.pending_action === 'delete') return { label: 'HAPUS PERSONEL', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' };
    return { label: 'UNKNOWN', color: 'bg-gray-100' };
  };

  return (
    <div className="bg-white dark:bg-cighra-darkcard/70 border border-slate-200 dark:border-slate-600 shadow-xl overflow-hidden animate-in fade-in relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>
      <div className="p-5 border-b border-slate-200 dark:border-slate-600/50 flex justify-between items-center bg-slate-800">
        <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
          <UserCheck className="text-cighra-gold w-6 h-6" /> PERSETUJUAN PERSONEL
        </h3>
        <span className="bg-cighra-gold text-slate-900 text-[10px] font-mono font-bold px-3 py-1 tracking-widest uppercase">
          {pendingUsers.length} MENUNGGU VERIFIKASI
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-slate-700">
            <tr>
              <th className="p-4">TIPE MUTASI</th>
              <th className="p-4">USERNAME / ROLE</th>
              <th className="p-4">NAMA LENGKAP</th>
              <th className="p-4">DETAIL PERUBAHAN</th>
              <th className="p-4 text-right">AKSI VERIFIKASI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-800 bg-white dark:bg-cighra-dark/30">
            {pendingUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center text-slate-500 italic font-mono uppercase tracking-widest">
                  Tidak ada pengajuan personel yang menunggu persetujuan.
                </td>
              </tr>
            ) : pendingUsers.map((u: any) => {
              const badge = getBadgeInfo(u);
              
              // Get the role name
              // If it's a new user, use u.role.
              // If it's an edit, check if role_id changed. (To really get role name, we'd need to map role_id from pending_changes but let's just show ID or "Ubah Role" since we don't have the full roles list here).
              let displayRole = u.role;
              if (u.pending_action === 'edit' && u.pending_changes?.role_id && u.pending_changes.role_id !== u.role_id) {
                  displayRole = `${u.role} ➔ ID Role Baru: ${u.pending_changes.role_id}`;
              }

              return (
                <tr key={u.id} className="hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors group">
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-mono font-bold border rounded-sm ${badge.color}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-slate-600 dark:text-slate-300 font-bold">{u.username}</div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mt-1 bg-slate-100 dark:bg-slate-800 inline-block px-1 rounded-sm border border-slate-200 dark:border-slate-600">
                      Role: {displayRole}
                    </div>
                  </td>
                  <td className="p-4 text-slate-800 dark:text-white font-bold">{u.name}</td>
                  <td className="p-4">
                    {!u.is_approved ? (
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 space-y-0.5">
                        <div>NRP/NIP: {u.nrp_nip}</div>
                        <div>Satuan: {u.asal_satuan}</div>
                        <div>WA: {u.no_wa}</div>
                      </div>
                    ) : u.pending_action === 'delete' ? (
                      <div className="text-[10px] font-mono text-red-500 italic">Penghapusan akun dari sistem.</div>
                    ) : (
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {Object.entries(u.pending_changes || {}).map(([key, val]) => (
                          <div key={key}><span className="text-blue-500 font-bold uppercase">{key}:</span> {String(val)}</div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 flex gap-3 justify-end items-center h-full mt-2">
                    <button
                      onClick={() => handleApproveUser(u)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 text-[10px] font-tactical font-bold tracking-widest transition-all shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4" /> SETUJUI
                  </button>
                  <button
                    onClick={() => handleRejectUser(u)}
                    className="flex items-center gap-2 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-4 py-2 text-[10px] font-tactical font-bold tracking-widest transition-all shadow-lg"
                  >
                    <XCircle className="w-4 h-4" /> TOLAK
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalTable;
