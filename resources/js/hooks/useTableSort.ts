import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useTableSort<T>(items: T[], initialSortConfig: SortConfig | null = null) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialSortConfig);

  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;
    
    return [...items].sort((a, b) => {
      const valA = a[sortConfig.key as keyof T];
      const valB = b[sortConfig.key as keyof T];
      
      if (valA === valB) return 0;
      
      // Handle null/undefined gracefully
      if (valA == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (valB == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Basic string comparison (case insensitive)
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortConfig.direction === 'asc' 
          ? valA.localeCompare(valB, undefined, { numeric: true }) 
          : valB.localeCompare(valA, undefined, { numeric: true });
      }

      // Fallback for numbers, dates etc.
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  return { sortedItems, sortConfig, handleSort, setSortConfig };
}
