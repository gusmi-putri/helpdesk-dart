import React from 'react';
import { Database, Info } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';

interface LogsTableProps {
  dbLogs: any[];
  logFilter: string;
  setLogFilter: (l: string) => void;
  setSelectedLogPayload: (p: string) => void;
}

const LogsTable: React.FC<LogsTableProps> = ({
  dbLogs,
  logFilter,
  setLogFilter,
  setSelectedLogPayload
}) => {
  const filtered = logFilter === 'ALL'
    ? dbLogs
    : dbLogs.filter((l: any) => l.level === logFilter);

  const { sortedItems: filteredLogs, sortConfig, handleSort } = useTableSort(filtered, { key: 'time', direction: 'desc' });

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 p-4 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cighra-primary/10 dark:bg-cighra-gold/10 border border-cighra-primary dark:border-cighra-gold/30 flex items-center justify-center">
            <Database className="text-cighra-primary dark:text-cighra-gold w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-white font-tactical font-bold text-lg tracking-widest uppercase">LOG AKTIVITAS</h3>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-300 tracking-widest uppercase">Merekam Seluruh Aktivitas Sistem</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-cighra-darkcard p-1 border border-slate-200 dark:border-slate-600 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 px-3 uppercase tracking-tighter">Filter Level:</span>
          {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ALERT'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setLogFilter(lvl)}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-all ${logFilter === lvl ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-cighra-darkcard/70 border border-slate-200 dark:border-slate-600 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cighra-gold via-yellow-400 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.3)]"></div>
        <div className="p-3 border-b border-slate-200 dark:border-slate-600/50 flex justify-between items-center bg-slate-800">
          <h3 className="text-white font-mono font-bold text-xs tracking-widest flex items-center gap-2 uppercase">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> /var/log/helpdesk_audit.log
          </h3>
          <span className="text-[11px] text-slate-300 font-mono italic">Showing {filteredLogs.length} entries</span>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
              <tr>
                <SortableHeader label="TIMESTAMP" sortKey="time" currentSort={sortConfig} onSort={handleSort} className="w-44 uppercase" />
                <SortableHeader label="SEVERITY" sortKey="level" currentSort={sortConfig} onSort={handleSort} className="w-28 uppercase" />
                <SortableHeader label="OPERATOR" sortKey="user" currentSort={sortConfig} onSort={handleSort} className="w-56 uppercase" />
                <SortableHeader label="ACTION PAYLOAD" sortKey="activity" currentSort={sortConfig} onSort={handleSort} className="uppercase" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800 bg-white dark:bg-cighra-dark">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-400 italic tracking-widest uppercase">No records found for filter: {logFilter}</td>
                </tr>
              ) : (
                filteredLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-yellow-500/5 transition-colors group">
                    <td className="p-3 text-slate-800 dark:text-white border-l-2 border-transparent group-hover:border-cighra-gold whitespace-nowrap text-center">{log.time}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-bold border rounded-sm inline-block min-w-[70px]
                        ${log.level === 'SUCCESS' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-500 border-green-200 dark:border-green-800/40' : ''}
                        ${log.level === 'ALERT' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40 animate-pulse' : ''}
                        ${log.level === 'WARN' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800/40' : ''}
                        ${log.level === 'INFO' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40' : ''}
                      `}>
                        {log.level}
                      </span>
                    </td>
                    <td className="p-3 text-slate-800 dark:text-white font-bold flex items-center justify-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                        {log.user?.charAt(0) || 'S'}
                      </div>
                      {log.user}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 dark:text-slate-300 line-clamp-1 flex-1">{log.activity}</span>
                        <button
                          onClick={() => setSelectedLogPayload(log.activity)}
                          className="p-1 hover:bg-cighra-gold/20 text-cighra-gold transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogsTable;

