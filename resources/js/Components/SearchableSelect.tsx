import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

interface Option {
  id: string | number;
  label: string;
  sublabel?: string;
  tag?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  label?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Cari unit...",
  error,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id.toString() === value.toString());

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (opt.tag && opt.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 50);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef} style={{ zIndex: isOpen ? 100 : 1 }}>
      {label && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label} <span className="text-targetred">*</span></label>}
      
      {/* Trigger Area */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white dark:bg-black/50 border ${error ? 'border-red-500' : isOpen ? 'border-olive ring-1 ring-olive' : 'border-gray-300 dark:border-gray-700'} px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-all rounded-sm hover:border-olive group relative z-10`}
      >
        <span className={`truncate ${selectedOption ? 'text-gunmetal dark:text-white font-medium' : 'text-gray-400'}`}>
          {selectedOption ? `${selectedOption.label} — ${selectedOption.sublabel} (${selectedOption.tag})` : placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180 text-olive' : ''}`} />
      </div>

      {/* Dropdown Area - Kembali ke Absolute agar sinkron dengan container */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gunmetal border border-gray-300 dark:border-gray-700 shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
          <div className="p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20 flex items-center gap-2">
            <Search size={14} className="text-gray-400" />
            <input 
              autoFocus
              type="text" 
              placeholder="Ketik nomor seri atau nama unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono p-1 text-gunmetal dark:text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-targetred">
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div 
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`px-4 py-3 hover:bg-olive hover:text-white cursor-pointer transition-colors flex flex-col border-b border-gray-100 dark:border-gray-800 last:border-none ${value.toString() === opt.id.toString() ? 'bg-olive/10 border-l-4 border-l-olive' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-xs tracking-wider">{opt.label}</span>
                    {value.toString() === opt.id.toString() && <Check size={14} className="text-olive" />}
                  </div>
                  <span className="text-[10px] opacity-70 uppercase tracking-tighter mt-0.5">{opt.sublabel} | {opt.tag}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-500 font-mono italic">
                Data tidak ditemukan...
              </div>
            )}
            {options.length > 50 && searchQuery === '' && (
              <div className="p-2 text-center text-[9px] text-gray-400 font-mono border-t border-gray-100 dark:border-gray-800">
                MENAMPILKAN 50 DARI {options.length} UNIT. GUNAKAN FITUR CARI.
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
