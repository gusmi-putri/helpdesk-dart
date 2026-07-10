import React from 'react';
import { PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = <PackageOpen className="w-16 h-16" />, 
  title, 
  description 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="text-slate-300 dark:text-slate-600 mb-4 animate-pulse">
        {icon}
      </div>
      <h3 className="font-tactical text-lg font-bold text-slate-700 dark:text-slate-300 tracking-widest uppercase mb-2">
        {title}
      </h3>
      <p className="font-mono text-xs text-slate-500 dark:text-slate-400 max-w-sm">
        {description}
      </p>
    </motion.div>
  );
};
