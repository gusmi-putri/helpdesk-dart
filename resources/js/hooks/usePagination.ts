import { useState, useMemo, useEffect } from 'react';

export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const [prevItemsLength, setPrevItemsLength] = useState(items.length);

  // Reset to page 1 if total items changes (e.g., due to search/filter)
  if (items.length !== prevItemsLength) {
    setPrevItemsLength(items.length);
    setCurrentPage(1);
  }

  return {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
    itemsPerPage,
    totalItems: items.length
  };
}
