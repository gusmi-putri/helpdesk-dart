import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isAktif = status === 'Aktif';
  
  return (
    <div className="flex items-center justify-center gap-2">
      <span className={`w-2 h-2 rounded-full ${isAktif ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
      <span className={`text-xs font-bold tracking-widest uppercase ${isAktif ? 'text-green-600 dark:text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
        {status}
      </span>
    </div>
  );
};
