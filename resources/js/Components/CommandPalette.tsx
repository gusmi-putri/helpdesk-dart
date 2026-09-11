import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Search, Loader2, FileText, User, Monitor, X } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useStore } from '@/store/useStore';

interface SearchResult {
  id: number;
  caseId?: string;
  title: string;
  subtitle: string;
  type: 'report' | 'user' | 'unit';
  status?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    reports: SearchResult[];
    users: SearchResult[];
    units: SearchResult[];
  }>({ reports: [], users: [], units: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setResults({ reports: [], users: [], units: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults({ reports: [], users: [], units: [] });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item: SearchResult) => {
    setIsOpen(false);
    
    // Route to the relevant page where they can search or open the modal.
    if (item.type === 'report') {
      useStore.getState().setGlobalSearch(item.caseId || item.title);
      window.dispatchEvent(new CustomEvent('global-search', { detail: { type: 'REPORTS' } }));
    } else if (item.type === 'user') {
      useStore.getState().setGlobalSearch(item.title);
      window.dispatchEvent(new CustomEvent('global-search', { detail: { type: 'USERS' } }));
    } else if (item.type === 'unit') {
      useStore.getState().setGlobalSearch(item.title);
      window.dispatchEvent(new CustomEvent('global-search', { detail: { type: 'UNITS' } }));
    }
  };

  const hasResults = results.reports.length > 0 || results.users.length > 0 || results.units.length > 0;

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={setIsOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden rounded-xl bg-white dark:bg-cighra-darkcard shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-all">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500"
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  type="text"
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm outline-none"
                  placeholder="Cari Laporan (LPR-xxx), Personel, atau Barang..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {isLoading && (
                  <Loader2 className="absolute right-4 top-3.5 h-5 w-5 animate-spin text-cighra-gold" />
                )}
                {!isLoading && query && (
                  <button onClick={() => setQuery('')} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 outline-none">
                     <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {hasResults && (
                <div className="max-h-[60vh] scroll-py-3 overflow-y-auto p-3">
                  {results.reports.length > 0 && (
                    <div className="mb-4">
                      <h2 className="mb-2 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Laporan</h2>
                      <ul className="space-y-1">
                        {results.reports.map((report) => (
                          <li
                            key={`report-${report.id}`}
                            className="group flex cursor-pointer select-none items-center rounded-md px-3 py-2 hover:bg-cighra-primary/10 dark:hover:bg-slate-800"
                            onClick={() => handleSelect(report)}
                          >
                            <FileText className="h-5 w-5 flex-none text-slate-400 group-hover:text-cighra-primary dark:group-hover:text-cighra-gold" />
                            <div className="ml-3 flex-auto">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{report.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{report.subtitle}</p>
                            </div>
                            {report.status && (
                              <span className="ml-3 flex-none text-xs text-cighra-primary dark:text-cighra-gold font-medium">
                                {report.status}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {results.users.length > 0 && (
                    <div className="mb-4">
                      <h2 className="mb-2 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Personel</h2>
                      <ul className="space-y-1">
                        {results.users.map((user) => (
                          <li
                            key={`user-${user.id}`}
                            className="group flex cursor-pointer select-none items-center rounded-md px-3 py-2 hover:bg-cighra-primary/10 dark:hover:bg-slate-800"
                            onClick={() => handleSelect(user)}
                          >
                            <User className="h-5 w-5 flex-none text-slate-400 group-hover:text-cighra-primary dark:group-hover:text-cighra-gold" />
                            <div className="ml-3 flex-auto">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{user.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{user.subtitle}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {results.units.length > 0 && (
                    <div>
                      <h2 className="mb-2 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Barang / Unit</h2>
                      <ul className="space-y-1">
                        {results.units.map((unit) => (
                          <li
                            key={`unit-${unit.id}`}
                            className="group flex cursor-pointer select-none items-center rounded-md px-3 py-2 hover:bg-cighra-primary/10 dark:hover:bg-slate-800"
                            onClick={() => handleSelect(unit)}
                          >
                            <Monitor className="h-5 w-5 flex-none text-slate-400 group-hover:text-cighra-primary dark:group-hover:text-cighra-gold" />
                            <div className="ml-3 flex-auto">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{unit.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{unit.subtitle}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {query.trim().length >= 2 && !hasResults && !isLoading && (
                <div className="px-6 py-14 text-center text-sm sm:px-14">
                  <Search className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
                  <p className="mt-4 font-semibold text-slate-900 dark:text-white">Tidak ada hasil ditemukan</p>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">Kami tidak dapat menemukan apa pun dengan istilah tersebut. Silakan coba lagi.</p>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommandPalette;
