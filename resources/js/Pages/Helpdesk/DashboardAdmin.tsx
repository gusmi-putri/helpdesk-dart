import React, { useState, useEffect } from 'react';

import Sidebar from './AdminComponents/Sidebar';
import Topbar from './AdminComponents/Topbar';
import AnalyticsSection from './AdminComponents/AnalyticsSection';
import UsersTable from './AdminComponents/UsersTable';
import UnitsTable from './AdminComponents/UnitsTable';
import LogsTable from './AdminComponents/LogsTable';
import ReportsSection from './AdminComponents/ReportsSection';
import ApprovalCenter from './AdminComponents/ApprovalCenter';
import FeedbackTable from './AdminComponents/FeedbackTable';
import MonitoringMap from './AdminComponents/MonitoringMap';
import SatuansTable from './AdminComponents/SatuansTable';
import RecapModal from './AdminComponents/RecapModal';
import RejectConfirmModal from './AdminComponents/RejectConfirmModal';
import LogoutConfirmModal from '@/Components/LogoutConfirmModal';
import { useStore } from '@/store/useStore';
import { router } from '@inertiajs/react';

type SubMenuReport = 'KERUSAKAN' | 'PERBAIKAN';
type MenuTab = 'ANALYTICS' | 'MAP' | 'USERS' | 'LOGS' | 'REPORTS' | 'UNITS' | 'SATUANS' | 'APPROVAL_CENTER' | 'FEEDBACK';

const DashboardAdmin = (props: any) => {
  const { dbCases = [], dbUsers = [], dbLogs = [], dbRoles = [], dbUnits = [], dbSatuans = [], dbFeedbacks = [], dbMutations = [], dbUserMutations = [], dbArchivedUnits = [] } = props;
  const [activeMenu, setActiveMenu] = useState<MenuTab>('ANALYTICS');
  const [activeSubReport, setActiveSubReport] = useState<SubMenuReport>('KERUSAKAN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [reportStatusFilter, setReportStatusFilter] = useState<'ALL' | 'PENDING' | 'DIVERIFIKASI' | 'DITERIMA TEKNISI' | 'DIPROSES' | 'SELESAI' | 'DITOLAK'>('ALL');
  const [mapFocusSatuan, setMapFocusSatuan] = useState<string | null>(null);

  // Auto-polling dengan deteksi keaktifan halaman (visibility)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startPolling = () => {
      intervalId = setInterval(() => {
        router.reload({ only: ['dbCases', 'dbUsers', 'dbLogs', 'dbUnits'] });
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
  const logoutAction = useStore(state => state.logout);
  const addNotification = useStore(state => state.addNotification);

  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [selectedLogPayload, setSelectedLogPayload] = useState<any>(null); // from LogsTable if needed

  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [recapPeriod, setRecapPeriod] = useState<'weekly' | 'monthly' | 'yearly' | 'custom' | 'year_specific'>('monthly');
  const [recapStartDate, setRecapStartDate] = useState<string>('');
  const [recapEndDate, setRecapEndDate] = useState<string>('');
  const [recapYear, setRecapYear] = useState<string>(new Date().getFullYear().toString());
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [userToReject, setUserToReject] = useState<any>(null);

  // Handlers
  const handlePrintCasePDF = (caseData: any) => {
    window.open(`/reports/${caseData.db_id}/pdf`, '_blank');
  };

  const handleApproveUser = (mutation: any) => {
    router.post(`/users/${mutation.id}/approve`, {}, {
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
      router.post(`/users/${userToReject.id}/reject`, { admin_notes: reason }, {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setUserToReject(null);
        }
      });
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logoutAction();
    router.visit('/login');
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
    <div className="min-h-screen bg-slate-50 dark:bg-cighra-dark flex font-sans selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-gunmetal relative text-slate-800 dark:text-slate-200">

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
        dbSatuans={dbSatuans}
        handleLogout={handleLogout}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

        <Topbar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentUser={currentUser}
        />

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">
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
                handleViewOnMap={(satuan) => {
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
          </div>
        </div>
      </main>

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

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default DashboardAdmin;
