import React, { useState, useEffect, Suspense, lazy } from 'react';
import { FileArchive } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { router, usePage } from '@inertiajs/react';


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

const DashboardStaf = (props: any) => {
  const { dbCases = [], dbUsers = [], dbUnits = [], dbMutations = [], dbUserMutations = [], dbAllUsers = [], dbRoles = [], dbSatuans = [] } = props;
  const [activeMenu, setActiveMenu] = useState<MenuTab>('MASUK');
  const [assigningReportId, setAssigningReportId] = useState<number | null>(null);
  const [rejectingReportId, setRejectingReportId] = useState<number | null>(null);
  const [viewingProof, setViewingProof] = useState<{ report: any; type: 'rusak' | 'selesai' } | null>(null);
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
  const [mutationActiveTab, setMutationActiveTab] = useState<'PERSONEL' | 'INVENTARIS'>('PERSONEL');

  // Unit Mutation States
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isDeleteRequestModalOpen, setIsDeleteRequestModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<any>(null);
  const [mutationProcessing, setMutationProcessing] = useState(false);
  // Batch Mutation States
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [isDeleteBatchModalOpen, setIsDeleteBatchModalOpen] = useState(false);
  const [selectedUnitsForDelete, setSelectedUnitsForDelete] = useState<any[]>([]);

  const { auth } = usePage().props as any;
  const currentUser = auth.user;
  const logoutAction = useStore(state => state.logout);
  const addNotification = useStore(state => state.addNotification);

  const selectedReport = dbCases.find((c: any) => c.db_id === selectedReportId);

  // Auto-polling with visibility detection
  useEffect(() => {
    let intervalId: any;

    const startPolling = () => {
      intervalId = setInterval(() => {
        router.reload({ only: ['dbCases', 'dbUsers', 'dbUnits', 'dbMutations', 'dbAllUsers'] });
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

  const handleRequestDelete = (unit: any) => {
    setUnitToDelete(unit);
    setIsDeleteRequestModalOpen(true);
  };

  const handleSubmitDeleteRequest = (reason: string, document: File | null) => {
    if (!unitToDelete) return;
    setMutationProcessing(true);
    const formData = new FormData();
    formData.append('reason', reason);
    if (document) formData.append('document', document);

    router.post(`/units/${unitToDelete.db_id}/request-delete`, formData, {
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

  const handleRequestDeleteBatch = (selectedUnits: any[]) => {
    setSelectedUnitsForDelete(selectedUnits);
    setIsDeleteBatchModalOpen(true);
  };

  const handleSubmitDeleteBatch = (reason: string, document: File) => {
    setMutationProcessing(true);
    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('document', document);
    selectedUnitsForDelete.forEach(unit => {
      formData.append('unit_ids[]', unit.db_id);
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

  const rejectingReport = dbCases.find((c: any) => c.db_id === rejectingReportId);

  const incomingReports = dbCases.filter((r: any) => r.status !== 'SELESAI' && r.status !== 'DITOLAK');
  const completedReports = dbCases.filter((r: any) => r.status === 'SELESAI' || r.status === 'DITOLAK');
  const pendingMutations = dbMutations.filter((m: any) => m.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-cighra-dark flex font-sans selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-white relative text-gunmetal dark:text-slate-300">

      <StafSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        pendingCount={incomingReports.filter((r: any) => r.status === 'PENDING').length}
        mutationPendingCount={pendingMutations.length}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

        <StafTopbar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentUser={currentUser}
        />

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-6 flex justify-between items-end border-b border-slate-200 dark:border-slate-600 pb-4">
              <div>
                <h2 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase">
                  {activeMenu === 'MASUK' ? 'MODUL PENUGASAN TEKNISI' :
                    activeMenu === 'SELESAI' ? 'ARSIP DOKUMEN PENYELESAIAN' :
                      activeMenu === 'INVENTARIS' ? 'DATABASE INVENTARIS' :
                        activeMenu === 'MUTASI' ? 'RIWAYAT PENGAJUAN' :
                          'DATA PERSONEL'}
                </h2>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-widest">
                  {activeMenu === 'INVENTARIS' ? 'STATUS KESIAPAN UNIT DART.' :
                    activeMenu === 'MUTASI' ? (mutationActiveTab === 'PERSONEL' ? 'Riwayat pengajuan penambahan dan penghapusan data personel.' : 'Riwayat pengajuan penambahan dan penghapusan unit inventaris.') :
                      activeMenu === 'PERSONEL' ? 'KELOLA DATA PENGGUNA SISTEM.' :
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
