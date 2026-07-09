import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle: _,
  icon,
  children,
  footer,
  maxWidth = 'lg'
}) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      {/* Backdrop (Click to close) */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className={`relative bg-white dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full ${maxWidthClasses[maxWidth]} shadow-[0_0_80px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 rounded-sm overflow-hidden flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        <div className="p-5 border-b border-cighra-primary dark:border-cighra-gold bg-red-500/10 dark:bg-red-900/10 flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="w-8 h-8 text-red-500 animate-pulse">
                {icon}
              </div>
            )}
            <h3 className="font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase text-xl">
              {title}
            </h3>
          </div>
          
          <button 
            onClick={onClose} 
            className="p-2 text-slate-500 hover:text-white hover:bg-red-600 dark:text-slate-400 dark:hover:text-white dark:hover:bg-red-600 transition-colors rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6 text-left">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
