import React, { useState, useEffect, Suspense, lazy } from 'react';
import { FileArchive, Activity } from 'lucide-react';

import Sidebar from './AdminComponents/Sidebar';
import Topbar from './AdminComponents/Topbar';
import RecapModal from './AdminComponents/RecapModal';
import RejectConfirmModal from './AdminComponents/RejectConfirmModal';

import { useStore } from '@/store/useStore';
import { router, usePage } from '@inertiajs/react';

// Lazy loaded components for better performance
const AnalyticsSection = lazy(() => import('./AdminComponents/AnalyticsSection'));
const UsersTable = lazy(() => import('./AdminComponents/UsersTable'));
const UnitsTable = lazy(() => import('./AdminComponents/UnitsTable'));
const LogsTable = lazy(() => import('./AdminComponents/LogsTable'));
const ReportsSection = lazy(() => import('./AdminComponents/ReportsSection'));
const ApprovalCenter = lazy(() => import('./AdminComponents/ApprovalCenter'));
const MonitoringMap = lazy(() => import('./AdminComponents/MonitoringMap'));
const SatuansTable = lazy(() => import('./AdminComponents/SatuansTable'));
const RolesTable = lazy(() => import('./AdminComponents/RolesTable'));

type SubMenuReport = 'KERUSAKAN' | 'PERBAIKAN';
type MenuTab = 'ANALYTICS' | 'MAP' | 'USERS' | 'LOGS' | 'REPORTS' | 'UNITS' | 'SATUANS' | 'APPROVAL_CENTER' | 'ROLES';

const DashboardAdmin = (props: any) => {
  const { dbCases = [], dbUsers = [], dbLogs = [], dbRoles = [], dbPermissions = [], dbUnits = [], dbSatuans = [], dbMutations = [], dbUserMutations = [], dbArchivedUnits = [] } = props;
  const userPermissions = (usePage().props as any).auth?.user?.permissions || [];
  const userRoles = (usePage().props as any).auth?.user?.roles || [];
  const isAdmin = userRoles.includes('Admin');

  const [activeMenu, setActiveMenu] = useState<MenuTab>('ANALYTICS');
  const [activeSubReport, setActiveSubReport] = useState<SubMenuReport>('KERUSAKAN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [reportStatusFilter, setReportStatusFilter] = useState<'ALL' | 'PENDING' | 'DIVERIFIKASI' | 'DITERIMA TEKNISI' | 'DIPROSES' | 'SELESAI' | 'DITOLAK'>('ALL');
  const [mapFocusSatuan, setMapFocusSatuan] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const renderUnauthorized = (menuName: string) => (
    <div className="flex flex-col items-center justify-center h-64 w-full bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-sm">
      <div className="text-red-500 mb-2">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <h3 className="text-lg font-tactical font-bold text-red-700 dark:text-red-400 uppercase tracking-widest">AKSES DITOLAK</h3>
      <p className="text-sm font-mono text-red-600 dark:text-red-300">Anda tidak memiliki izin untuk mengakses {menuName}.</p>
    </div>
  );

  // Auto-polling dengan deteksi keaktifan halaman (visibility)
  useEffect(() => {
    let intervalId: any;

    const startPolling = () => {
      intervalId = setInterval(() => {
        router.reload({ 
          only: ['dbCases', 'dbUsers', 'dbLogs', 'dbUnits'],
          onStart: () => setIsPolling(true),
          onFinish: () => setIsPolling(false)
        });
      }, 15000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        startPolling();
      }
    };

    const handleGlobalSearch = (e: any) => {
      if (e.detail && e.detail.type) {
        setActiveMenu(e.detail.type as MenuTab);
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('global-search', handleGlobalSearch);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('global-search', handleGlobalSearch);
    };
  }, []);

  // Guided Tour Admin
  useEffect(() => {
    import('driver.js').then(({ driver }) => {
      import('driver.js/dist/driver.css').then(() => {
        if (localStorage.getItem('tour_admin_done') !== 'true') {
          const driverObj = driver({
            showProgress: true,
            animate: true,
            nextBtnText: 'Selanjutnya ➔',
            prevBtnText: '← Sebelumnya',
            doneBtnText: 'Selesai',
            steps: [
              {
                popover: {
                  title: 'Pusat Komando (Admin)',
                  description: 'Selamat datang di Pusat Kontrol Utama SISFO DART. Sebagai Admin, Anda memiliki kendali penuh terhadap seluruh sistem. Mari kita lihat menu apa saja yang tersedia.',
                }
              },
              {
                element: '#tour-peta',
                popover: {
                  title: 'Peta Monitoring',
                  description: 'Menampilkan visualisasi geografis dari seluruh unit inventaris dan persebarannya per satuan.',
                  side: 'right',
                  align: 'start'
                }
              },
              {
                element: '#tour-analisis',
                popover: {
                  title: 'Analisis Data',
                  description: 'Dashboard khusus untuk memantau grafik tren kerusakan, durasi rata-rata perbaikan, dan ringkasan performa teknisi secara keseluruhan.',
                  side: 'right',
                  align: 'start'
                }
              },
              {
                element: '#tour-data-master-admin',
                popover: {
                  title: 'Data Master',
                  description: 'Direktori utama sistem. Di sini Anda bebas menambah, mengedit, atau menghapus data pangkalan/satuan, mengontrol akses personel, dan mengelola inventaris master.',
                  side: 'right',
                  align: 'start'
                }
              },
              {
                element: '#tour-persetujuan',
                popover: {
                  title: 'Pusat Persetujuan',
                  description: 'Semua registrasi akun baru (Pelapor/Staf) dan pengajuan mutasi barang wajib masuk dan disetujui melalui menu sentral ini.',
                  side: 'right',
                  align: 'start'
                }
              },
              {
                element: '#tour-laporan',
                popover: {
                  title: 'Data Laporan',
                  description: 'Manajemen tingkat tinggi untuk seluruh laporan kerusakan maupun arsip perbaikan. Anda juga bisa mengunduh rekapitulasinya di sini.',
                  side: 'right',
                  align: 'start'
                }
              },

              {
                element: '#tour-log',
                popover: {
                  title: 'Log Aktivitas Sistem',
                  description: 'Jejak rekam/audit operasional sistem. Setiap aksi krusial (seperti login, tambah data, perubahan status) oleh semua user akan tersimpan di sini demi transparansi.',
                  side: 'right',
                  align: 'start'
                }
              }
            ],
            onDestroyed: () => {
              localStorage.setItem('tour_admin_done', 'true');
            }
          });
          
          setTimeout(() => {
            driverObj.drive();
          }, 500);
        }
      });
    });
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
        handleMenuClick={(menu) => {
          setActiveMenu(menu);
          import('@/store/useStore').then(({ useStore }) => {
            useStore.getState().setGlobalSearch(null);
          });
        }}
        dbUsers={dbUsers}
        dbMutations={dbMutations}
        dbSatuans={dbSatuans}
        userPermissions={userPermissions}
        isAdmin={isAdmin}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">

            {/* Page Title Header */}
            <div className="mb-6 flex justify-between items-end border-b border-slate-200 dark:border-slate-600 pb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase flex items-center gap-3">
                    {activeMenu === 'ANALYTICS' ? 'ANALISIS DATA' :
                      activeMenu === 'MAP' ? 'PETA MONITORING' :
                      activeMenu === 'REPORTS' ? 'DATA LAPORAN' :
                      activeMenu === 'USERS' ? 'DATABASE PERSONEL' :
                      activeMenu === 'LOGS' ? 'LOG AKTIVITAS SISTEM' :
                      activeMenu === 'UNITS' ? 'DATABASE INVENTARIS' :
                      activeMenu === 'SATUANS' ? 'DATA SATUAN' :
                      activeMenu === 'ROLES' ? 'PENGATURAN ROLES & AKSES' :
                      activeMenu === 'APPROVAL_CENTER' ? 'PUSAT PERSETUJUAN' :
                      'DASHBOARD ADMIN'}
                    {isPolling && (
                      <span className="flex items-center gap-1.5 text-[10px] font-mono text-cighra-primary dark:text-cighra-gold tracking-widest animate-pulse border border-cighra-primary/30 dark:border-cighra-gold/30 px-2 py-0.5 bg-cighra-primary/5 dark:bg-cighra-gold/10 rounded-sm">
                        <Activity className="w-3 h-3 animate-spin" /> SYNCING...
                      </span>
                    )}
                  </h2>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-widest">
                  {activeMenu === 'ANALYTICS' ? 'Ringkasan statistik dan grafik data laporan sistem.' :
                    activeMenu === 'MAP' ? 'Visualisasi sebaran dan status unit DART secara geografis.' :
                    activeMenu === 'REPORTS' ? 'Kelola seluruh data laporan kerusakan dan perbaikan.' :
                    activeMenu === 'USERS' ? 'Kelola data pengguna dan akun personel sistem.' :
                    activeMenu === 'LOGS' ? 'Rekaman seluruh aktivitas dan perubahan data sistem.' :
                    activeMenu === 'UNITS' ? 'Status kesiapan unit DART.' :
                    activeMenu === 'SATUANS' ? 'Kelola data satuan dan unit yang terdaftar.' :
                    activeMenu === 'ROLES' ? 'Manajemen peran pengguna beserta hak aksesnya.' :
                    activeMenu === 'APPROVAL_CENTER' ? 'Tinjau dan setujui pengajuan mutasi serta registrasi.' :
                    'Sistem Manajemen Pelaporan Kerusakan Dart.'}
                </p>
              </div>

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
                userPermissions.includes('read-users') || isAdmin ? (
                  <UsersTable
                    dbUsers={dbUsers}
                    dbRoles={dbRoles}
                    dbPermissions={dbPermissions}
                    dbSatuans={dbSatuans}
                    userPermissions={userPermissions}
                    isAdmin={isAdmin}
                  />
                ) : renderUnauthorized('Manajemen Personel')
              )}
              {activeMenu === 'LOGS' && (
                isAdmin || userPermissions.includes('read-logs') ? (
                  <LogsTable
                    dbLogs={dbLogs}
                    logFilter={logFilter}
                    setLogFilter={setLogFilter}
                    setSelectedLogPayload={setSelectedLogPayload}
                  />
                ) : renderUnauthorized('Log Aktivitas')
              )}
              {activeMenu === 'UNITS' && (
                userPermissions.includes('read-units') || isAdmin ? (
                  <UnitsTable
                    dbUnits={dbUnits}
                    dbSatuans={dbSatuans}
                    dbCases={dbCases}
                    userPermissions={userPermissions}
                    isAdmin={isAdmin}
                  />
                ) : renderUnauthorized('Manajemen Inventaris')
              )}
              {activeMenu === 'SATUANS' && (
                userPermissions.includes('read-satuans') || isAdmin ? (
                  <SatuansTable
                    dbSatuans={dbSatuans}
                    dbUnits={dbUnits}
                    dbCases={dbCases}
                    dbUsers={dbUsers}
                    handleViewOnMap={(satuan: any) => {
                      setMapFocusSatuan(satuan.nama_satuan);
                      setActiveMenu('MAP');
                    }}
                    userPermissions={userPermissions}
                    isAdmin={isAdmin}
                  />
                ) : renderUnauthorized('Data Satuan')
              )}
              {activeMenu === 'ROLES' && (
                isAdmin ? (
                  <RolesTable
                    dbRoles={dbRoles}
                    dbPermissions={dbPermissions}
                    userPermissions={userPermissions}
                  />
                ) : renderUnauthorized('Roles & Akses')
              )}
              {activeMenu === 'APPROVAL_CENTER' && (
                userPermissions.includes('update-users') || userPermissions.includes('create-satuans') || isAdmin ? (
                  <ApprovalCenter
                    dbUsers={dbUsers}
                    dbMutations={dbMutations}
                    dbUserMutations={dbUserMutations}
                    dbSatuans={dbSatuans}
                    dbArchivedUnits={dbArchivedUnits}
                    handleApproveUser={handleApproveUser}
                    handleRejectUser={handleRejectUser}
                  />
                ) : renderUnauthorized('Pusat Persetujuan')
              )}
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
        actionType={userToReject?.type?.replace('request_', '') || 'add'}
      />

    </div>
  );
};

export default DashboardAdmin;
