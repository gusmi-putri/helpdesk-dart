import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FeedbackTableProps {
  dbFeedbacks: any[];
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({ dbFeedbacks }) => {
  return (
    <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden animate-in fade-in relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500"></div>
      <div className="p-5 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center bg-white/40 dark:bg-black/40">
        <h3 className="text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3">
          <MessageSquare className="text-yellow-500 w-6 h-6" /> PANEL EVALUASI & PENGADUAN
        </h3>
        <span className="bg-yellow-500 text-black text-[10px] font-mono font-bold px-3 py-1 tracking-widest uppercase">
          {dbFeedbacks.length} Total Evaluasi
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#1a2024] text-gray-600 dark:text-gray-400 font-tactical tracking-widest border-b border-gray-300 dark:border-gray-700">
            <tr>
              <th className="p-4 w-48">PENGIRIM</th>
              <th className="p-4 w-32">KATEGORI</th>
              <th className="p-4 w-32 text-center">RATING</th>
              <th className="p-4">RINCIAN EVALUASI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-800 bg-sand/30 dark:bg-gunmetal/30">
            {dbFeedbacks.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-gray-500 italic font-mono uppercase tracking-widest">
                  Belum ada umpan balik / evaluasi dari pengguna.
                </td>
              </tr>
            ) : (
              dbFeedbacks.map((f: any) => (
                <tr key={f.id} className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gunmetal dark:text-white uppercase">{f.nama_pengirim}</div>
                    <div className="text-[10px] font-mono text-gray-500">{f.tanggal}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-[10px] font-mono font-bold bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 tracking-tighter uppercase">
                      {f.kategori}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-lg ${f.rating >= star ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-600'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-mono">
                      "{f.pesan}"
                    </div>
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

export default FeedbackTable;
