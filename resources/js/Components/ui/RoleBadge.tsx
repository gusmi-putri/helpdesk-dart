import React from 'react';

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getRoleStyle = (r: string) => {
    switch (r) {
      case 'Admin':
        return 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40';
      case 'Staf':
        return 'bg-olive/10 dark:bg-green-900/20 text-olive dark:text-green-400 border-olive/30 dark:border-green-800/40';
      case 'Teknisi':
        return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-mono font-bold tracking-widest border ${getRoleStyle(role)}`}>
      {role ? role.toUpperCase() : ''}
    </span>
  );
};
