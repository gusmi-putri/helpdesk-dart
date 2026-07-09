import React from 'react';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  headerColor?: 'default' | 'primary' | 'danger';
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  maxWidth = '2xl',
  headerColor = 'default'
}) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl'
  };

  const headerTheme = {
    default: 'bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700',
    primary: 'bg-red-500/10 dark:bg-red-900/10 border-b border-cighra-primary dark:border-cighra-gold',
    danger: 'bg-red-500/10 dark:bg-red-900/10 border-b border-red-500/50'
  };

  const titleTheme = {
    default: 'text-slate-800 dark:text-white',
    primary: 'text-slate-800 dark:text-white',
    danger: 'text-red-600 dark:text-red-500'
  };

  const modalBorderTheme = {
    default: 'border border-slate-200 dark:border-slate-700',
    primary: 'border-2 border-cighra-primary dark:border-cighra-gold',
    danger: 'border-2 border-red-500/50'
  };

  const closeBtnTheme = {
    default: 'text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500',
    primary: 'text-slate-500 hover:text-white hover:bg-red-600 dark:text-slate-400 dark:hover:text-white dark:hover:bg-red-600',
    danger: 'text-slate-500 hover:text-white hover:bg-red-600 dark:text-slate-400 dark:hover:text-white dark:hover:bg-red-600'
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 px-6 overflow-y-auto">
      {/* Backdrop (Click to close) */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className={`relative bg-white dark:bg-cighra-darkcard w-full ${modalBorderTheme[headerColor]} ${maxWidthClasses[maxWidth]} shadow-[0_0_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300 rounded-sm overflow-hidden text-left flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        <div className={`p-5 flex items-center justify-between shrink-0 relative ${headerTheme[headerColor]}`}>
          <div className="flex items-center gap-4">
            {icon && (
              <div className="w-8 h-8 text-red-500 animate-pulse flex items-center justify-center">
                {icon}
              </div>
            )}
            <h3 className={`font-tactical font-bold tracking-widest uppercase text-xl ${titleTheme[headerColor]}`}>
              {title}
            </h3>
          </div>
          
          <button 
            onClick={onClose} 
            className={`p-2 transition-colors rounded-sm ${closeBtnTheme[headerColor]}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
