import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    default: 'bg-cighra-primary dark:bg-cighra-darkcard border-b border-cighra-primary dark:border-cighra-gold backdrop-blur-md',
    primary: 'bg-cighra-primary dark:bg-cighra-darkcard border-b border-cighra-primary dark:border-cighra-gold backdrop-blur-md',
    danger: 'bg-cighra-primary dark:bg-cighra-darkcard border-b border-cighra-primary dark:border-cighra-gold backdrop-blur-md'
  };

  const titleTheme = {
    default: 'text-white dark:text-white',
    primary: 'text-white dark:text-white',
    danger: 'text-white dark:text-white'
  };

  const modalBorderTheme = {
    default: 'border-2 border-cighra-primary dark:border-cighra-gold',
    primary: 'border-2 border-cighra-primary dark:border-cighra-gold',
    danger: 'border-2 border-cighra-primary dark:border-cighra-gold'
  };

  const closeBtnTheme = {
    default: 'text-slate-300 hover:text-white hover:bg-white/20 dark:text-slate-400 dark:hover:text-red-500 transition-colors',
    primary: 'text-slate-300 hover:text-white hover:bg-white/20 dark:text-slate-400 dark:hover:text-white dark:hover:bg-red-600 transition-colors',
    danger: 'text-slate-300 hover:text-white hover:bg-white/20 dark:text-slate-400 dark:hover:text-white dark:hover:bg-red-600 transition-colors'
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 px-6 overflow-y-auto">
          {/* Backdrop (Click to close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className={`relative bg-white dark:bg-cighra-darkcard w-full ${modalBorderTheme[headerColor]} ${maxWidthClasses[maxWidth]} shadow-[0_0_100px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden text-left flex flex-col max-h-[90vh] z-10`}
          >

            {/* Header */}
            <div className={`p-5 flex items-center justify-between shrink-0 relative ${headerTheme[headerColor]}`}>
              <div className="flex items-center gap-4">
                {icon && (
                  <div className={`w-8 h-8 text-white dark:text-red-500 animate-pulse flex items-center justify-center`}>
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
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-6 md:p-8">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex gap-3 shrink-0 relative z-20">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
};
