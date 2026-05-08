import React from 'react';
import { Database, Info } from 'lucide-react';

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
  const filteredLogs = logFilter === 'ALL'
    ? dbLogs
    : dbLogs.filter((l: any) => l.level === logFilter);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-sand/30 dark:bg-black/40 border border-soft-gunmetal/10 dark:border-soft-sand/5 p-4 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-olive/10 border border-olive/30 flex items-center justify-center">
            <Database className="text-olive w-6 h-6" />
          </div>
          <div>
            <h3 className="text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest uppercase">LOG AKTIVITAS</h3>
            <p className="text-[10px] font-mono text-soft-gunmetal/50 dark:text-soft-sand/40 tracking-widest uppercase">Merekam Seluruh Aktivitas Sistem</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-100 dark:bg-black p-1 border border-gray-300 dark:border-gray-800">
          <span className="text-[10px] font-mono font-bold text-gray-500 px-3 uppercase tracking-tighter">Filter Level:</span>
          {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ALERT'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setLogFilter(lvl)}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold transition-all ${logFilter === lvl ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-500 via-yellow-400 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
        <div className="p-3 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center bg-white/40 dark:bg-black/40">
          <h3 className="text-gunmetal dark:text-white font-mono font-bold text-[10px] tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> /var/log/helpdesk_audit.log
          </h3>
          <span className="text-[9px] text-gray-500 font-mono italic">Showing {filteredLogs.length} entries</span>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-[#111] text-gray-500 font-bold sticky top-0 z-10 border-b border-gray-800 shadow-md">
              <tr>
                <th className="p-3 w-44 tracking-widest uppercase">Timestamp</th>
                <th className="p-3 w-28 tracking-widest uppercase text-center">Severity</th>
                <th className="p-3 w-56 tracking-widest uppercase">Operator</th>
                <th className="p-3 tracking-widest uppercase">Action Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-800 bg-sand dark:bg-gunmetal">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-500 italic tracking-widest uppercase">No records found for filter: {logFilter}</td>
                </tr>
              ) : (
                filteredLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-yellow-500/5 transition-colors group">
                    <td className="p-3 text-gray-500 border-l-2 border-transparent group-hover:border-yellow-500 whitespace-nowrap">{log.time}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-sm inline-block min-w-[70px]
                        ${log.level === 'SUCCESS' ? 'bg-green-900/20 text-green-500 border-green-800' : ''}
                        ${log.level === 'ALERT' ? 'bg-red-900/30 text-targetred border-red-800 animate-pulse' : ''}
                        ${log.level === 'WARN' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-800' : ''}
                        ${log.level === 'INFO' ? 'bg-blue-900/20 text-blue-400 border-blue-800' : ''}
                      `}>
                        {log.level}
                      </span>
                    </td>
                    <td className="p-3 text-gunmetal dark:text-white font-bold flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-800 flex items-center justify-center text-[10px] text-gray-500">
                        {log.user?.charAt(0) || 'S'}
                      </div>
                      {log.user}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-800 dark:text-gray-300 line-clamp-1 flex-1">{log.activity}</span>
                        <button
                          onClick={() => setSelectedLogPayload(log.activity)}
                          className="p-1 hover:bg-yellow-500/20 text-yellow-600 transition-colors opacity-0 group-hover:opacity-100"
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
