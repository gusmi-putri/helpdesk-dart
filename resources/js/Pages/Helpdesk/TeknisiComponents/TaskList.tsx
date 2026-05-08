import React from 'react';
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
  return (
    <div className="xl:col-span-4 space-y-4">
      <div className="bg-white/60 dark:bg-black/40 border-b-2 border-olive p-4 shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-gunmetal dark:text-white font-tactical font-bold tracking-widest text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-olive" /> {activeTab === 'ACTIVE' ? 'TUGAS AKTIF' : 'RIWAYAT SELESAI'}
          </h2>
          <span className="bg-olive text-sand font-bold text-xs px-2 py-1 font-mono uppercase">{tasks.length} ENTRI</span>
        </div>
        
        <div className="flex gap-1 bg-sand/50 dark:bg-black/40 p-1 border border-soft-gunmetal/10 dark:border-soft-sand/5">
          <button 
            onClick={() => { setActiveTab('ACTIVE'); setSelectedTaskId(null); }}
            className={`flex-1 py-1.5 text-[10px] font-tactical font-bold transition-all uppercase ${activeTab === 'ACTIVE' ? 'bg-olive text-sand shadow-lg' : 'text-soft-gunmetal/60 dark:text-soft-sand/40 hover:text-gunmetal dark:hover:text-white'}`}
          >
            DAFTAR TUGAS
          </button>
          <button 
            onClick={() => { setActiveTab('HISTORY'); setSelectedTaskId(null); }}
            className={`flex-1 py-1.5 text-[10px] font-tactical font-bold transition-all uppercase ${activeTab === 'HISTORY' ? 'bg-targetred text-sand shadow-lg' : 'text-soft-gunmetal/60 dark:text-soft-sand/40 hover:text-gunmetal dark:hover:text-white'}`}
          >
            RIWAYAT SELESAI
          </button>
        </div>

        <div className="relative">
          <input 
            type="text"
            placeholder="CARI KODE / UNIT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-sand/30 dark:bg-gunmetal/30 border border-soft-gunmetal/10 dark:border-soft-sand/5 p-2 pl-8 text-[10px] font-mono focus:outline-none focus:border-olive uppercase text-gunmetal dark:text-white"
          />
          <Activity className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-soft-gunmetal/40" />
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="p-6 border border-soft-gunmetal/10 dark:border-soft-sand/5 bg-white/40 dark:bg-black/20 text-center font-mono text-soft-gunmetal/60 dark:text-soft-sand/40 rounded-sm uppercase text-xs">
            {searchQuery ? 'Tidak ada data yang sesuai.' : 'Belum ada laporan kerusakan saat ini.'}
          </div>
        ) : (
          tasks.map((task: any) => (
            <div
              key={task.db_id}
              onClick={() => setSelectedTaskId(task.db_id)}
              className={`p-4 border-2 transition-all cursor-pointer rounded-sm group
                ${selectedTaskId === task.db_id
                  ? 'border-olive bg-sand/60 dark:bg-soft-gunmetal/20 shadow-[inset_4px_0_0_#68a309]'
                  : 'border-transparent bg-white/60 dark:bg-black/40 hover:border-soft-gunmetal/20 dark:hover:border-soft-sand/10 shadow-sm'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="bg-targetred text-white text-[10px] px-2 py-0.5 font-mono font-bold tracking-widest shadow-sm">
                  {task.caseId}
                </span>
                <span className="text-soft-gunmetal dark:text-soft-sand/60 text-xs font-mono flex items-center gap-1 uppercase">
                  <Calendar className="w-3 h-3 text-olive" /> {task.kerusakan.tanggal.split(',')[0]}
                </span>
              </div>

              <h3 className="text-gunmetal dark:text-white font-tactical text-lg font-bold mb-1 group-hover:text-olive transition-colors leading-tight line-clamp-2 uppercase">
                {task.kerusakan.barangRusak}
              </h3>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-soft-gunmetal/10 dark:border-soft-sand/5">
                <div className="flex items-start gap-2 text-soft-gunmetal/70 dark:text-soft-sand/50 text-xs font-sans">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-olive" />
                  <span className="line-clamp-1 uppercase">{task.kerusakan.lokasi}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
