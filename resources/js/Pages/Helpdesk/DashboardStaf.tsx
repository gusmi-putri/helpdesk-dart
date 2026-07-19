import React, { useState, useEffect, Suspense, lazy } from 'react';
import { FileArchive, Activity } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { router, usePage } from '@inertiajs/react';
import { Report, User, Unit, Mutation, Role, Satuan } from '@/types';
// Sub-components
import StafSidebar from './StafComponents/StafSidebar';
import StafTopbar from './StafComponents/StafTopbar';
import ProofModal from './StafComponents/ProofModal';
import ReportDetailModal from './StafComponents/ReportDetailModal';
import AssignTechnicianModal from './StafComponents/AssignTechnicianModal';
import StafRecapModal from './StafComponents/StafRecapModal';
import ReportRejectModal from './StafComponents/ReportRejectModal';
import StafUnitModal from './StafComponents/StafUnitModal';
import RequestDeleteModal from './StafComponents/RequestDeleteModal';
import StafUnitBatchModal from './StafComponents/StafUnitBatchModal';
import RequestDeleteBatchModal from './StafComponents/RequestDeleteBatchModal';

// Lazy loaded components for better performance
const TicketManager = lazy(() => import('./StafComponents/TicketManager'));
const CompletedReportsTable = lazy(() => import('./StafComponents/CompletedReportsTable'));
const InventorySection = lazy(() => import('./StafComponents/InventorySection'));
const StafMutationCenter = lazy(() => import('./StafComponents/StafMutationCenter'));
const UsersTable = lazy(() => import('./AdminComponents/UsersTable'));
const SatuansTable = lazy(() => import('./AdminComponents/SatuansTable'));

type MenuTab = 'MASUK' | 'SELESAI' | 'INVENTARIS' | 'MUTASI' | 'PERSONEL' | 'SATUANS';

interface DashboardStafProps {
  dbCases?: Report[];
  dbUsers?: User[];
  dbUnits?: Unit[];
  dbMutations?: Mutation[];
  dbUserMutations?: Mutation[];
  dbAllUsers?: User[];
  dbRoles?: Role[];
  dbSatuans?: Satuan[];
}

const DashboardStaf = (props: DashboardStafProps) => {
  const { dbCases = [], dbUsers = [], dbUnits = [], dbMutations = [], dbUserMutations = [], dbAllUsers = [], dbRoles = [], dbSatuans = [] } = props;
  const [activeMenu, setActiveMenu] = useState<MenuTab>('MASUK');
  const [assigningReportId, setAssigningReportId] = useState<number | null>(null);
  const [rejectingReportId, setRejectingReportId] = useState<number | null>(null);
  const [viewingProof, setViewingProof] = useState<{ report: Report; type: 'rusak' | 'selesai' } | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);

  // Recap States
  const [recapPeriod, setRecapPeriod] = useState<'weekly' | 'monthly' | 'yearly' | 'custom' | 'year_specific'>('monthly');
  const [recapStartDate, setRecapStartDate] = useState<string>('');
  const [recapEndDate, setRecapEndDate] = useState<string>('');
  const [recapYear, setRecapYear] = useState<string>(new Date().getFullYear().toString());

  // Inventory States
  const [unitSearch, setUnitSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('ALL');
  const [filterSatuan, setFilterSatuan] = useState('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Mutation States
  const [mutationActiveTab, setMutationActiveTab] = useState<'PERSONEL' | 'INVENTARIS' | 'SATUAN'>('PERSONEL');

  // Unit Mutation States
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isDeleteRequestModalOpen, setIsDeleteRequestModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
  const [mutationProcessing, setMutationProcessing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  // Batch Mutation States
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [isDeleteBatchModalOpen, setIsDeleteBatchModalOpen] = useState(false);
  const [selectedUnitsForDelete, setSelectedUnitsForDelete] = useState<Unit[]>([]);

  const { auth } = usePage().props as any;
  const currentUser = auth.user;
  const addNotification = useStore(state => state.addNotification);

  const selectedReport = dbCases.find((c: Report) => c.db_id === selectedReportId);

  // Auto-polling with visibility detection
  useEffect(() => {
    let intervalId: any;

    const startPolling = () => {
      intervalId = setInterval(() => {
        router.reload({ 
          only: ['dbCases', 'dbUsers', 'dbUnits', 'dbMutations', 'dbAllUsers'],
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

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Guided Tour Staf
  useEffect(() => {
    import('driver.js').then(({ driver }) => {
      import('driver.js/dist/driver.css').then(() => {
        if (localStorage.getItem('tour_staf_done') !== 'true') {
          const driverObj = driver({
            showProgress: true,
            animate: true,
            nextBtnText: 'Selanjutnya ➔',
            prevBtnText: '← Sebelumnya',
            doneBtnText: 'Selesai',
            steps: [
              {
                popover: {
                  title: 'Selamat Datang Staf',
                  description: 'Ini adalah Dashboard Manajemen Bantuan DART. Mari pelajari fitur utamanya.',
                }
              },
              {
                element: '#tour-laporan-masuk',
                popover: {
                  title: 'Laporan Masuk',
                  description: 'Tempat Anda memverifikasi, meneruskan, atau menolak laporan yang dikirimkan.',
                  side: 'right',
                  align: 'start'
                }
              },
              {
                element: '#tour-arsip-perbaikan',
                popover: {
                  title: 'Arsip Perbaikan',
                  description: 'Melihat semua riwayat laporan yang sudah selesai ditangani oleh Teknisi.',
                  side: 'right',
                  align: 'start'
                }
              },
              {
                element: '#tour-data-master',
                popover: {
                  title: 'Data Master',
                  description: 'Pengajuan mutasi untuk Personel, Inventaris, dan Satuan dilakukan di menu ini.',
                  side: 'right',
                  align: 'start'
                }
              }
            ],
            onDestroyed: () => {
              localStorage.setItem('tour_staf_done', 'true');
            }
          });
          
          setTimeout(() => {
            driverObj.drive();
          }, 500);
        }
      });
    });
  }, []);

  const handleAssignTechnician = (reportId: number, idTeknisi: number) => {
    router.post(`/reports/${reportId}/handle`, { teknisi_id: idTeknisi }, {
      onSuccess: () => {
        setAssigningReportId(null);
      },
      onError: () => {
        addNotification('Gagal menugaskan teknisi. Silakan periksa kembali koneksi Anda.', 'error');
      }
    });
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

    let url = `/staf/recap/export?period=${recapPeriod}`;
    if (recapPeriod === 'custom') {
      url += `&start_date=${recapStartDate}&end_date=${recapEndDate}`;
    } else if (recapPeriod === 'year_specific') {
      url += `&year=${recapYear}`;
    }
    window.open(url, '_blank');
    setIsRecapModalOpen(false);
  };

  const handleVerify = (reportId: number) => {
    router.post(`/reports/${reportId}/verify`, {}, {
      onSuccess: () => {
      },
      onError: () => {
        addNotification('Gagal memverifikasi laporan.', 'error');
      }
    });
  };

  const handleReject = (reportId: number, reason: string) => {
    router.post(`/reports/${reportId}/reject`, { alasan: reason }, {
      onSuccess: () => {
        setRejectingReportId(null);
      },
      onError: () => {
        addNotification('Gagal menolak laporan.', 'error');
      }
    });
  };

  // === Unit Mutation Handlers ===
  const handleAddUnitSubmit = (formData: FormData) => {
    setMutationProcessing(true);
    router.post('/units', formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsAddUnitModalOpen(false);
        setMutationProcessing(false);
        addNotification('Pengajuan penambahan unit telah dikirim. Menunggu persetujuan Admin.');
      },
      onError: () => {
        setMutationProcessing(false);
        addNotification('Gagal mengirim pengajuan. Periksa data yang diisi.', 'error');
      }
    });
  };

  const handleRequestDelete = (unit: Unit) => {
    setUnitToDelete(unit);
    setIsDeleteRequestModalOpen(true);
  };

  const handleSubmitDeleteRequest = (reason: string, document: File | null) => {
    if (!unitToDelete) return;
    setMutationProcessing(true);
    const formData = new FormData();
    formData.append('reason', reason);
    if (document) formData.append('document', document);

    router.post(`/units/${unitToDelete.id}/request-delete`, formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsDeleteRequestModalOpen(false);
        setUnitToDelete(null);
        setMutationProcessing(false);
        addNotification('Pengajuan penghapusan telah dikirim. Menunggu persetujuan Admin.');
      },
      onError: () => {
        setMutationProcessing(false);
        addNotification('Gagal mengirim pengajuan penghapusan.', 'error');
      }
    });
  };

  const handleAddBatchSubmit = (formData: FormData) => {
    setMutationProcessing(true);
    router.post('/units/request-add-batch', formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsAddBatchModalOpen(false);
        setMutationProcessing(false);
      },
      onError: () => {
        setMutationProcessing(false);
        addNotification('Gagal mengirim pengajuan massal.', 'error');
      }
    });
  };

  const handleRequestDeleteBatch = (selectedUnits: Unit[]) => {
    setSelectedUnitsForDelete(selectedUnits);
    setIsDeleteBatchModalOpen(true);
  };

  const handleSubmitDeleteBatch = (reason: string, document: File) => {
    setMutationProcessing(true);
    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('document', document);
    selectedUnitsForDelete.forEach(unit => {
      formData.append('unit_ids[]', String(unit.id));
    });

    router.post('/units/request-delete-batch', formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsDeleteBatchModalOpen(false);
        setSelectedUnitsForDelete([]);
        setMutationProcessing(false);
      },
      onError: () => {
        setMutationProcessing(false);
        addNotification('Gagal mengirim pengajuan penghapusan massal.', 'error');
      }
    });
  };

  const rejectingReport = dbCases.find((c: Report) => c.db_id === rejectingReportId);

  const incomingReports = dbCases.filter((r: Report) => r.status !== 'SELESAI' && r.status !== 'DITOLAK');
  const completedReports = dbCases.filter((r: Report) => r.status === 'SELESAI' || r.status === 'DITOLAK');
  const pendingMutations = dbMutations.filter((m: Mutation) => m.status === 'pending');

  return (
    <div className="h-screen bg-slate-50 dark:bg-cighra-dark flex flex-col font-sans selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-white relative text-gunmetal dark:text-slate-300">

      <StafTopbar
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentUser={currentUser}
      />
      <div className="flex-1 flex overflow-hidden">

        <StafSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          pendingCount={incomingReports.filter((r: Report) => r.status === 'PENDING').length}
          mutationPendingCount={pendingMutations.length}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col relative overflow-hidden h-full">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-2 flex justify-between items-end border-b border-slate-200 dark:border-slate-600 pb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase flex items-center gap-3">
                    {activeMenu === 'MASUK' ? 'MANAJEMEN LAPORAN MASUK' :
                      activeMenu === 'SELESAI' ? 'ARSIP DOKUMEN PENYELESAIAN' :
                        activeMenu === 'INVENTARIS' ? 'DATABASE INVENTARIS' :
                          activeMenu === 'MUTASI' ? 'RIWAYAT PENGAJUAN' :
                            activeMenu === 'SATUANS' ? 'DATA SATUAN' :
                              'DATA PERSONEL'}
                    {isPolling && (
                      <span className="flex items-center gap-1.5 text-[10px] font-mono text-cighra-primary dark:text-cighra-gold tracking-widest animate-pulse border border-cighra-primary/30 dark:border-cighra-gold/30 px-2 py-0.5 bg-cighra-primary/5 dark:bg-cighra-gold/10 rounded-sm">
                        <Activity className="w-3 h-3 animate-spin" /> SYNCING...
                      </span>
                    )}
                  </h2>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-widest">
                    {activeMenu === 'INVENTARIS' ? 'STATUS KESIAPAN UNIT DART.' :
                      activeMenu === 'MUTASI' ? (mutationActiveTab === 'PERSONEL' ? 'Riwayat pengajuan penambahan dan penghapusan data personel.' : mutationActiveTab === 'SATUAN' ? 'Riwayat pengajuan penambahan dan penghapusan data satuan.' : 'Riwayat pengajuan penambahan dan penghapusan unit inventaris.') :
                        activeMenu === 'PERSONEL' ? 'KELOLA DATA PENGGUNA SISTEM.' :
                          activeMenu === 'SATUANS' ? 'KELOLA DATA SATUAN KERJA.' :
                            'Sistem Manajemen Pelaporan Kerusakan Dart.'}
                  </p>
                </div>

                {(activeMenu === 'MASUK' || activeMenu === 'SELESAI') && (
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
                {activeMenu === 'MASUK' && (
                  <TicketManager
                    reports={dbCases}
                    onAssignTechnician={setAssigningReportId}
                    onViewProof={setViewingProof}
                    onVerify={handleVerify}
                    onReject={setRejectingReportId}
                  />
                )}

                {activeMenu === 'SELESAI' && (
                  <CompletedReportsTable
                    reports={completedReports}
                    onSelectReport={setSelectedReportId}
                    onViewProof={setViewingProof}
                  />
                )}

                {activeMenu === 'INVENTARIS' && (
                  <InventorySection
                    dbUnits={dbUnits}
                    unitSearch={unitSearch}
                    setUnitSearch={setUnitSearch}
                    filterJenis={filterJenis}
                    setFilterJenis={setFilterJenis}
                    filterSatuan={filterSatuan}
                    setFilterSatuan={setFilterSatuan}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    onAddUnit={() => setIsAddUnitModalOpen(true)}
                    onAddBatch={() => setIsAddBatchModalOpen(true)}
                    onRequestDelete={handleRequestDelete}
                    onRequestDeleteBatch={handleRequestDeleteBatch}
                  />
                )}

                {activeMenu === 'MUTASI' && (
                  <StafMutationCenter
                    dbMutations={dbMutations}
                    dbUserMutations={dbUserMutations}
                    dbSatuans={dbSatuans}
                    activeTab={mutationActiveTab}
                    setActiveTab={setMutationActiveTab}
                  />
                )}

                {activeMenu === 'PERSONEL' && (
                  <UsersTable
                    dbUsers={dbAllUsers}
                    dbRoles={dbRoles}
                    dbSatuans={dbSatuans}
                    isPengajuan={true}
                  />
                )}

                {activeMenu === 'SATUANS' && (
                  <SatuansTable
                    dbSatuans={dbSatuans}
                    dbUnits={dbUnits}
                    dbCases={dbCases}
                    dbUsers={dbAllUsers}
                    isPengajuan={true}
                  />
                )}
              </Suspense>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <ProofModal
        isOpen={!!viewingProof}
        onClose={() => setViewingProof(null)}
        viewingProof={viewingProof}
      />

      <ReportDetailModal
        isOpen={!!selectedReportId}
        onClose={() => setSelectedReportId(null)}
        report={selectedReport}
      />

      <AssignTechnicianModal
        isOpen={!!assigningReportId}
        onClose={() => setAssigningReportId(null)}
        technicians={dbUsers}
        onAssign={(techId) => assigningReportId && handleAssignTechnician(assigningReportId, techId)}
      />

      <StafRecapModal
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

      <ReportRejectModal
        isOpen={!!rejectingReportId}
        onClose={() => setRejectingReportId(null)}
        onConfirm={(reason) => rejectingReportId && handleReject(rejectingReportId, reason)}
        caseId={rejectingReport ? rejectingReport.caseId : ''}
      />

      {/* Unit Mutation Modals */}
      <StafUnitModal
        isOpen={isAddUnitModalOpen}
        onClose={() => setIsAddUnitModalOpen(false)}
        onSubmit={handleAddUnitSubmit}
        processing={mutationProcessing}
        dbSatuans={dbSatuans}
      />

      <RequestDeleteModal
        isOpen={isDeleteRequestModalOpen}
        onClose={() => { setIsDeleteRequestModalOpen(false); setUnitToDelete(null); }}
        onSubmit={handleSubmitDeleteRequest}
        unit={unitToDelete}
        processing={mutationProcessing}
      />

      <StafUnitBatchModal
        isOpen={isAddBatchModalOpen}
        onClose={() => setIsAddBatchModalOpen(false)}
        onSubmit={handleAddBatchSubmit}
        processing={mutationProcessing}
      />

      <RequestDeleteBatchModal
        isOpen={isDeleteBatchModalOpen}
        onClose={() => { setIsDeleteBatchModalOpen(false); setSelectedUnitsForDelete([]); }}
        onSubmit={handleSubmitDeleteBatch}
        selectedUnits={selectedUnitsForDelete}
        processing={mutationProcessing}
      />
    </div>
  );
};

export default DashboardStaf;
