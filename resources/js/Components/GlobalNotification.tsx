import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const GlobalNotification = () => {
  const notifications = useStore((state) => state.notifications);
  const removeNotification = useStore((state) => state.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto animate-in slide-in-from-right-full duration-300"
        >
          <div className={`
            flex items-center gap-4 p-4 border-l-4 shadow-2xl min-w-[320px] max-w-md backdrop-blur-md
            ${n.type === 'success' 
              ? 'bg-olive/90 border-gunmetal text-white' 
              : n.type === 'error'
              ? 'bg-targetred/90 border-white text-white'
              : 'bg-blue-600/90 border-white text-white'}
          `}>
            <div className="bg-white/20 p-2 rounded-sm shrink-0">
              {n.type === 'success' ? <CheckCircle size={20} /> : n.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
            </div>
            
            <div className="flex-1">
              <div className="text-[10px] font-mono font-bold tracking-[0.2em] opacity-70 uppercase leading-none mb-1">
                {n.type === 'success' ? 'SYSTEM NOTIFICATION' : n.type === 'error' ? 'ENCRYPTED ERROR' : 'SITREP UPDATE'}
              </div>
              <div className="text-sm font-tactical tracking-widest font-bold uppercase leading-tight">
                {n.message}
              </div>
            </div>

            <button 
              onClick={() => removeNotification(n.id)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GlobalNotification;
