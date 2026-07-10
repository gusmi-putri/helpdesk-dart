import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';

interface FeedbackTableProps {
  dbFeedbacks: any[];
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({ dbFeedbacks }) => {
  const { sortedItems: sortedFeedbacks, sortConfig, handleSort } = useTableSort(dbFeedbacks, { key: 'tanggal', direction: 'desc' });

  return (
    <div className="bg-white dark:bg-cighra-darkcard/70 border border-slate-200 dark:border-slate-600 shadow-xl overflow-hidden animate-in fade-in relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500"></div>
      <div className="p-5 border-b border-slate-200 dark:border-slate-600/50 flex justify-between items-center bg-slate-800">
        <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
          <MessageSquare className="text-yellow-500 w-6 h-6" /> PANEL EVALUASI & PENGADUAN
        </h3>
        <span className="bg-yellow-500 text-black text-xs font-mono font-bold px-3 py-1 tracking-widest uppercase">
          {dbFeedbacks.length} Total Evaluasi
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <SortableHeader label="PENGIRIM" sortKey="nama_pengirim" currentSort={sortConfig} onSort={handleSort} className="w-48" />
              <SortableHeader label="KATEGORI" sortKey="kategori" currentSort={sortConfig} onSort={handleSort} className="w-32" />
              <SortableHeader label="RATING" sortKey="rating" currentSort={sortConfig} onSort={handleSort} className="w-32" />
              <SortableHeader label="RINCIAN EVALUASI" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800 bg-white dark:bg-transparent">
            {dbFeedbacks.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-slate-500 italic font-mono uppercase tracking-widest">
                  Belum ada umpan balik / evaluasi dari pengguna.
                </td>
              </tr>
            ) : (
              sortedFeedbacks.map((f: any) => (
                <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors group text-slate-800 dark:text-slate-200">
                  <td className="p-4 text-center">
                    <div className="font-bold text-slate-800 dark:text-white uppercase">{f.nama_pengirim}</div>
                    <div className="text-xs font-mono text-slate-500">{f.tanggal}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 text-xs font-mono font-bold bg-gray-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 tracking-tighter uppercase">
                      {f.kategori}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-lg ${f.rating >= star ? 'text-yellow-500' : 'text-slate-400 dark:text-slate-500'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-xs text-slate-800 dark:text-white leading-relaxed font-mono">
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

