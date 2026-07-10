import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
interface ButtonProps extends BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', icon, isLoading, children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center gap-2 font-tactical tracking-widest uppercase rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-xl focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none";
    
    const variants = {
      primary: "bg-cighra-primary text-white dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 border border-cighra-primary dark:border-cighra-gold",
      secondary: "bg-transparent border border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
      outline: "border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
      danger: "bg-red-600 text-white hover:bg-red-700"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs font-bold",
      md: "px-5 py-2.5 text-sm font-bold",
      lg: "p-4 text-base font-bold"
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);


Button.displayName = 'Button';
