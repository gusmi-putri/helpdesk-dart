import React, { useState } from 'react';
import { Activity, Calendar, MapPin } from 'lucide-react';

interface TaskListProps {
  tasks: any[];
  activeTab: 'ACTIVE' | 'HISTORY';
  setActiveTab: (tab: 'ACTIVE' | 'HISTORY') => void;
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTab,
  setActiveTab,
  selectedTaskId,
  setSelectedTaskId,
  searchQuery,
  setSearchQuery
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 shadow-xl p-6 gap-4 rounded-sm">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-slate-800 dark:text-white font-tactical font-bold tracking-widest text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-cighra-primary dark:text-cighra-gold" /> {activeTab === 'ACTIVE' ? 'TUGAS AKTIF' : 'RIWAYAT SELESAI'}
        </h2>
        <div className="flex items-center gap-2">
          <span className="bg-cighra-gold text-slate-900 font-bold text-[10px] px-1.5 py-0.5 font-mono uppercase shadow-sm">
            {tasks.length}
          </span>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 font-mono font-bold uppercase rounded-sm cursor-pointer border border-slate-300 dark:border-slate-600"
          >
            {isCollapsed ? 'BUKA DAFTAR' : 'TUTUP DAFTAR'}
          </button>
        </div>
      </div>
      
      <div className={`${isCollapsed ? 'hidden md:block' : 'block'} space-y-4 flex flex-col flex-1 overflow-hidden`}>
        <div className="flex gap-1 bg-cighra-light dark:bg-cighra-dark/30 p-1 border border-slate-200 dark:border-slate-600 h-[44px] items-center shrink-0">
          <button 
            onClick={() => { setActiveTab('ACTIVE'); setSelectedTaskId(null); }}
            className={`flex-1 py-1.5 text-[11px] font-tactical font-bold transition-all uppercase h-full ${activeTab === 'ACTIVE' ? 'bg-cighra-gold text-slate-900 shadow-lg' : 'text-slate-500 dark:text-slate-300 hover:text-gunmetal dark:hover:text-white'}`}
          >
            DAFTAR TUGAS
          </button>
          <button 
            onClick={() => { setActiveTab('HISTORY'); setSelectedTaskId(null); }}
            className={`flex-1 py-1.5 text-[11px] font-tactical font-bold transition-all uppercase h-full ${activeTab === 'HISTORY' ? 'bg-cighra-gold text-slate-900 shadow-lg' : 'text-slate-500 dark:text-slate-300 hover:text-gunmetal dark:hover:text-white'}`}
          >
            RIWAYAT SELESAI
          </button>
        </div>

        <div className="relative shrink-0">
          <input 
            type="text"
            placeholder="CARI KODE / UNIT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-cighra-dark/30 border border-slate-200 dark:border-slate-600 p-2 pl-8 text-xs font-mono focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold uppercase text-slate-800 dark:text-white h-[44px]"
          />
          <Activity className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {tasks.length === 0 ? (
            <div className="p-6 border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-cighra-dark/20 text-center font-mono text-slate-500 dark:text-slate-300 rounded-sm uppercase text-xs">
              {searchQuery ? 'Tidak ada data yang sesuai.' : 'Belum ada laporan kerusakan saat ini.'}
            </div>
          ) : (
            tasks.map((task: any) => (
              <div
                key={task.db_id}
                onClick={() => {
                  setSelectedTaskId(task.db_id);
                  setIsCollapsed(true);
                }}
                className={`p-4 border-2 transition-all cursor-pointer rounded-sm group flex flex-col gap-2
                  ${selectedTaskId === task.db_id
                    ? 'border-cighra-primary dark:border-cighra-gold bg-slate-50 dark:bg-slate-800/40 shadow-md border-l-4 border-l-cighra-primary dark:border-l-cighra-gold'
                    : 'border-transparent bg-white/60 dark:bg-cighra-darkcard/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm border-l-4 border-l-transparent'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="bg-cighra-gold text-slate-900 text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 shadow-sm uppercase">
                    {task.caseId}
                  </span>
                  {task.kerusakan.urgensi?.toUpperCase() === 'SANGAT MENDESAK' && (
                    <span className="text-[10px] bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 font-mono font-bold tracking-wider uppercase border border-red-200 dark:border-red-800/30">MENDESAK</span>
                  )}
                </div>

                <h3 className="text-slate-800 dark:text-white font-tactical text-base font-bold group-hover:text-cighra-primary dark:group-hover:text-cighra-gold transition-colors leading-tight uppercase">
                  {task.kerusakan.barangRusak}
                </h3>

                <div className="border-t border-slate-200 dark:border-slate-700/60 my-0.5"></div>

                <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300 text-xs font-sans">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cighra-primary dark:text-cighra-gold" />
                  <span className="line-clamp-1 uppercase tracking-tight">{task.kerusakan.lokasi}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-mono uppercase">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {task.kerusakan.tanggal.split(',')[0]}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;

