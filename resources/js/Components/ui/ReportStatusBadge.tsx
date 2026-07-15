import React from 'react';

interface ReportStatusBadgeProps {
  status: string;
}

export const ReportStatusBadge: React.FC<ReportStatusBadgeProps> = ({ status }) => {
  const getStatusClasses = (s: string) => {
    switch (s) {
      case 'SELESAI':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40';
      case 'DITOLAK':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40 animate-pulse';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40';
    }
  };

  return (
    <span className={`px-3 py-1.5 font-mono text-xs font-bold tracking-widest border shadow-sm uppercase ${getStatusClasses(status)}`}>
      {status}
    </span>
  );
};
