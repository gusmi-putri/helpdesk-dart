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
  const pendingUsers = dbUsers.filter((u: any) => !u.is_approved);

  return (
    <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden animate-in fade-in relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-targetred"></div>
      <div className="p-5 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center bg-white/40 dark:bg-black/40">
        <h3 className="text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3">
          <UserCheck className="text-targetred w-6 h-6" /> PERSETUJUAN PERSONEL BARU
        </h3>
        <span className="bg-targetred text-white text-[10px] font-mono font-bold px-3 py-1 tracking-widest">
          {pendingUsers.length} MENUNGGU VERIFIKASI
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#1a2024] text-gray-600 dark:text-gray-400 font-tactical tracking-widest border-b border-gray-300 dark:border-gray-700">
            <tr>
              <th className="p-4">USERNAME</th>
              <th className="p-4">NRP / NIP</th>
              <th className="p-4">NAMA LENGKAP</th>
              <th className="p-4">SATUAN</th>
              <th className="p-4">WHATSAPP</th>
              <th className="p-4 text-right">AKSI VERIFIKASI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-800 bg-sand/30 dark:bg-gunmetal/30">
            {pendingUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-20 text-center text-gray-500 italic font-mono uppercase tracking-widest">
                  Tidak ada pendaftaran personel baru yang menunggu persetujuan.
                </td>
              </tr>
            ) : (
              pendingUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors group">
                  <td className="p-4 font-mono text-gray-700 dark:text-gray-300">{u.username}</td>
                  <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-400">{u.nrp_nip}</td>
                  <td className="p-4 text-gunmetal dark:text-white font-bold">{u.name}</td>
                  <td className="p-4 text-xs font-mono uppercase text-gray-600 dark:text-gray-400">{u.asal_satuan}</td>
                  <td className="p-4 text-xs font-mono text-gray-600 dark:text-gray-400">{u.no_wa}</td>
                  <td className="p-4 flex gap-3 justify-end">
                    <button
                      onClick={() => handleApproveUser(u)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 text-[10px] font-tactical font-bold tracking-widest transition-all shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4" /> SETUJUI
                    </button>
                    <button
                      onClick={() => handleRejectUser(u)}
                      className="flex items-center gap-2 bg-targetred hover:bg-[#8B152A] text-white px-4 py-2 text-[10px] font-tactical font-bold tracking-widest transition-all shadow-lg"
                    >
                      <XCircle className="w-4 h-4" /> TOLAK
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalTable;
