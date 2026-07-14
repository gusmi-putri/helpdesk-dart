import React from 'react';
import { ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { SortConfig } from '@/hooks/useTableSort';

interface SortableHeaderProps {
  label: string;
  sortKey?: string;
  currentSort?: SortConfig | null;
  onSort?: (key: string) => void;
  className?: string;
  width?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ 
  label, 
  sortKey, 
  currentSort, 
  onSort, 
  className = "",
  width
}) => {
  const isDark = className === "" || className.includes("text-white") || !className.includes("text-");
  
  return (
    <th 
      className={`p-4 text-center whitespace-nowrap tracking-widest uppercase ${sortKey ? 'cursor-pointer transition-colors' : ''} ${isDark ? 'text-white font-tactical hover:bg-slate-700/50' : ''} ${className}`}
      style={width ? { width } : undefined}
      onClick={() => { if (sortKey && onSort) onSort(sortKey); }}
    >
      <div className="flex items-center justify-center gap-2">
        {label}
        {sortKey && (
          <div className="flex items-center">
            {currentSort?.key === sortKey ? (
              currentSort.direction === 'asc' 
                ? <ArrowUp className="w-3 h-3" /> 
                : <ArrowDown className="w-3 h-3" />
            ) : (
              <Filter className="w-3 h-3 opacity-30" />
            )}
          </div>
        )}
      </div>
    </th>
  );
};

export default SortableHeader;
