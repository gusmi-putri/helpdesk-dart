import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { router, useForm } from '@inertiajs/react';
import LogoutConfirmModal from '@/Components/LogoutConfirmModal';

// Sub-components
import PelaporSidebar from './PelaporComponents/PelaporSidebar';
import PelaporTopbar from './PelaporComponents/PelaporTopbar';
import ReportForm from './PelaporComponents/ReportForm';
import ReportHistory from './PelaporComponents/ReportHistory';
import PelaporReportDetailModal from './PelaporComponents/PelaporReportDetailModal';

type MenuTab = 'FORM' | 'HISTORY';

const DashboardPelapor = ({ dbCases = [], dbUnits = [], dbUsers = [], authUser = null }: any) => {
  const [activeMenu, setActiveMenu] = useState<MenuTab>('FORM');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<number | string | null>(null);
  const [filterTime, setFilterTime] = useState<'ALL' | 'TODAY' | 'WEEK'>('ALL');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const addNotification = useStore(state => state.addNotification);
  const currentUser = useStore(state => state.currentUser);
  const logoutAction = useStore(state => state.logout);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find current user's DB ID
  const dbUser = dbUsers.find((u: any) => u.username === currentUser?.username);

  // Filter & Sort History
  const history = dbCases
    .filter((r: any) => r.kerusakan.pelapor_id === dbUser?.db_id)
    .sort((a: any, b: any) => b.db_id - a.db_id);

  const filteredHistory = history.filter((item: any) => {
    if (filterTime === 'ALL') return true;
    
    const parseDate = (str: string) => {
        try { return new Date(str.replace(',', '')); } catch(e) { return new Date(0); }
    };

    const itemDate = parseDate(item.kerusakan.tanggal);
    const now = new Date();

    if (filterTime === 'TODAY') return itemDate.toDateString() === now.toDateString();
    if (filterTime === 'WEEK') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return itemDate >= oneWeekAgo;
    }
    return true;
  });

  const selectedItem = dbCases.find((c: any) => c.db_id === selectedItemId);

  // Form handling
  const { data, setData, post, processing, reset, errors } = useForm({
    unit_id: '',
    deskripsi: '',
    tingkat_kerusakan: '',
    urgensi: '',
    klasifikasi: '',
    file_bukti: [] as File[],
  });

  // Auto-polling
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases', 'dbUnits', 'dbUsers'] });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setData('file_bukti', [...data.file_bukti, ...newFiles].slice(0, 5));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setData('file_bukti', data.file_bukti.filter((_, i) => i !== index));
  };

  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    post('/reports', {
      onSuccess: () => {
        reset();
        addNotification('Laporan Anda telah berhasil terkirim ke pusat komando.');
        setActiveMenu('HISTORY');
      },
      onError: () => {
        addNotification('Gagal mengirim laporan. Silakan periksa kembali koneksi Anda.', 'error');
      }
    });
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logoutAction();
    router.visit('/login');
  };

  return (
    <div className="min-h-screen bg-cighra-light dark:bg-cighra-dark flex font-sans selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-gunmetal relative text-slate-800 dark:text-slate-200">
      
      <PelaporSidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

        <PelaporTopbar 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentUser={currentUser}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeMenu === 'FORM' ? (
            <ReportForm 
              data={data}
              setData={setData}
              errors={errors}
              processing={processing}
              handleSubmit={handleSubmitNewReport}
              dbUnits={dbUnits}
              authUser={authUser}
              currentUser={currentUser}
              fileInputRef={fileInputRef}
              handleFileSelect={handleFileSelect}
              removeFile={removeFile}
            />
          ) : (
            <ReportHistory 
              history={filteredHistory}
              filterTime={filterTime}
              setFilterTime={setFilterTime}
              onSelectItem={setSelectedItemId}
            />
          )}
        </div>
      </main>

      <PelaporReportDetailModal 
        isOpen={!!selectedItemId}
        onClose={() => setSelectedItemId(null)}
        report={selectedItem}
      />

      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />

    </div>
  );
};

export default DashboardPelapor;
