import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

interface DBNotification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    actionUrl?: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<DBNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = useStore((state) => state.unreadCount);
  const setUnreadCount = useStore((state) => state.setUnreadCount);

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when opened to get fresh data
  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.post(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post('/api/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500 bg-green-500/10';
      case 'error': return 'text-red-500 bg-red-500/10';
      case 'warning': return 'text-amber-500 bg-amber-500/10';
      default: return 'text-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 flex items-center justify-center border border-slate-200/20 dark:border-slate-600 rounded shadow-sm bg-black/10 dark:bg-cighra-darkcard/80 focus-visible:ring focus-visible:ring-cighra-gold focus-visible:outline-none hover:bg-black/20 dark:hover:bg-cighra-darkcard transition-all active:scale-95 duration-300 text-slate-600 dark:text-slate-300"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-cighra-darkcard rounded-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="font-semibold text-slate-800 dark:text-white uppercase font-sans tracking-wider text-sm">Notifikasi</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-cighra-primary dark:text-cighra-gold hover:opacity-80 flex items-center gap-1 transition-opacity uppercase tracking-wider font-semibold"
                >
                  <Check className="w-3 h-3" />
                  Tandai semua dibaca
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-6 h-6 border-2 border-cighra-primary dark:border-cighra-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 transition-colors ${!notif.read_at ? 'bg-cighra-primary/5 dark:bg-slate-800/60' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-full h-fit flex-shrink-0 ${getIconColor(notif.data.type)}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notif.read_at ? 'text-slate-800 dark:text-white font-semibold' : 'text-slate-600 dark:text-slate-300'}`}>
                            {notif.data.message}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>{new Date(notif.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            {!notif.read_at && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="text-cighra-primary dark:text-cighra-gold hover:opacity-80 transition-opacity font-medium"
                              >
                                Tandai dibaca
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-3">
                    <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada notifikasi</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
