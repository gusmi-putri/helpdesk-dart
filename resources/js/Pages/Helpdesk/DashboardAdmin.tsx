import React, { useState, useEffect, Suspense, lazy } from 'react';
import { FileArchive } from 'lucide-react';

import Sidebar from './AdminComponents/Sidebar';
import Topbar from './AdminComponents/Topbar';
import RecapModal from './AdminComponents/RecapModal';
import RejectConfirmModal from './AdminComponents/RejectConfirmModal';

import { useStore } from '@/store/useStore';
import { router } from '@inertiajs/react';

// Lazy loaded components for better performance
const AnalyticsSection = lazy(() => import('./AdminComponents/AnalyticsSection'));
const UsersTable = lazy(() => import('./AdminComponents/UsersTable'));
const UnitsTable = lazy(() => import('./AdminComponents/UnitsTable'));
const LogsTable = lazy(() => import('./AdminComponents/LogsTable'));
const ReportsSection = lazy(() => import('./AdminComponents/ReportsSection'));
const ApprovalCenter = lazy(() => import('./AdminComponents/ApprovalCenter'));
const FeedbackTable = lazy(() => import('./AdminComponents/FeedbackTable'));
const MonitoringMap = lazy(() => import('./AdminComponents/MonitoringMap'));
const SatuansTable = lazy(() => import('./AdminComponents/SatuansTable'));

type SubMenuReport = 'KERUSAKAN' | 'PERBAIKAN';
type MenuTab = 'ANALYTICS' | 'MAP' | 'USERS' | 'LOGS' | 'REPORTS' | 'UNITS' | 'SATUANS' | 'APPROVAL_CENTER' | 'FEEDBACK';

const DashboardAdmin = (props: any) => {
  const { dbCases = [], dbUsers = [], dbLogs = [], dbRoles = [], dbUnits = [], dbSatuans = [], dbFeedbacks = [], dbFeedbackUnreadCount = 0, dbMutations = [], dbUserMutations = [], dbArchivedUnits = [] } = props;
  const [activeMenu, setActiveMenu] = useState<MenuTab>('ANALYTICS');
  const [activeSubReport, setActiveSubReport] = useState<SubMenuReport>('KERUSAKAN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [reportStatusFilter, setReportStatusFilter] = useState<'ALL' | 'PENDING' | 'DIVERIFIKASI' | 'DITERIMA TEKNISI' | 'DIPROSES' | 'SELESAI' | 'DITOLAK'>('ALL');
  const [mapFocusSatuan, setMapFocusSatuan] = useState<string | null>(null);

  // Auto-polling dengan deteksi keaktifan halaman (visibility)
  useEffect(() => {
    let intervalId: any;

    const startPolling = () => {
      intervalId = setInterval(() => {
        router.reload({ only: ['dbCases', 'dbUsers', 'dbLogs', 'dbUnits', 'dbFeedbacks', 'dbFeedbackUnreadCount'] });
      }, 15000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        startPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const currentUser = useStore(state => state.currentUser);
  const addNotification = useStore(state => state.addNotification);

  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [selectedLogPayload, setSelectedLogPayload] = useState<string | null>(null);


  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [recapPeriod, setRecapPeriod] = useState<'weekly' | 'monthly' | 'yearly' | 'custom' | 'year_specific'>('monthly');
  const [recapStartDate, setRecapStartDate] = useState<string>('');
  const [recapEndDate, setRecapEndDate] = useState<string>('');
  const [recapYear, setRecapYear] = useState<string>(new Date().getFullYear().toString());

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [userToReject, setUserToReject] = useState<any>(null);

  // Handlers
  const handlePrintCasePDF = (caseData: any) => {
    window.open(`/reports/${caseData.db_id}/pdf`, '_blank');
  };

  const handleApproveUser = (mutation: any) => {
    const endpoint = mutation.type === 'request_register' 
      ? `/users/${mutation.id}/approve-registration` 
      : `/users/${mutation.id}/approve`;
      
    router.post(endpoint, {}, {
      onSuccess: () => {
        // Notification logic if any
      }
    });
  };

  const handleRejectUser = (mutation: any) => {
    setUserToReject(mutation);
    setIsRejectModalOpen(true);
  };

  const confirmRejectUser = (reason: string = 'Ditolak oleh Admin') => {
    if (userToReject) {
      const endpoint = userToReject.type === 'request_register'
        ? `/users/${userToReject.id}/reject-registration`
        : `/users/${userToReject.id}/reject`;
        
      router.post(endpoint, { admin_notes: reason }, {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setUserToReject(null);
        }
      });
    }
  };


  const handleExportRecap = () => {
    if (recapPeriod === 'custom' && (!recapStartDate || !recapEndDate)) {
      addNotification('Tanggal mulai dan selesai wajib diisi untuk rekap kustom.', 'error');
      return;
    }
    if (recapPeriod === 'year_specific' && !recapYear) {
      addNotification('Tahun wajib diisi.', 'error');
      return;
    }

    let url = `/admin/recap/export?period=${recapPeriod}`;
    if (recapPeriod === 'custom') {
      url += `&start_date=${recapStartDate}&end_date=${recapEndDate}`;
    } else if (recapPeriod === 'year_specific') {
      url += `&year=${recapYear}`;
    }
    window.open(url, '_blank');
    setIsRecapModalOpen(false);
  };

  // ==========================================
  // MAIN RENDER WITH NESTED SIDEBAR LAYOUT
  // ==========================================
  return (
    <div className="h-screen bg-slate-50 dark:bg-cighra-dark flex flex-col font-sans selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-gunmetal relative text-slate-800 dark:text-slate-200">

      <Topbar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentUser={currentUser}
        />
      <div className="flex-1 flex overflow-hidden">

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeMenu={activeMenu}
        handleMenuClick={setActiveMenu}
        dbUsers={dbUsers}
        dbMutations={dbMutations}
        dbSatuans={dbSatuans}        dbFeedbackUnreadCount={dbFeedbackUnreadCount}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

        

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">

            {/* Page Title Header */}
            <div className="mb-6 flex justify-between items-end border-b border-slate-200 dark:border-slate-600 pb-3">
              <div>
                <h2 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase">
                  {activeMenu === 'ANALYTICS' ? 'ANALISIS DATA' :
                    activeMenu === 'MAP' ? 'PETA MONITORING' :
                    activeMenu === 'REPORTS' ? 'DATA LAPORAN' :
                    activeMenu === 'USERS' ? 'DATABASE PERSONEL' :
                    activeMenu === 'LOGS' ? 'LOG AKTIVITAS SISTEM' :
                    activeMenu === 'UNITS' ? 'DATABASE INVENTARIS' :
                    activeMenu === 'SATUANS' ? 'DATA SATUAN' :
                    activeMenu === 'APPROVAL_CENTER' ? 'PUSAT PERSETUJUAN' :
                    activeMenu === 'FEEDBACK' ? 'UMPAN BALIK PENGGUNA' :
                    'DASHBOARD ADMIN'}
                </h2>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-widest">
                  {activeMenu === 'ANALYTICS' ? 'Ringkasan statistik dan grafik data laporan sistem.' :
                    activeMenu === 'MAP' ? 'Visualisasi sebaran dan status unit DART secara geografis.' :
                    activeMenu === 'REPORTS' ? 'Kelola seluruh data laporan kerusakan dan perbaikan.' :
                    activeMenu === 'USERS' ? 'Kelola data pengguna dan akun personel sistem.' :
                    activeMenu === 'LOGS' ? 'Rekaman seluruh aktivitas dan perubahan data sistem.' :
                    activeMenu === 'UNITS' ? 'Status kesiapan unit DART.' :
                    activeMenu === 'SATUANS' ? 'Kelola data satuan dan unit yang terdaftar.' :
                    activeMenu === 'APPROVAL_CENTER' ? 'Tinjau dan setujui pengajuan mutasi serta registrasi.' :
                    activeMenu === 'FEEDBACK' ? 'Umpan balik dan penilaian dari pengguna sistem.' :
                    'Sistem Manajemen Pelaporan Kerusakan Dart.'}
                </p>
              </div>

              {activeMenu === 'REPORTS' && (
                <button
                  onClick={() => setIsRecapModalOpen(true)}
                  className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-5 py-2 font-tactical font-bold text-xs tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-all flex items-center gap-2 shadow-lg"
                >
                  <FileArchive className="w-4 h-4" /> CETAK REKAPITULASI
                </button>
              )}
            </div>

            <Suspense fallback={
              <div className="flex items-center justify-center h-64 w-full">
                <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                  <div className="w-10 h-10 border-4 border-cighra-gold border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-tactical tracking-[0.2em] uppercase text-cighra-gold animate-pulse">Memuat Komponen...</span>
                </div>
              </div>
            }>
              {activeMenu === 'ANALYTICS' && <AnalyticsSection dbCases={dbCases} />}
              {activeMenu === 'MAP' && (
                <MonitoringMap 
                  dbUnits={dbUnits} 
                  dbCases={dbCases} 
                  dbSatuans={dbSatuans} 
                  initialFocusSatuan={mapFocusSatuan}
                />
              )}
              {activeMenu === 'REPORTS' && (
                <ReportsSection
                  dbCases={dbCases}
                  reportStatusFilter={reportStatusFilter}
                  setReportStatusFilter={setReportStatusFilter}
                  activeSubReport={activeSubReport}
                  setActiveSubReport={setActiveSubReport}
                  setIsRecapModalOpen={setIsRecapModalOpen}
                  handlePrintCasePDF={handlePrintCasePDF}
                />
              )}
              {activeMenu === 'USERS' && (
                <UsersTable
                  dbUsers={dbUsers}
                  dbRoles={dbRoles}
                  dbSatuans={dbSatuans}
                />
              )}
              {activeMenu === 'LOGS' && (
                <LogsTable
                  dbLogs={dbLogs}
                  logFilter={logFilter}
                  setLogFilter={setLogFilter}
                  setSelectedLogPayload={setSelectedLogPayload}
                />
              )}
              {activeMenu === 'UNITS' && (
                <UnitsTable
                  dbUnits={dbUnits}
                  dbSatuans={dbSatuans}
                  dbCases={dbCases}
                />
              )}
              {activeMenu === 'SATUANS' && (
                <SatuansTable
                  dbSatuans={dbSatuans}
                  dbUnits={dbUnits}
                  dbCases={dbCases}
                  dbUsers={dbUsers}
                  handleViewOnMap={(satuan: any) => {
                    setMapFocusSatuan(satuan.nama_satuan);
                    setActiveMenu('MAP');
                  }}
                />
              )}
              {activeMenu === 'APPROVAL_CENTER' && (
                <ApprovalCenter
                  dbUsers={dbUsers}
                  dbMutations={dbMutations}
                  dbUserMutations={dbUserMutations}
                  dbSatuans={dbSatuans}
                  dbArchivedUnits={dbArchivedUnits}
                  handleApproveUser={handleApproveUser}
                  handleRejectUser={handleRejectUser}
                />
              )}
              {activeMenu === 'FEEDBACK' && <FeedbackTable dbFeedbacks={dbFeedbacks} />}
            </Suspense>
          </div>
        </div>
      </main>
      </div>

      {/* MODAL COMPONENTS */}
      <RecapModal
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
        recapPeriod={recapPeriod}
        setRecapPeriod={setRecapPeriod}
        recapStartDate={recapStartDate}
        setRecapStartDate={setRecapStartDate}
        recapEndDate={recapEndDate}
        setRecapEndDate={setRecapEndDate}
        recapYear={recapYear}
        setRecapYear={setRecapYear}
        onExport={handleExportRecap}
      />

      <RejectConfirmModal
        isOpen={isRejectModalOpen}
        onClose={() => { setIsRejectModalOpen(false); setUserToReject(null); }}
        onConfirm={confirmRejectUser}
        userName={userToReject?.user_data?.nama_lengkap || userToReject?.target_user?.name || ''}
        actionType={userToReject?.type?.replace('request_', '') || 'register'}
      />

    </div>
  );
};

export default DashboardAdmin;
