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
      {label && <label className="block text-sm font-semibold text-soft-gunmetal dark:text-soft-sand mb-2 uppercase">{label} <span className="text-targetred">*</span></label>}
      
      {/* Trigger Area */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-sand/10 dark:bg-black/50 border ${error ? 'border-targetred' : isOpen ? 'border-olive ring-1 ring-olive' : 'border-soft-gunmetal/20 dark:border-soft-sand/10'} px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-all rounded-sm hover:border-olive group relative z-10`}
      >
        <span className={`truncate ${selectedOption ? 'text-gunmetal dark:text-white font-medium' : 'text-soft-gunmetal/40 dark:text-soft-sand/30'}`}>
          {selectedOption ? `${selectedOption.label} — ${selectedOption.sublabel} (${selectedOption.tag})` : placeholder}
        </span>
        <ChevronDown size={18} className={`text-soft-gunmetal/40 dark:text-soft-sand/30 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180 text-olive' : ''}`} />
      </div>

      {/* Dropdown Area - Kembali ke Absolute agar sinkron dengan container */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-sand dark:bg-gunmetal border border-soft-gunmetal/10 dark:border-soft-sand/5 shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
          <div className="p-2 border-b border-soft-gunmetal/10 dark:border-soft-sand/5 bg-sand/30 dark:bg-black/20 flex items-center gap-2">
            <Search size={14} className="text-soft-gunmetal/40 dark:text-soft-sand/30" />
            <input 
              autoFocus
              type="text" 
              placeholder="Cari seri atau nama unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono p-1 text-gunmetal dark:text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-soft-gunmetal/40 hover:text-targetred">
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
                  className={`px-4 py-3 hover:bg-olive hover:text-sand cursor-pointer transition-colors flex flex-col border-b border-soft-gunmetal/5 dark:border-soft-sand/5 last:border-none ${value.toString() === opt.id.toString() ? 'bg-olive/10 border-l-4 border-l-olive' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-xs tracking-wider uppercase">{opt.label}</span>
                    {value.toString() === opt.id.toString() && <Check size={14} className="text-olive" />}
                  </div>
                  <span className="text-[10px] opacity-70 uppercase tracking-tighter mt-0.5 font-mono">{opt.sublabel} | {opt.tag}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-soft-gunmetal/40 dark:text-soft-sand/30 font-mono italic">
                Data tidak ditemukan...
              </div>
            )}
            {options.length > 50 && searchQuery === '' && (
              <div className="p-2 text-center text-[9px] text-soft-gunmetal/30 dark:text-soft-sand/20 font-mono border-t border-soft-gunmetal/5 dark:border-soft-sand/5 uppercase tracking-widest">
                Menampilkan 50 dari {options.length} unit. Gunakan fitur cari.
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[9px] text-targetred mt-1 font-mono uppercase italic">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
